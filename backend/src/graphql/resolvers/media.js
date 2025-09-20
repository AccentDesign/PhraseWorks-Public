import Media from '../../models/media.js';
import fs from 'fs/promises';
import path from 'path';
import { doAction } from '../../utils/actionBus.js';
import Meta from '../../models/meta.js';
import sharp from 'sharp';
import System from '../../models/system.js';
import { clearMediaCache, getCache } from '../../utils/cache.js';
import { jobQueue } from '../../utils/jobQueue.js';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
async function ensureUploadsDir() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create uploads directory:', err);
    throw new Error('Failed to initialize uploads directory');
  }
}

function isBase64(str) {
  try {
    return Buffer.from(str, 'base64').toString('base64') === str.replace(/\r?\n|\r/g, '');
  } catch {
    return false;
  }
}

export default {
  Query: {
    getMediaFiles: async function (
      _,
      { folder, offset = 0, type, search },
      { connection, isAuth, c },
    ) {
      if (!isAuth) {
        throw Object.assign(new Error('Invalid Auth Token.'), { code: 401 });
      }

      const cacheKey = `media:getMediaFiles:${folder}:${offset}:${type}:${search || ''}`;
      const cached = await getCache(cacheKey);
      if (cached) return cached;

      const page = Math.floor(offset / 20) + 1;

      let filesData = await Media.getLocalFiles(folder, type, search, offset, c.env);
      const hookFilesDataResult = await doAction(
        'get_files',
        folder,
        type,
        search,
        offset,
        c.env,
        connection,
      );
      if (hookFilesDataResult !== undefined && hookFilesDataResult !== filesData) {
        filesData = hookFilesDataResult;
      }
      let tmpFiles = null;

      if (search != '') {
        tmpFiles = filesData.filter((file) =>
          file.key.toLowerCase().includes(search.toLowerCase()),
        );
      } else {
        tmpFiles = filesData.files;
      }

      const imageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/bmp',
        'image/tiff',
      ];

      const fileTypes = [
        'application/pdf',
        'application/msword', // DOC
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'text/plain', // TXT
        'application/rtf', // RTF
        'application/vnd.oasis.opendocument.text', // ODT
        'application/vnd.ms-excel', // XLS
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
        'application/vnd.ms-powerpoint', // PPT
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
        'text/csv',
      ];

      let filteredFiles = tmpFiles;
      if (type === 'image') {
        filteredFiles = tmpFiles.filter((file) => imageTypes.includes(file.contentType));
      } else if (type === 'document') {
        filteredFiles = tmpFiles.filter((file) => fileTypes.includes(file.contentType));
      } else {
        filteredFiles = tmpFiles;
      }

      const start = (page - 1) * 20;
      const end = start + 20;
      const paginatedFiles = filteredFiles.slice(start, end);
      let files = [];
      for (const r2File of paginatedFiles) {
        const data = await Media.getFile(r2File, connection);
        files.push(data);
      }
      const count = await Media.getCount(type, search, connection);

      const result = { files, total: filteredFiles.length };
      return result;
    },

    getMediaFileById: async function (_, { id }, { connection }) {
      const cacheKey = `media:getMediaFileById:${id}`;
      const cached = await getCache(cacheKey);
      if (cached) return cached;

      const file = await Media.getFileById(id, connection);

      return file;
    },

    getMediaSettings: async function (_, {}, { connection, isAuth, c }) {
      if (!isAuth) throw Object.assign(new Error('Invalid Auth Token.'), { code: 401 });

      const cacheKey = `media:getMediaSettings`;
      const cached = await getCache(cacheKey);
      if (cached) return cached;

      const settings = await Media.getSettings(connection);
      const result = { settings: settings.option_value };

      return result;
    },

    getMediaItemData: async function (_, { fileId }, { connection, c }) {
      const cacheKey = `media:getMediaItemData:${fileId}`;
      const cached = await getCache(cacheKey);
      if (cached) return cached;

      const data = await Media.getMediaItemData(fileId, connection);

      return data;
    },
  },

  Mutation: {
    uploadFile: async (_, { file }, { env, connection, isAuth, userId, url, c }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      if (!file || typeof file !== 'object') {
        throw new Error('No file provided or invalid file object.');
      }
      const { filename, data: base64, type, size } = file;

      if (!filename || typeof filename !== 'string') {
        throw new Error('Invalid or missing filename.');
      }
      if (!base64 || typeof base64 !== 'string') {
        throw new Error('Invalid or missing file data.');
      }

      if (!isBase64(base64)) {
        throw new Error('Invalid base64 file data.');
      }

      if (!type || typeof type !== 'string') {
        throw new Error('Invalid or missing file type.');
      }
      if (typeof size !== 'number' || size <= 0) {
        throw new Error('Invalid file size.');
      }

      try {
        let width = 0;
        let height = 0;

        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          'image/bmp',
          'image/tiff',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'application/rtf',
          'application/vnd.oasis.opendocument.text',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/csv',
        ];

        const maxSize = 25 * 1024 * 1024;

        if (!allowedTypes.includes(type)) throw new Error('Invalid file type.');
        if (size > maxSize) throw new Error('File size exceeds 25MB.');

        let safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 255);
        const ext = path.extname(safeFilename).toLowerCase();

        const mimeExtensionMap = {
          'image/jpeg': '.jpg',
          'image/png': '.png',
          'image/gif': '.gif',
          'image/webp': '.webp',
          'image/svg+xml': '.svg',
          'image/bmp': '.bmp',
          'image/tiff': '.tiff',
          'application/pdf': '.pdf',
          'application/msword': '.doc',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
          'text/plain': '.txt',
          'application/rtf': '.rtf',
          'application/vnd.oasis.opendocument.text': '.odt',
          'application/vnd.ms-excel': '.xls',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
          'application/vnd.ms-powerpoint': '.ppt',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
          'application/csv': '.csv',
        };
        if (mimeExtensionMap[type] && mimeExtensionMap[type] !== ext) {
          safeFilename = safeFilename.replace(ext, mimeExtensionMap[type]);
        }

        let key = safeFilename;
        const filePath = path.join(UPLOADS_DIR, safeFilename);

        // For large files or images, use background job processing
        const isLargeFile = size > (5 * 1024 * 1024); // 5MB threshold
        const isImage = type.startsWith('image/');

        if (isLargeFile || isImage) {
          // Queue the upload as a background job
          await jobQueue.enqueue('image-upload', {
            filename: safeFilename,
            base64Data: base64,
            fileType: type,
            fileSize: size,
            userId,
            originalUrl: url
          }, { priority: isImage ? 5 : 0 });

          console.log(`📤 Queued ${isImage ? 'image' : 'file'} upload job for: ${safeFilename}`);

          // Return immediately - job will process in background
          await clearMediaCache();
          return { success: true, message: 'File upload queued for processing' };
        }

        // For small non-image files, process synchronously
        if (type.startsWith('image/')) {
          const sizeInfo = await Media.getImageDimensions(file);
          width = sizeInfo.width;
          height = sizeInfo.height;
        }

        // Check if file exists and generate a unique filename if necessary
        const hookFileUploadResult = await doAction(
          'upload_file',
          filePath,
          key,
          base64,
          width,
          height,
          type,
          size,
          url,
          safeFilename,
          c.env,
          connection,
          userId,
        );

        if (hookFileUploadResult !== undefined) {
          return hookFileUploadResult;
        } else {
          await ensureUploadsDir();
          try {
            await fs.access(filePath);
            const dotIndex = safeFilename.lastIndexOf('.');
            const base = dotIndex !== -1 ? safeFilename.slice(0, dotIndex) : safeFilename;
            const ext = dotIndex !== -1 ? safeFilename.slice(dotIndex) : '';
            const uuid = crypto.randomUUID();
            safeFilename = `${base}_${uuid}${ext}`;
            key = safeFilename;
          } catch {
            // File doesn't exist, proceed with original filename
          }

          const binary = Buffer.from(base64, 'base64');
          await fs.writeFile(path.join(UPLOADS_DIR, key), binary);
          const fileObj = {
            filename: key,
            type,
            data: base64,
            size,
          };

          await Media.uploadFile(key, fileObj, connection, userId, width, height, url);
        }
        await clearMediaCache();
        return { success: true };
      } catch (error) {
        await System.writeLogData(error.stack || String(error), 'backend');
        throw new Error(`Upload failed: ${error.message}`);
      }
    },

    replaceFile: async (_, { id, file }, { connection, isAuth, userId }) => {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }

      try {
        const existingFile = await connection`
          SELECT * FROM pw_posts WHERE id = ${id}
        `;
        if (!existingFile.length) {
          throw new Error('File not found');
        }

        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files can be replaced.');
        }

        const { data: base64, size, filename, type } = file;
        const maxSize = 25 * 1024 * 1024; // 25MB
        if (size > maxSize) {
          throw new Error('File size exceeds 25MB limit.');
        }

        const filePath = path.join(UPLOADS_DIR, filename);
        const binary = Buffer.from(base64, 'base64');
        const metadata = await sharp(binary).metadata();
        const width = metadata.width;
        const height = metadata.height;
        await fs.writeFile(filePath, binary);

        await connection`
          UPDATE pw_posts
          SET guid = ${filename}, post_mime_type = ${type}
          WHERE id = ${id}
        `;

        const justName = filename.split('.').slice(0, -1).join('.');
        await Meta.updatePostMetaEntry(connection, '_pw_attached_file', id, justName, true);

        const settingsJSON = await Media.getSettings(connection);
        const settings = JSON.parse(settingsJSON.option_value);

        const meta = {
          width: width,
          height: height,
          file: justName,
          sizes: [],
        };

        const tempFileForResize = {
          data: base64,
          type: type,
          filename: filename,
        };

        if (width != null) {
          const resizePromises = settings.map(async (setting) => {
            const { file: resized, fileName } = await Media.createThumbnail(
              tempFileForResize,
              setting.width,
              setting.height,
              justName,
              setting.slug,
            );

            const thumbPath = path.join(UPLOADS_DIR, fileName);
            const buffer = Buffer.from(await resized.arrayBuffer());

            const hookFileUploadDataResult = await doAction(
              'upload_file',
              thumbPath,
              fileName,
              buffer,
            );
            if (hookFileUploadDataResult === undefined) {
              await fs.writeFile(thumbPath, buffer);
            }

            return {
              slug: setting.slug,
              file: fileName,
              width: setting.width,
              height: setting.height,
              'mime-type': resized.type || 'image/webp',
            };
          });

          meta.sizes = await Promise.all(resizePromises);
        }

        await Meta.updatePostMetaEntry(
          connection,
          '_pw_attachment_metadata',
          id,
          JSON.stringify(meta),
          true,
        );
        await clearMediaCache();
        return { success: true };
      } catch (error) {
        await System.writeLogData(error.stack || String(error), 'backend');
        throw new Error(`Replace failed: ${error.message}`);
      }
    },

    replaceFileWithSetting: async (_, { id, file, setting }, { connection, isAuth, userId }) => {
      try {
        const existingFile = await connection`
          SELECT * FROM pw_posts WHERE id = ${id}
        `;
        if (!existingFile.length) {
          throw new Error('File not found');
        }

        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files can be replaced.');
        }

        const { data: base64, size, filename, type } = file;
        const maxSize = 25 * 1024 * 1024; // 25MB
        if (size > maxSize) {
          throw new Error('File size exceeds 25MB limit.');
        }

        const binary = Buffer.from(base64, 'base64');
        const metadata = await sharp(binary).metadata();
        const width = metadata.width;
        const height = metadata.height;

        const justName = filename.split('.').slice(0, -1).join('.');

        // Fetch settings
        const settingsJSON = await Media.getSettings(connection);
        const settings = JSON.parse(settingsJSON.option_value);

        // // Load existing metadata
        const metaJSON = await Meta.getPostMetaEntry(connection, '_pw_attachment_metadata', id);
        const meta = metaJSON
          ? JSON.parse(metaJSON.meta_value)
          : { width, height, file: justName, sizes: [] };

        if (setting === 'image') {
          // Replace main image
          const filePath = path.join(UPLOADS_DIR, filename);
          await fs.writeFile(filePath, binary);
          await connection`
            UPDATE pw_posts
            SET guid = ${filename}, post_mime_type = ${type}
            WHERE id = ${id}
          `;
          await Meta.updatePostMetaEntry(connection, '_pw_attached_file', id, justName, true);
          meta.width = width;
          meta.height = height;
          meta.file = justName;
        } else {
          const thumbSetting = settings.find((s) => s.slug === setting);
          if (!thumbSetting) {
            throw new Error('Invalid setting specified');
          }
          const { file: resizedFile, fileName } = await Media.createThumbnail(
            { data: base64, type, filename },
            thumbSetting.width,
            thumbSetting.height,
            justName,
            thumbSetting.slug,
          );
          const thumbPath = path.join(UPLOADS_DIR, fileName);
          const buffer = Buffer.from(await resizedFile.arrayBuffer());
          await fs.writeFile(thumbPath, buffer);
          const existingSizeIndex = meta.sizes.findIndex((s) => s.slug === setting);
          const newSizeEntry = {
            slug: setting,
            file: fileName,
            width: thumbSetting.width,
            height: thumbSetting.height,
            'mime-type': type,
          };
          if (existingSizeIndex >= 0) {
            meta.sizes[existingSizeIndex] = newSizeEntry;
          } else {
            meta.sizes.push(newSizeEntry);
          }
        }

        await Meta.updatePostMetaEntry(
          connection,
          '_pw_attachment_metadata',
          id,
          JSON.stringify(meta),
          true,
        );

        return { success: true };
      } catch (error) {
        await System.writeLogData(error.stack || String(error), 'backend');
        throw new Error(`Replace failed: ${error.message}`);
      }
    },

    deleteFile: async function (_, { filepath }, { c, isAuth, connection }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      if (!filepath) {
        throw new Error('No filepath provided.');
      }
      const postsRows = await connection`SELECT * FROM pw_posts WHERE guid=${filepath}`;
      if (postsRows.length > 0) {
        await connection`DELETE FROM pw_posts WHERE id=${postsRows[0].id}`;
        await connection`DELETE FROM pw_postmeta WHERE post_id=${postsRows[0].id}`;
      }
      const hookFileDeleteResult = await doAction('delete_file', filepath, c.env, connection);
      if (hookFileDeleteResult !== undefined) {
        return hookFileDeleteResult;
      }

      const absolutePath = path.join(process.cwd(), 'uploads', filepath);

      try {
        await fs.access(absolutePath);
        await fs.unlink(absolutePath);

        const settings = await Media.getSettings(connection);
        const settingsObjects = JSON.parse(settings.option_value);
        const originalFilepath = filepath;

        const dotIndex = originalFilepath.lastIndexOf('.');
        const baseName = dotIndex !== -1 ? originalFilepath.slice(0, dotIndex) : originalFilepath;

        for (const size of settingsObjects) {
          const newFilepath = `${baseName}-${size.slug}.webp`;
          const absolutePath = path.join(process.cwd(), 'uploads', newFilepath);
          try {
            await fs.access(absolutePath);
            await fs.unlink(absolutePath);
          } catch (err) {}
        }
        await clearMediaCache();
        return { success: true, msg: `Deleted file: ${filepath}` };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
        if (err.code === 'ENOENT') {
          return { success: true, msg: `File did not exist: ${filepath}` };
        }
        throw new Error(`Failed to delete file: ${err.message}`);
      }
    },

    deleteFiles: async function (_, { ids }, { c, connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      try {
        const hookFilesDeleteResult = await doAction('delete_files', ids, c.env, connection);
        if (hookFilesDeleteResult !== undefined) {
          return hookFilesDeleteResult;
        }

        let success = true;

        // Only fetch once
        const settings = await getSettings(connection);
        const settingsObjects = JSON.parse(settings.option_value);

        for (const filepath of ids) {
          // DB clean
          const postsRows = await connection`SELECT * FROM pw_posts WHERE guid=${filepath}`;
          if (postsRows.length > 0) {
            await connection`DELETE FROM pw_posts WHERE id=${postsRows[0].id}`;
            await connection`DELETE FROM pw_postmeta WHERE post_id=${postsRows[0].id}`;
          }

          // Base file
          const absolutePath = path.join(process.cwd(), 'uploads', filepath);
          try {
            await fs.access(absolutePath);
            await fs.unlink(absolutePath);
          } catch (err) {
            console.warn(`File did not exist: ${filepath}`);
          }

          // Variants
          const dotIndex = filepath.lastIndexOf('.');
          const baseName = dotIndex !== -1 ? filepath.slice(0, dotIndex) : filepath;

          for (const size of settingsObjects) {
            const newFilepath = `${baseName}-${size.slug}.webp`;
            const variantPath = path.join(process.cwd(), 'uploads', newFilepath);
            try {
              await fs.access(variantPath);
              await fs.unlink(variantPath);
            } catch (err) {
              console.warn(`Variant did not exist: ${newFilepath}`);
            }
          }
        }
        await clearMediaCache();
        return { success };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
      }
    },

    updateMediaSettings: async function (_, { data }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      try {
        await clearMediaCache();
        return await Media.updateSettings(connection, data);
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
      }
    },

    updateMediaItemData: async function (_, { fileId, data }, { connection, isAuth }) {
      if (!isAuth) {
        const error = new Error('Invalid Auth Token.');
        error.code = 401;
        throw error;
      }
      try {
        const fileData = JSON.parse(data);

        const result = await connection`
        INSERT INTO pw_postmeta (post_id, meta_key, meta_value)
        VALUES (${fileId}, '_pw_meta_data', ${JSON.stringify(fileData)})
        ON CONFLICT (post_id, meta_key)
        DO UPDATE SET meta_value = EXCLUDED.meta_value
      `;
        await clearMediaCache();
        return { success: result.count === 1 };
      } catch (err) {
        await System.writeLogData(err.stack || String(err), 'backend');
      }
    },
  },
};
