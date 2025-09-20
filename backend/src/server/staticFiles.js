import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const serveStaticFile = async (c, prefix) => {
  const requestedPath = c.req.path;
  const filePath = join(
    __dirname,
    '..',
    '..',
    prefix === 'uploads' ? 'uploads' : 'dist',
    prefix === 'uploads' ? requestedPath.replace('/uploads/', '') : requestedPath.replace(`/${prefix}/`, `${prefix}/`),
  );

  if (!existsSync(filePath)) return null;

  const content = readFileSync(filePath);
  const isAsset = requestedPath.startsWith('/assets/');
  const isUpload = requestedPath.startsWith('/uploads/');

  const mimeType = requestedPath.endsWith('.js')
    ? 'application/javascript'
    : requestedPath.endsWith('.css')
      ? 'text/css'
      : requestedPath.endsWith('.svg')
        ? 'image/svg+xml'
        : requestedPath.endsWith('.html')
          ? 'text/html'
          : requestedPath.endsWith('.webp')
            ? 'image/webp'
            : requestedPath.endsWith('.jpg') || requestedPath.endsWith('.jpeg')
              ? 'image/jpeg'
              : requestedPath.endsWith('.png')
                ? 'image/png'
                : requestedPath.endsWith('.gif')
                  ? 'image/gif'
                  : 'application/octet-stream';

  const headers = {
    'Content-Type': mimeType,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-id'
  };

  if (isAsset || isUpload) {
    // Long cache for hashed assets and uploads
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  } else {
    // Don't cache HTML or dynamic files
    headers['Cache-Control'] = 'no-cache';
  }

  return c.body(content, 200, headers);
};

export const setupStaticRoutes = (app) => {
  // Handle OPTIONS requests for CORS
  app.options('*', (c) => {
    return c.text('', 200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-id'
    });
  });

  app.get('/assets/*', async (c) => {
    const result = await serveStaticFile(c, 'assets');
    if (result) return result;
    return c.next();
  });

  app.get('/images/*', async (c) => {
    const result = await serveStaticFile(c, 'images');
    if (result) return result;
    return c.next();
  });

  app.get('/docs/*', async (c) => {
    const result = await serveStaticFile(c, 'docs');
    if (result) return result;
    return c.next();
  });

  app.get('/plugins.json', async (c) => {
    const result = await serveStaticFile(c, 'plugins.json');
    if (result) return result;
    return c.next();
  });

  app.get('/plugins/*', async (c) => {
    const result = await serveStaticFile(c, 'plugins');
    if (result) return result;
    return c.next();
  });

  app.get('/uploads/*', async (c) => {
    const result = await serveStaticFile(c, 'uploads');
    if (result) return result;
    return c.next();
  });

  app.get('/tinymce/*', async (c) => {
    const result = await serveStaticFile(c, 'tinymce');
    if (result) return result;
    return c.next();
  });
};