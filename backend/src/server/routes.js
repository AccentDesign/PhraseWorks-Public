import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';
import errorHtml from '../page/404.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const setupRoutes = (app, sql) => {
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