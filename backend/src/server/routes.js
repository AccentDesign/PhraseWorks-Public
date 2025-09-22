import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';
import errorHtml from '../page/404.js';
import Media from '../models/media.js';
import { doAction } from '../utils/actionBus.js';
import { clearMediaCache } from '../utils/cache.js';
import { jobQueue } from '../utils/jobQueue.js';
import path from 'path';
import fs from 'fs/promises';
import System from '../models/system.js';
import crypto from 'crypto';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const setupRoutes = (app, sql) => {
  // File upload REST API endpoint
  app.put('/api/v1/files/upload', async (c) => {
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

    try {
      // Check authentication
      const authHeader = c.req.header('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Authentication required' }, 401);
      }

      const formData = await c.req.formData();
      const files = formData.getAll('files');

      if (!files || files.length === 0) {
        return c.json({ error: 'No files provided' }, 400);
      }

      const uploadedFiles = [];

      // Process each file with the same logic as GraphQL uploadFile
      for (const file of files) {
        if (file && file.name) {
          // Convert file to base64 - same format as GraphQL expects
          const arrayBuffer = await file.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');

          if (!isBase64(base64)) {
            throw new Error('Invalid base64 file data.');
          }

          const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            'image/bmp', 'image/tiff', 'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain', 'application/rtf', 'application/vnd.oasis.opendocument.text',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/csv'
          ];

          const maxSize = 25 * 1024 * 1024;

          if (!allowedTypes.includes(file.type)) {
            throw new Error('Invalid file type.');
          }
          if (file.size > maxSize) {
            throw new Error('File size exceeds 25MB.');
          }

          let safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 255);
          const ext = path.extname(safeFilename).toLowerCase();

          const mimeExtensionMap = {
            'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif',
            'image/webp': '.webp', 'image/svg+xml': '.svg', 'image/bmp': '.bmp',
            'image/tiff': '.tiff', 'application/pdf': '.pdf'
          };

          if (mimeExtensionMap[file.type] && mimeExtensionMap[file.type] !== ext) {
            safeFilename = safeFilename.replace(ext, mimeExtensionMap[file.type]);
          }

          let key = safeFilename;
          const filePath = path.join(UPLOADS_DIR, safeFilename);

          // Create file object for database
          const fileObj = {
            filename: key,
            type: file.type,
            data: base64,
            size: file.size,
          };

          let width = 0;
          let height = 0;

          // Process all images synchronously (skip job queue for now since DB may not be available)
          if (file.type.startsWith('image/')) {
            try {
              // Get dimensions directly with Sharp to avoid any EXIF issues in Media.getImageDimensions
              const metadata = await sharp(Buffer.from(base64, 'base64')).metadata();
              width = metadata.width || 0;
              height = metadata.height || 0;
            } catch (dimError) {
              console.warn('Failed to get image dimensions:', dimError.message);
              width = 0;
              height = 0;
            }
          }

          // Check if file exists and generate a unique filename if necessary
          const hookFileUploadResult = await doAction(
            'upload_file',
            filePath,
            key,
            base64,
            width,
            height,
            file.type,
            file.size,
            c.get('url'),
            safeFilename,
            c.env,
            sql,
            c.get('userId'),
          );

          if (hookFileUploadResult !== undefined) {
            // Plugin handled the upload
            uploadedFiles.push({
              name: file.name,
              filename: key,
              size: file.size,
              type: file.type,
              width,
              height,
              status: 'uploaded via plugin'
            });
          } else {
            // Plugin didn't handle it, so we handle it ourselves
            await ensureUploadsDir();

            // Check if file exists BEFORE writing and generate UUID if needed
            const originalFilePath = path.join(UPLOADS_DIR, safeFilename);
            try {
              await fs.access(originalFilePath);
              // File exists, generate UUID filename
              const dotIndex = safeFilename.lastIndexOf('.');
              const base = dotIndex !== -1 ? safeFilename.slice(0, dotIndex) : safeFilename;
              const ext = dotIndex !== -1 ? safeFilename.slice(dotIndex) : '';
              const uuid = crypto.randomUUID();
              safeFilename = `${base}_${uuid}${ext}`;
              key = safeFilename;
            } catch {
              // File doesn't exist, proceed with original filename
            }

            // Write the file with the final determined filename
            const binary = Buffer.from(base64, 'base64');
            await fs.writeFile(path.join(UPLOADS_DIR, key), binary);
            const fileObj = {
              filename: key,
              type: file.type,
              data: base64,
              size: file.size,
            };

            // Skip Media.uploadFile due to Node.js File constructor issue
            // Instead, handle database insertion directly like GraphQL resolver does
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

            // Insert into database
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
                  ${c.get('userId') || 1},
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
                  ${key},
                  ${file.type}
              )
              RETURNING id;
            `;
            const postId = insert[0]?.id;

            if (postId) {
              // Use the actual filename that was saved (including UUID if generated)
              const actualFilename = key.split('.').slice(0, -1).join('.');
              await sql`
                INSERT INTO pw_postmeta (post_id, meta_key, meta_value)
                VALUES (${postId}, '_pw_attached_file', ${actualFilename})
                ON CONFLICT (post_id, meta_key)
                DO UPDATE SET meta_value = EXCLUDED.meta_value
              `;

              const meta = {
                width: width,
                height: height,
                file: actualFilename,
                sizes: [],
              };

              // Generate thumbnails if it's an image and we have dimensions
              if (file.type.startsWith('image/') && width > 0 && height > 0) {
                try {
                  let settings = [];

                  // Try to get media settings from database
                  try {
                    const settingsResult = await sql`
                      SELECT option_value FROM pw_options WHERE option_name = 'pw_media_settings' LIMIT 1
                    `;
                    if (settingsResult.length > 0) {
                      settings = JSON.parse(settingsResult[0].option_value);
                    }
                  } catch (dbError) {
                    console.warn('Database not available, using default thumbnail sizes');
                  }

                  // Use default sizes if database not available
                  if (settings.length === 0) {
                    settings = [
                      { slug: 'thumbnail', width: 150, height: 150 },
                      { slug: 'medium', width: 300, height: 300 },
                      { slug: 'large', width: 600, height: 600 },
                      { slug: 'banner', width: 1200, height: 800 }
                    ];
                  }

                  // Use Sharp with explicit orientation control
                  const originalBuffer = Buffer.from(base64, 'base64');

                  // Create thumbnails for each size setting
                  for (const setting of settings) {
                    try {
                      const thumbnailFilename = `${actualFilename}-${setting.slug}.webp`;
                      const thumbnailPath = path.join(UPLOADS_DIR, thumbnailFilename);

                      // Use Sharp with explicit orientation override
                      const resizedBuffer = await sharp(originalBuffer)
                        .rotate() // Apply EXIF rotation first
                        .resize(parseInt(setting.width), parseInt(setting.height), {
                          fit: 'cover',
                          position: 'center'
                        })
                        .webp({ quality: 90 })
                        .toBuffer();

                      await fs.writeFile(thumbnailPath, resizedBuffer);

                      // Add to metadata
                      meta.sizes.push({
                        slug: setting.slug,
                        file: thumbnailFilename,
                        width: parseInt(setting.width),
                        height: parseInt(setting.height),
                        'mime-type': 'image/webp',
                      });
                    } catch (thumbError) {
                      console.warn(`Failed to create thumbnail ${setting.slug}:`, thumbError.message);
                    }
                  }
                } catch (settingsError) {
                  console.warn('Failed to process thumbnails:', settingsError.message);
                }
              }

              // Update metadata with thumbnail info
              try {
                await sql`
                  INSERT INTO pw_postmeta (post_id, meta_key, meta_value)
                  VALUES (${postId}, '_pw_attachment_metadata', ${JSON.stringify(meta)})
                  ON CONFLICT (post_id, meta_key)
                  DO UPDATE SET meta_value = EXCLUDED.meta_value
                `;
              } catch (dbError) {
                console.warn('Failed to update metadata in database:', dbError.message);
              }
            }

            uploadedFiles.push({
              name: file.name,
              filename: key,
              size: file.size,
              type: file.type,
              width,
              height,
              status: 'uploaded'
            });
          }
        }
      }

      await clearMediaCache();

      // Also clear any GraphQL query cache that might contain getMediaFiles
      try {
        const { clearAllCache } = await import('../utils/cache.js');
        await clearAllCache('*getMediaFiles*');
        console.log('🗑️ Cleared GraphQL getMediaFiles cache');
      } catch (err) {
        console.warn('Failed to clear GraphQL cache:', err.message);
      }

      return c.json({
        status: 'success',
        message: 'Files uploaded successfully',
        files: uploadedFiles
      }, 200);
    } catch (error) {
      await System.writeLogData(error.stack || String(error), 'backend');
      console.error('File upload error:', error);
      return c.json({ error: `Upload failed: ${error.message}` }, 500);
    }
  });

  // R2/S3 file serving
  app.get('/r2/*', async (c) => {
    const key = c.req.path.substring('/r2/'.length);
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    try {
      const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      });

      const response = await s3Client.send(command);

      if (!response.Body) {
        return c.notFound();
      }

      const stream = response.Body;
      const chunks = [];

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);

      return c.body(buffer, {
        headers: {
          'Content-Type': response.ContentType || 'application/octet-stream',
          'Content-Length': response.ContentLength?.toString() || buffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    } catch (error) {
      console.error('R2 file error:', error);
      return c.notFound();
    }
  });

  // Catch-all route for frontend
  app.get('*', async (c) => {
    const path = c.req.path;

    // Check if path exists in database
    const pathExists = await checkPathInDatabase(path, sql);
    if (!pathExists) {
      console.log(`Not found: ${path}`);
      return c.html(errorHtml, 404);
    }

    // Serve index.html for valid paths
    const indexPath = join(__dirname, '..', '..', 'dist', 'index.html');
    if (existsSync(indexPath)) {
      const content = readFileSync(indexPath, 'utf-8');
      return c.html(content);
    }

    console.log(`Not found: ${path}`);
    return c.html(errorHtml, 404);
  });
};

async function checkPathInDatabase(path, sql) {
  const trimmedPath = path.replace(/\/$/, '');
  if (trimmedPath === '') return true;

  const slug = trimmedPath.startsWith('/') ? trimmedPath.slice(1) : trimmedPath;

  // Allow frontend application routes
  const frontendRoutes = ['login', 'sign-up'];
  if (frontendRoutes.includes(slug)) {
    return true;
  }

  // Allow all admin routes
  if (slug.startsWith('admin')) {
    return true;
  }

  try {
    const post = await sql`
      SELECT ID FROM pw_posts WHERE post_name = ${slug} AND post_status = 'publish' LIMIT 1
    `;
    if (post.length > 0) {
      return true;
    }

    if (slug.startsWith('author/')) {
      const id = slug.split('/')[1];
      const author = await sql`
        SELECT ID FROM pw_users WHERE ID = ${id} LIMIT 1
      `;
      if (author.length > 0) return true;
    }

    if (slug.startsWith('category/')) {
      const categoryName = slug.split('/')[1];
      const category = await sql`
        SELECT term_id FROM pw_terms WHERE slug = ${categoryName} LIMIT 1
      `;
      if (category.length > 0) return true;
    }

    return false;
  } finally {
  }
}