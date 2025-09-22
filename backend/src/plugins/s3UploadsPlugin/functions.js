import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';

export async function getS3Env(connection) {
  const data = await connection`SELECT * FROM pw_options WHERE option_name='_s3_uploads_plugin'`;
  if (data.length == 0) {
    return false;
  }
  return JSON.parse(data[0].option_value);
}

export function getS3Client(env) {
  return new S3Client({
    region: 'auto',
    endpoint: env.endpoint,
    credentials: {
      accessKeyId: env.accessKeyId,
      secretAccessKey: env.secretAccessKey,
    },
  });
}

export async function getAllItems(s3Client, bucketName) {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
  });

  const response = await s3Client.send(command);
  return {
    objects: response.Contents || [],
    delimitedPrefixes: response.CommonPrefixes || [],
  };
}
export async function uploadFile(key, file, width, height, s3Client, connection, userId, url, env) {
  const slug = key
    .split('.')
    .slice(0, -1)
    .join('.')
    .replace(/\./g, '-')
    .replace(/_/g, ' ')
    .replace(/@/g, '-')
    .replace(/\b\w/g, (l) => l.toUpperCase());
  const title = key
    .split('.')
    .slice(0, -1)
    .join('.')
    .replace(/\b\w/g, (l) => l.toUpperCase());
  const mimeType = file.type;
  const guid = `${key}`;

  const insert = await connection`
    INSERT INTO pw_posts (
        post_author,
        post_date,
        post_date_gmt,
        post_content,
        post_title,
        post_excerpt,
        post_status,
        post_name,
        post_modified,
        post_modified_gmt,
        post_type,
        guid,
        post_mime_type
    ) VALUES (
        ${userId},
        NOW(),
        NOW(),
        '',
        ${title},
        '',
        'inherit',
        ${slug},
        NOW(),
        NOW(),
        'attachment',
        ${guid},
        ${mimeType}
    )
    RETURNING id;
  `;
  const postId = insert[0]?.id;

  const settingsJSON = await getSettings(connection);
  const settings = JSON.parse(settingsJSON.option_value);
  const filename = file.filename.split('.').slice(0, -1).join('.');
  await updatePostMetaEntry(connection, '_pw_attached_file', postId, filename, false);
  const meta = {
    width: width,
    height: height,
    file: filename,
    sizes: [],
  };
  if (width != null) {
    for (const setting of settings) {
      const { file: resized, fileName } = await createThumbnail(
        file,
        setting.width,
        setting.height,
        filename,
        setting.slug,
      );

      const buffer = Buffer.from(await resized.arrayBuffer());

      await s3Client.send(
        new PutObjectCommand({
          Bucket: env.bucketName,
          Key: fileName,
          Body: buffer,
          ContentType: getContentTypeByExtension(filename),
          ACL: 'public-read',
        }),
      );

      meta.sizes.push({
        slug: setting.slug,
        file: fileName,
        width: setting.width,
        height: setting.height,
        'mime-type': resized.type || 'image/webp',
      });
    }
  }

  const metaSave = await updatePostMetaEntry(
    connection,
    '_pw_attachment_metadata',
    postId,
    JSON.stringify(meta),
    true,
  );

  return insert;
}

async function updatePostMetaEntry(connection, name, postId, value, singleOnly) {
  const entry = await getPostMetaEntry(connection, name, postId);

  let success = false;

  if (singleOnly) {
    if (entry == null) {
      const save =
        await connection`INSERT INTO pw_postmeta(post_id, meta_key, meta_value) VALUES (${postId}, ${name}, ${value})`;
      if (save.count && save.count > 0) {
        success = true;
      } else {
        success = false;
      }
    } else {
      const save = await connection`
          UPDATE pw_postmeta
          SET meta_value = ${value}
          WHERE meta_id = ${entry.meta_id}
        `;
      if (save.count && save.count > 0) {
        success = true;
      } else {
        success = false;
      }
    }
  } else {
    const save =
      await connection`INSERT INTO pw_postmeta(post_id, meta_key, meta_value) VALUES (${postId}, ${name}, ${value})`;
    if (save.count && save.count > 0) {
      success = true;
    } else {
      success = false;
    }
  }
  return success;
}

async function getPostMetaEntry(connection, name, postId) {
  const entry =
    await connection`SELECT * FROM pw_postmeta WHERE post_id=${postId} AND meta_key=${name}`;
  if (entry.length == 0) return null;
  return entry[0];
}

export async function getSettings(connection) {
  const entry = await getOptionsMetaEntry(connection, 'media_settings');
  return entry;
}

async function getOptionsMetaEntry(connection, name) {
  const entry = await connection`SELECT * FROM pw_options WHERE option_name=${name}`;
  if (entry.length == 0) return null;
  return entry[0];
}

export function getContentTypeByExtension(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  const mimeTypes = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    tiff: 'image/tiff',

    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    rtf: 'application/rtf',
    odt: 'application/vnd.oasis.opendocument.text',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    csv: 'text/csv',
  };

  return mimeTypes[extension] || 'application/octet-stream';
}

export async function createThumbnail(
  file,
  width = 150,
  height = 150,
  originalFilename = 'test',
  filename = 'thumbnail',
) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid image file');
  }

  try {
    const { data: base64 } = file;
    const imageBuffer = Buffer.from(base64, 'base64');

    const metadata = await sharp(imageBuffer).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image dimensions');
    }

    const newFileName = `${originalFilename}-${filename}.webp`;

    if (metadata.width < width && metadata.height < height) {
      return {
        file: new File([imageBuffer], newFileName, {
          type: 'image/webp',
          lastModified: Date.now(),
        }),
        fileName: newFileName,
      };
    }

    const ratio = Math.max(width / metadata.width, height / metadata.height);
    const resizedWidth = Math.ceil(metadata.width * ratio);
    const resizedHeight = Math.ceil(metadata.height * ratio);

    const resizedImage = await sharp(imageBuffer)
      .resize({
        width: resizedWidth,
        height: resizedHeight,
        fit: 'cover',
        position: 'center',
      })
      .webp()
      .toBuffer();

    return {
      file: new File([resizedImage], newFileName, {
        type: 'image/webp',
        lastModified: Date.now(),
      }),
      fileName: newFileName,
    };
  } catch (err) {
    console.error('Thumbnail generation failed:', err);
    throw new Error('Image resizing failed');
  }
}

export async function getImageDimensions(file) {
  try {
    const { data: base64 } = file;
    const uint8 = Uint8Array.from(Buffer.from(base64, 'base64'));
    const buffer = uint8.buffer;
    const view = new DataView(buffer);

    // JPEG: Look for SOF (Start of Frame) marker
    if (uint8[0] === 0xff && uint8[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.byteLength) {
        if (uint8[offset] === 0xff) {
          const marker = uint8[offset + 1];
          if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xcc) {
            const height = view.getUint16(offset + 5);
            const width = view.getUint16(offset + 7);
            return { width, height, buffer };
          }
          offset += 2 + view.getUint16(offset + 2);
        } else {
          break;
        }
      }
    }

    // PNG: Check IHDR chunk
    else if (uint8[0] === 0x89 && uint8[1] === 0x50 && uint8[2] === 0x4e && uint8[3] === 0x47) {
      if (buffer.byteLength >= 24 && String.fromCharCode(...uint8.slice(12, 16)) === 'IHDR') {
        const width = view.getUint32(16);
        const height = view.getUint32(20);
        return { width, height, buffer };
      }
    }
    // WebP: Check RIFF and VP8/VP8L/VP8X chunks
    else if (
      buffer.byteLength >= 12 &&
      String.fromCharCode(...uint8.slice(0, 4)) === 'RIFF' &&
      String.fromCharCode(...uint8.slice(8, 12)) === 'WEBP'
    ) {
      const chunkType = String.fromCharCode(...uint8.slice(12, 16));
      // VP8 (lossy)
      if (chunkType === 'VP8 ' && buffer.byteLength >= 30) {
        const syncCode = uint8.slice(23, 26);
        if (syncCode[0] === 0x9d && syncCode[1] === 0x01 && syncCode[2] === 0x2a) {
          const width = view.getUint16(26, true) & 0x3fff; // 14 bits
          const height = view.getUint16(28, true) & 0x3fff; // 14 bits
          return { width, height, buffer };
        }
      }
      // VP8L (lossless)
      else if (chunkType === 'VP8L' && buffer.byteLength >= 25) {
        if (uint8[20] === 0x2f) {
          const bits = view.getUint32(21, true);
          const width = (bits & 0x3fff) + 1; // 14 bits + 1
          const height = ((bits >> 14) & 0x3fff) + 1; // 14 bits + 1
          return { width, height, buffer };
        }
      }
      // VP8X (extended)
      else if (chunkType === 'VP8X' && buffer.byteLength >= 30) {
        const width = view.getUint32(24, true) & 0xffffff; // 24 bits + 1
        const height = view.getUint32(27, true) & 0xffffff; // 24 bits + 1
        return { width: width + 1, height: height + 1, buffer };
      }
    }
    return null;
  } catch (err) {
    console.error('Error parsing image dimensions:', err);
    return null;
  }
}

export async function deleteFile(filepath, env, connection, s3Client, settingsObjects) {
  const postsRows = await connection`SELECT * FROM pw_posts WHERE guid=${filepath}`;
  if (postsRows.length > 0) {
    await connection`DELETE FROM pw_posts WHERE id=${postsRows[0].id}`;
    await connection`DELETE FROM pw_postmeta WHERE post_id=${postsRows[0].id}`;
  }
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: env.bucketName,
      Key: filepath,
    }),
  );

  const originalFilepath = filepath;

  const dotIndex = originalFilepath.lastIndexOf('.');
  const baseName = dotIndex !== -1 ? originalFilepath.slice(0, dotIndex) : originalFilepath;

  for (const size of settingsObjects) {
    const newFilepath = `${baseName}-${size.slug}.webp`;
    try {
      await s3Client.send(
        new HeadObjectCommand({
          Bucket: env.bucketName,
          Key: newFilepath,
        }),
      );

      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: env.bucketName,
          Key: newFilepath,
        }),
      );
    } catch (err) {
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      } else {
        throw err;
      }
    }
  }
  return true;
}
