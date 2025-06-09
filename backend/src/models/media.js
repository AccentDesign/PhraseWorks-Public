import Meta from './meta';
import User from './user';
import { PhotonImage, SamplingFilter, resize, crop } from '@cf-wasm/photon';

export default class Media {
  constructor() {}
  static async uploadFile(key, file, sql, userId, width, height, env) {
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
    const insert = await sql`
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
        ${`https://localhost/${key}`},
        ${mimeType}
    )
    RETURNING id;
    `;
    const postId = insert[0]?.id;

    const settingsJSON = await Media.getSettings(sql);
    const settings = JSON.parse(settingsJSON.option_value);

    await Meta.updatePostMetaEntry(sql, '_pw_attached_file', postId, file.name, false);

    const meta = {
      width: width,
      height: height,
      file: file.name,
      sizes: [],
    };

    for (const setting of settings) {
      const resized = await Media.createThumbnail(
        file,
        setting.width,
        setting.height,
        file.name.replace(/\.[^/.]+$/, ''),
        setting.slug,
      );
      await env.phrase_works.put(resized.name, resized.stream());
      meta.sizes.push({
        slug: setting.slug,
        file: resized.name,
        width: setting.width,
        height: setting.height,
        'mime-type': resized.mimeType || 'image/webp',
      });
    }
    const metaSave = await Meta.updatePostMetaEntry(
      sql,
      '_pw_attachment_metadata',
      postId,
      JSON.stringify(meta),
      true,
    );

    return insert;
  }

  static async createThumbnail(
    file,
    width = 150,
    height = 150,
    originalFilename = 'test',
    filename = 'thumbnail',
  ) {
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid image file');
    }
    if (file.size === 0) {
      throw new Error('Empty file buffer');
    }

    try {
      const imageBuffer = new Uint8Array(await file.arrayBuffer());
      const inputImage = PhotonImage.new_from_byteslice(imageBuffer);
      const originalWidth = inputImage.get_width();
      const originalHeight = inputImage.get_height();

      console.log(`Original: ${originalWidth}x${originalHeight}, Target: ${width}x${height}`);

      if (originalWidth === 0 || originalHeight === 0) {
        inputImage.free();
        throw new Error('Invalid image dimensions');
      }

      // Prevent upsampling
      if (originalWidth < width && originalHeight < height) {
        console.log('Image smaller than target, returning original');
        inputImage.free();
        return new File([imageBuffer], filename, {
          type: 'image/webp',
          lastModified: Date.now(),
        });
      }

      // Calculate cover scale ratio
      const ratio = Math.max(width / originalWidth, height / originalHeight);
      const resizedWidth = Math.ceil(originalWidth * ratio);
      const resizedHeight = Math.ceil(originalHeight * ratio);

      console.log(`Resizing to: ${resizedWidth}x${resizedHeight}`);

      // Resize (aspect-fill)
      const resizedImage = resize(
        inputImage,
        resizedWidth,
        resizedHeight,
        SamplingFilter.CatmullRom,
      );

      // Calculate centered crop coordinates
      const cropX = Math.max(0, Math.floor((resizedWidth - width) / 2));
      const cropY = Math.max(0, Math.floor((resizedHeight - height) / 2));
      const cropX2 = Math.min(resizedWidth, cropX + width);
      const cropY2 = Math.min(resizedHeight, cropY + height);

      console.log(`Cropping from (${cropX}, ${cropY}) to (${cropX2}, ${cropY2})`);

      // Crop center
      let croppedImage = crop(resizedImage, cropX, cropY, cropX2, cropY2);

      // Verify cropped dimensions
      const croppedWidth = croppedImage.get_width();
      const croppedHeight = croppedImage.get_height();
      console.log(`Cropped: ${croppedWidth}x${croppedHeight}`);

      if (croppedWidth !== width || croppedHeight !== height) {
        console.warn(`Crop failed to enforce ${width}x${height}, resizing again`);
        const finalImage = resize(croppedImage, width, height, SamplingFilter.CatmullRom);
        croppedImage.free();
        croppedImage = finalImage;
      }

      const outputBytes = croppedImage.get_bytes_webp();

      // Free memory
      inputImage.free();
      resizedImage.free();
      croppedImage.free();

      const newFileName = `${originalFilename}-${filename}.webp`;
      return new File([outputBytes], newFileName, {
        type: 'image/webp',
        lastModified: Date.now(),
      });
    } catch (err) {
      console.error('Thumbnail generation failed:', err);
      throw new Error('Image resizing failed');
    }
  }

  static async getImageDimensions(file) {
    try {
      const buffer = await file.arrayBuffer();
      const view = new DataView(buffer);
      const uint8 = new Uint8Array(buffer);

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

      // Unsupported format
      return null;
    } catch (err) {
      console.error('Error parsing image dimensions:', err);
      return null;
    }
  }

  static async deleteFile(c, sql, id) {
    const post = await sql`SELECT * FROM pw_posts WHERE id=${id}`;
    if (post.length == 0) return false;

    const key = post[0].guid.replace('https://localhost/', '');
    const object = await c.env.phrase_works.get(key);
    if (!object) {
      console.log('File not found in R2');
      return false;
    }
    await c.env.phrase_works.delete(key);
    console.log('Deleted from R2');

    // Optionally, delete from DB too
    await sql`DELETE FROM pw_posts WHERE id=${id}`;

    return true;
  }

  static async getSettings(sql) {
    const entry = await Meta.getOptionsMetaEntry(sql, 'media_settings');
    return entry;
  }

  static async updateSettings(sql, data) {
    const success = await Meta.updateOptionsMetaEntry(sql, 'media_settings', data);
    return { success: success };
  }

  static async getFiles(folder, offset, type, search, connection) {
    const conditions = [`p.post_type = 'attachment'`];
    const values = [];

    if (type === 'image') {
      conditions.push(`p.post_mime_type LIKE 'image/%'`);
    } else if (type === 'document') {
      conditions.push(`
            p.post_mime_type IN (
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'application/vnd.ms-excel',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'application/vnd.ms-powerpoint',
              'application/vnd.openxmlformats-officedocument.presentationml.presentation',
              'text/plain'
            )
          `);
    }

    if (search && search.trim() !== '') {
      conditions.push(`p.post_title ILIKE $${values.length + 1}`);
      values.push(`%${search.trim()}%`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
          SELECT 
            p.ID, 
            p.post_title, 
            p.post_mime_type, 
            p.guid, 
            p.post_author,
            p.post_date,
            pm.meta_value AS file_path,
            attachment_metadata.meta_value AS metadata
          FROM pw_posts p
          LEFT JOIN pw_postmeta pm 
            ON p.ID = pm.post_id AND pm.meta_key = '_pw_attached_file'
          LEFT JOIN pw_postmeta attachment_metadata 
            ON p.ID = attachment_metadata.post_id AND attachment_metadata.meta_key = '_pw_attachment_metadata'
          ${whereClause}
          ORDER BY p.post_date DESC
          LIMIT 20 OFFSET $${values.length + 1};
        `;
    values.push(offset);

    const filesDb = await connection.unsafe(query, values);

    const files = [];

    for (const file of filesDb) {
      const title = file.guid.replace('https://localhost/', '');
      const data = {
        id: file.id,
        filename: title,
        mimetype: file.post_mime_type,
        url: file.guid,
        date: file.post_date.toISOString(),
        author: null,
        attachment_metadata: file.metadata,
      };

      if (file.post_author !== '' && file.post_author != null) {
        data.author = await User.findById(file.post_author, connection);
      }
      files.push(data);
    }
    return files;
  }

  static async getCount(type, search, connection) {
    let whereParts = [];
    let valuesCount = [];

    if (type === 'image') {
      whereParts.push(`post_mime_type LIKE $${valuesCount.length + 1}`);
      valuesCount.push('image/%');
    } else if (type === 'document') {
      whereParts.push(`post_mime_type IN (
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain'
          )`);
    }

    whereParts.push(`post_type = 'attachment'`);

    if (search && search.trim() !== '') {
      whereParts.push(`post_title ILIKE $${valuesCount.length + 1}`);
      valuesCount.push(`%${search.trim()}%`);
    }

    const whereClauseCount = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

    const queryCount = `
          SELECT COUNT(*)::int AS count
          FROM pw_posts
          ${whereClauseCount}
        `;

    const [{ count }] = await connection.unsafe(queryCount, valuesCount);
    return count;
  }
  static async getFileById(id, connection) {
    const file = await connection`SELECT 
            p.ID, 
            p.post_title, 
            p.post_mime_type, 
            p.guid, 
            p.post_author,
            p.post_date,
            pm.meta_value AS file_path,
            attachment_metadata.meta_value AS metadata
          FROM pw_posts p
          LEFT JOIN pw_postmeta pm 
            ON p.ID = pm.post_id AND pm.meta_key = '_pw_attached_file'
          LEFT JOIN pw_postmeta attachment_metadata 
            ON p.ID = attachment_metadata.post_id AND attachment_metadata.meta_key = '_pw_attachment_metadata'
          WHERE p.id=${id}`;
    const title = file[0].guid.replace('https://localhost/', '');
    const data = {
      id: file[0].id,
      filename: title,
      mimetype: file[0].post_mime_type,
      url: file[0].guid,
      date: file[0].post_date.toISOString(),
      author: null,
      attachment_metadata: file[0].metadata,
    };

    if (file[0].post_author !== '' && file[0].post_author != null) {
      data.author = await User.findById(file[0].post_author, connection);
    }
    return data;
  }
}
