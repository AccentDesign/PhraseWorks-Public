import { S3Client } from '@aws-sdk/client-s3';
import { getAllItems } from '../utils/r2.js';
import Meta from './meta.js';
import User from './user.js';
// import { PhotonImage, SamplingFilter, resize, crop } from '@cf-wasm/photon';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { doAction } from '../utils/actionBus.js';
import System from './system.js';

let getMimeType;
try {
  const mime = await import('mime');
  getMimeType = mime.getType || (mime.default && mime.default.getType);
  if (!getMimeType) throw new Error('mime.getType not found');
} catch (e) {
  await System.writeLogData(e.stack || String(e), 'backend');
  console.warn(
    'mime package not installed or failed to load, falling back to manual MIME types:',
    e.message,
  );
}

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
async function ensureUploadsDir() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    await System.writeLogData(err.stack || String(err), 'backend');
    console.error('Failed to create uploads directory:', err);
    throw new Error('Failed to initialize uploads directory');
  }
}

export default class Media {
  constructor() {}
  static async uploadFile(key, file, connection, userId, width, height, env, url) {
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

    const settingsJSON = await Media.getSettings(connection);
    const settings = JSON.parse(settingsJSON.option_value);

    const filename = file.filename.split('.').slice(0, -1).join('.');
    await Meta.updatePostMetaEntry(connection, '_pw_attached_file', postId, filename, false);

    const meta = {
      width: width,
      height: height,
      file: filename,
      sizes: [],
    };

    if (width != null) {
      await ensureUploadsDir();

      // map each setting to a promise
      const resizePromises = settings.map(async (setting) => {
        const { file: resized, fileName } = await Media.createThumbnail(
          file,
          parseInt(setting.width),
          parseInt(setting.height),
          filename,
          setting.slug,
        );

        const filePath = path.join(UPLOADS_DIR, fileName);
        const buffer = Buffer.from(await resized.arrayBuffer());

        const hookFileUploadDataResult = await doAction('upload_file', filePath, fileName, buffer);
        if (hookFileUploadDataResult == undefined) {
          await fs.writeFile(filePath, buffer);
        }

        return {
          slug: setting.slug,
          file: fileName,
          width: setting.width,
          height: setting.height,
          'mime-type': resized.type || 'image/webp',
        };
      });

      // wait for all thumbnails to finish
      meta.sizes = await Promise.all(resizePromises);
    }

    const metaSave = await Meta.updatePostMetaEntry(
      connection,
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

      const resizedImage = await sharp(imageBuffer)
        .resize(width, height, {
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
      await System.writeLogData(err.stack || String(err), 'backend');
      throw new Error('Image resizing failed');
    }
  }

  static async getImageDimensions(file) {
    if (!file || !file.data || typeof file.data !== 'string') {
      throw new Error('Invalid file object: missing base64 data.');
    }

    try {
      const { data: base64 } = file;
      let buffer;

      try {
        const binary = Buffer.from(base64, 'base64');
        if (binary.length === 0) throw new Error();
        buffer = binary.buffer;
      } catch {
        throw new Error('Invalid base64 encoding in file data.');
      }

      const uint8 = new Uint8Array(buffer);
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
      throw new Error('Unsupported or corrupted image format.');
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      console.error('Error parsing image dimensions:', {
        message: err.message,
        fileMeta: {
          filename: file.filename,
          type: file.type,
          size: file.size,
        },
      });
      throw err;
    }
  }

  static async deleteFile(c, sql, filepath) {
    const postsRows = await sql`SELECT * FROM pw_posts WHERE guid=${filepath}`;
    if (postsRows.length > 0) {
      await sql`DELETE FROM pw_posts WHERE id=${postsRows[0].id}`;
      await sql`DELETE FROM pw_postmeta WHERE post_id=${postsRows[0].id}`;
    }

    const absolutePath = path.join(process.cwd(), 'uploads', filepath);
    try {
      await fs.access(absolutePath);
      await fs.unlink(absolutePath);

      return true;
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      if (err.code === 'ENOENT') {
        return false;
      }
      throw new Error(`Failed to delete file: ${err.message}`);
    }
  }

  static async getSettings(sql) {
    const entry = await Meta.getOptionsMetaEntry(sql, 'media_settings');
    return entry;
  }

  static async updateSettings(sql, data) {
    const success = await Meta.updateOptionsMetaEntry(sql, 'media_settings', data);
    return { success: success };
  }

  static async getLocalFiles(folder = '', offset = 0, type = '', search = '', env = process.env) {
    const uploadsDir = path.join(process.cwd(), 'uploads', folder);
    let files = [];
    let folders = [];

    try {
      const dirEntries = await fs.readdir(uploadsDir, { withFileTypes: true });

      for (const entry of dirEntries) {
        const fullPath = path.join(uploadsDir, entry.name);
        const relativePath = path.join(folder, entry.name);
        const key = relativePath.toLowerCase();

        if (
          key.includes('-thumbnail.') ||
          key.includes('-large.') ||
          key.includes('-medium.') ||
          key.includes('-banner.') ||
          entry.name === '.DS_Store'
        ) {
          continue;
        }

        if (entry.isFile()) {
          const stats = await fs.stat(fullPath);
          files.push({
            id: relativePath,
            key: relativePath,
            size: stats.size,
            contentType: this.getContentType(entry.name),
            lastModified: stats.mtime,
            url: `${env.APP_BASE_URL || 'http://localhost'}/uploads/${relativePath}`,
          });
        } else if (entry.isDirectory()) {
          folders.push(relativePath);
        }
      }

      if (type) {
        files = files.filter((file) => file.contentType.includes(type));
      }
      if (search) {
        const searchLower = search.toLowerCase();
        files = files.filter((file) => file.key.toLowerCase().includes(searchLower));
      }

      files = files.slice(offset);

      return {
        files,
        folders,
      };
    } catch (err) {
      await System.writeLogData(err.stack || String(err), 'backend');
      console.error('Error listing files:', err);
      throw new Error('Failed to list files');
    }
  }

  static getContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp',
      '.ico': 'image/x-icon',
      '.tiff': 'image/tiff',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  static async getR2Files(folder, offset, type, search, env) {
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });
    const allFiles = await getAllItems(s3Client, env.R2_BUCKET_NAME);
    const files = allFiles.objects.reduce((acc, obj) => {
      const key = obj.Key.toLowerCase();
      if (
        key.includes('-thumbnail.') ||
        key.includes('-large.') ||
        key.includes('-medium.') ||
        key.includes('-banner.')
      ) {
        return acc; // skip
      }
      acc.push({
        id: obj.Key,
        key: obj.Key,
        size: obj.Size,
        contentType: obj.ContentType || 'unknown',
        lastModified: obj.LastModified,
        url: `http://localhost/r2/${obj.Key}`,
      });
      return acc;
    }, []);
    const folders = allFiles.delimitedPrefixes || [];
    const result = {
      files,
      folders,
    };

    return result;
  }

  static async getFiles(folder, offset, type, search, connection) {
    const conditions = [`p.post_type = 'attachment'`];
    const values = [];

    if (type === 'image') {
      conditions.push(`p.post_mime_type LIKE 'image/%'`);
    } else if (type === 'document') {
      conditions.push(`
            p.post_mime_type NOT LIKE 'image/%'
          `);
    } else if (type === 'not_image') {
      conditions.push(`p.post_mime_type NOT LIKE 'image/%'`);
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
            attachment_metadata.meta_value AS metadata,
            imagemeta.meta_value AS imagemeta
          FROM pw_posts p
          LEFT JOIN pw_postmeta pm 
            ON p.ID = pm.post_id AND pm.meta_key = '_pw_attached_file'
          LEFT JOIN pw_postmeta attachment_metadata 
            ON p.ID = attachment_metadata.post_id AND attachment_metadata.meta_key = '_pw_attachment_metadata'
          LEFT JOIN pw_postmeta imagemeta 
            ON p.ID = imagemeta.post_id AND imagemeta.meta_key = '_pw_meta_data'
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
        metadata: file.imagemeta,
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
      whereParts.push(`post_mime_type NOT LIKE $${valuesCount.length + 1}`);
      valuesCount.push('image/%');
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
            attachment_metadata.meta_value AS metadata,
            imagemeta.meta_value as imagemeta
          FROM pw_posts p
          LEFT JOIN pw_postmeta pm 
            ON p.ID = pm.post_id AND pm.meta_key = '_pw_attached_file'
          LEFT JOIN pw_postmeta attachment_metadata 
            ON p.ID = attachment_metadata.post_id AND attachment_metadata.meta_key = '_pw_attachment_metadata'          
          LEFT JOIN pw_postmeta imagemeta 
            ON p.ID = imagemeta.post_id AND imagemeta.meta_key = '_pw_meta_data'
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
  static async getFile(r2File, connection) {
    const [file] = await connection`SELECT 
            p.ID, 
            p.post_title, 
            p.post_mime_type, 
            p.guid, 
            p.post_author,
            p.post_date,
            pm.meta_value AS file_path,
            attachment_metadata.meta_value AS metadata,
            imagemeta.meta_value as imagemeta
          FROM pw_posts p
          LEFT JOIN pw_postmeta pm 
            ON p.ID = pm.post_id AND pm.meta_key = '_pw_attached_file'
          LEFT JOIN pw_postmeta attachment_metadata 
            ON p.ID = attachment_metadata.post_id AND attachment_metadata.meta_key = '_pw_attachment_metadata'          
          LEFT JOIN pw_postmeta imagemeta 
            ON p.ID = imagemeta.post_id AND imagemeta.meta_key = '_pw_meta_data'
          WHERE p.guid=${r2File.key}`;

    let data = null;
    if (file) {
      const title = file.guid.replace('http://localhost/', '');

      data = {
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
    } else {
      data = {
        id: null,
        filename: r2File.key,
        mimetype:
          r2File.contentType == 'unknown'
            ? Media.getContentTypeByExtension(r2File.key)
            : r2File.contentType,
        url: `http://localhost/r2/${r2File.key}`,
        date: '',
        author: null,
        attachment_metadata: JSON.stringify({}),
      };
    }
    return data;
  }
  static async getMediaItemData(fileId, connection) {
    const data =
      await connection`SELECT * FROM pw_postmeta WHERE post_id = 98 AND meta_key = '_pw_meta_data'`;
    return JSON.stringify(data[0].meta_value);
  }

  static getContentTypeByExtension(filename) {
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
}
