import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { createHandler } from 'graphql-http/lib/use/fetch';
import { createSchema } from './graphql/schema.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import { dbMiddleware } from './middleware/dbMiddleware.js';
import { cacheMiddleware } from './middleware/cacheMiddleware.js';
import rateLimit from './middleware/rateLimit.js';
import { validationMiddleware } from './middleware/validationMiddleware.js';
import {
  securityMiddleware,
  timeoutMiddleware,
  requestSizeMiddleware,
} from './middleware/securityMiddleware.js';
import { runPluginInits } from './utils/initPlugins.js';
import { pluginMeta } from './generated/pluginResolvers.js';
import errorHtml from './page/404.js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { config } from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { actions, doAction } from './utils/actionBus.js';
import { loadCronJobs } from './utils/cron.js';
import { initJobsTable } from './utils/simpleJobs.js';
import { jobQueue } from './utils/jobQueue.js';
import { WebSocketServer } from 'ws';
import { compress } from 'hono/compress';
import { warmupCache } from './utils/cache.js';
import {
  createCommentLoader,
  createFeaturedImageLoader,
  createPostCategoriesLoader,
  createPostLoader,
  createPostMetaLoader,
  createPostsByAuthorsLoader,
  createTermLoader,
  createUserLoader,
} from './utils/loaders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config();

const wss = new WebSocketServer({ port: 8081 });

const app = new Hono();

app.use('*', compress());
app.use('*', securityMiddleware);
app.use('*', timeoutMiddleware(30000));
app.use('*', requestSizeMiddleware(10 * 1024 * 1024));

export const connectedClients = new Map();

const serveStaticFile = async (c, prefix) => {
  const requestedPath = c.req.path;
  const filePath = join(
    __dirname,
    '..',
    'dist',
    requestedPath.replace(`/${prefix}/`, `${prefix}/`),
  );

  if (!existsSync(filePath)) return null;

  const content = readFileSync(filePath);
  const isAsset = requestedPath.startsWith('/assets/');

  const mimeType = requestedPath.endsWith('.js')
    ? 'application/javascript'
    : requestedPath.endsWith('.css')
      ? 'text/css'
      : requestedPath.endsWith('.svg')
        ? 'image/svg+xml'
        : requestedPath.endsWith('.html')
          ? 'text/html'
          : 'application/octet-stream';

  const headers = { 'Content-Type': mimeType };

  if (isAsset) {
    // Long cache for hashed assets
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  } else {
    // Don’t cache HTML or dynamic files
    headers['Cache-Control'] = 'no-cache';
  }

  return c.body(content, 200, headers);
};

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

app.get('/tinymce/*', async (c) => {
  const result = await serveStaticFile(c, 'tinymce');
  if (result) return result;
  return c.next();
});

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

app.use(
  '/api/*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
  }),
);

app.use(
  '/graphql',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-client-id'],
    exposeHeaders: [],
    maxAge: 600,
    credentials: false,
  }),
);

app.use(
  '/graphql',
  authMiddleware,
  dbMiddleware,
  validationMiddleware,
  cacheMiddleware({ ttl: 300 }),
  rateLimit({ windowMs: 60000, max: 400 }),
);

const customFormatErrorFn = (err) => {
  if (!err.originalError) {
    return err;
  }
  const data = err.originalError.data || null;
  const message = err.message || 'An error occurred.';
  const code = err.originalError.code || 500;
  return { message, status: code, data };
};

app.use('/graphql', authMiddleware, async (c, next) => {
  if (c.req.method === 'POST' && c.req.header('content-type')?.includes('multipart/form-data')) {
    const form = await c.req.formData();
    const operations = JSON.parse(form.get('operations') || '{}');
    const map = JSON.parse(form.get('map') || '{}');

    for (const [fileKey, paths] of Object.entries(map)) {
      const file = form.get(fileKey);
      if (file instanceof File) {
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
        ];
        const maxSize = 250 * 1024 * 1024;
        if (!allowedTypes.includes(file.type)) {
          return c.json(
            {
              errors: [{ message: 'Invalid file type. Only PDF, JPEG, and PNG are allowed.' }],
            },
            400,
          );
        }
        if (file.size > maxSize) {
          return c.json({ errors: [{ message: 'File size exceeds 5MB limit.' }] }, 400);
        }
        let target = operations;
        const path = paths[0].split('.');
        for (let i = 0; i < path.length - 1; i++) {
          target = target[path[i]] || (target[path[i]] = {});
        }
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        target[path[path.length - 1]] = {
          filename: file.name,
          type: file.type,
          size: file.size,
          data: base64,
        };
      }
    }

    c.set('graphqlOperations', operations);
  }

  await next();
});

app.post('/graphql', authMiddleware, dbMiddleware, async (c) => {
  const isAuthMid = c.get('isAuth');
  const userIdMid = c.get('userId');
  const sql = c.get('connection');

  let body = c.get('graphqlOperations') || c.get('graphqlBody');
  if (!body) {
    try {
      body = JSON.parse(await c.req.text());
      c.set('graphqlBody', body);
    } catch {
      return c.json({ error: 'Invalid JSON body' }, 400);
    }
  }

  await runPluginInits(sql);

  const headers = new Headers(c.req.header());
  headers.set('Content-Type', 'application/json');

  const fetchRequest = new Request(c.req.url, {
    method: c.req.method,
    headers,
    body: JSON.stringify(body),
  });

  const schema = await createSchema(sql);

  c.env = process.env;

  const graphqlHandler = createHandler({
    schema,
    context: async () => ({
      c,
      connection: sql,
      secret: process.env.SECRET_KEY,
      isAuth: isAuthMid || false,
      userId: userIdMid || null,
      loaders: {
        categories: createPostCategoriesLoader(sql),
        comment: createCommentLoader(sql),
        post: createPostLoader(sql),
        featuredImage: createFeaturedImageLoader(sql),
        postsByAuthor: createPostsByAuthorsLoader(sql),
        postMeta: createPostMetaLoader(sql),
        term: createTermLoader(sql),
        user: createUserLoader(sql),
      },
    }),
    formatError: customFormatErrorFn,
  });

  try {
    const response = await graphqlHandler(fetchRequest);
    const resBody = await response.json();
    c.set('graphqlResponse', resBody); // for cacheMiddleware

    return c.json(resBody, response.status);
  } catch (e) {
    console.error('GraphQL handler error:', e);
    return c.json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});

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
    const file = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      }),
    );
    if (!file.Body) throw new Error('File not found');

    const headers = new Headers();
    headers.append('etag', file.ETag || '');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    headers.set('Content-Type', file.ContentType || 'image/svg+xml');

    return new Response(file.Body, {
      headers,
    });
  } catch (err) {
    console.error('Error fetching file:', err);
    return c.json({ error: 'File not found' }, 404);
  }
});

app.post('/api/action/:hook', dbMiddleware, async (c) => {
  const hook = c.req.param('hook');
  const body = await c.req.json();
  const args = body.args || [];

  const sql = c.get('connection');
  const [pluginsMetaDB] = await sql`SELECT * FROM pw_options WHERE option_name = 'plugins'`;
  const pluginsMeta = JSON.parse(pluginsMetaDB.option_value);

  const hookFns = actions[hook];

  if (!hookFns || hookFns.length === 0) {
    return c.json({ success: false, error: 'Hook not found' }, 404);
  }

  const activePublicFns = hookFns.filter((fn) => {
    const plugin = pluginsMeta.find((p) => p.slug === fn.parent);
    return fn.public && plugin?.active;
  });

  if (activePublicFns.length === 0) {
    return c.json({ success: false, error: 'Unauthorized hook' }, 403);
  }
  const env = process.env;
  try {
    let result = [];
    for (const fn of activePublicFns) {
      // const maybe = await fn.callback(...args);
      const maybe = await fn.callback(...args, { sql, env });
      if (maybe !== undefined) result.push(maybe);
    }

    return c.json({ success: true, result });
  } catch (e) {
    console.error('Error executing hook:', e);
    return c.json({ success: false, error: 'Internal error' }, 500);
  }
});

app.get('/uploads/*', dbMiddleware, async (c) => {
  const sql = c.get('connection');
  const key = c.req.path.substring('/uploads/'.length);

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  const hookUploadsFileResult = await doAction('get_file', key, process.env, c, sql);

  if (hookUploadsFileResult !== undefined) {
    return hookUploadsFileResult;
  } else {
    const filePath = path.join(process.cwd(), 'uploads', key);
    if (!existsSync(filePath)) {
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    try {
      const stats = await fs.stat(filePath);
      if (!stats.isFile()) throw new Error('Not a file');

      const fileContent = await fs.readFile(filePath);

      const headers = new Headers();
      headers.append('etag', stats.mtime.toISOString());
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Access-Control-Allow-Methods', 'GET, OPTIONS');
      headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      headers.set('Content-Type', getContentType(key) || 'application/octet-stream');

      return new Response(fileContent, {
        headers,
      });
    } catch (err) {
      console.error('Error fetching file:', err);
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }
});

function getContentType(fileName) {
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
  return mimeTypes[ext];
}

app.get('/*', dbMiddleware, async (c) => {
  const sql = c.get('connection');
  const path = c.req.path;

  const isFile = path.match(/\.[a-zA-Z0-9]+$/);

  if (isFile) {
    return c.notFound();
  }

  const baseStaticRoutes = [
    '/',
    '/login',
    '/admin',
    '/admin/media',
    '/admin/media/settings',
    '/admin/settings/seo/',
    '/admin/posts',
    '/admin/posts/new',
    '/admin/posts/edit/:id',
    '/admin/posts/categories',
    '/admin/posts/tags',
    '/admin/pages',
    '/admin/pages/new',
    '/admin/pages/edit/:id',
    '/admin/pages/page_templates',
    '/admin/users',
    '/admin/users/new',
    '/admin/users/edit/:id',
    '/admin/plugins',
    '/admin/appearance',
    '/admin/appearance/menus',
    '/admin/settings',
    '/admin/settings/writing',
    '/admin/settings/reading',
    '/admin/settings/email',
    '/admin/settings/seo',
    '/admin/settings/custom_fields',
    '/admin/settings/custom_fields/groups/new',
    '/admin/settings/custom_fields/group/:id',
    '/admin/docs',
    '/admin/help',
  ];

  const pluginRoutes = pluginMeta.flatMap((plugin) => plugin.pageUrls || []);

  const staticRoutes = [...baseStaticRoutes, ...pluginRoutes];

  function matchRoute(path, pattern) {
    const pathSegments = path.split('/').filter(Boolean);
    const patternSegments = pattern.split('/').filter(Boolean);

    if (pathSegments.length !== patternSegments.length) return false;

    for (let i = 0; i < patternSegments.length; i++) {
      if (patternSegments[i].startsWith(':')) continue;
      if (pathSegments[i] !== patternSegments[i]) return false;
    }
    return true;
  }

  function isStaticRoute(path) {
    return staticRoutes.some((pattern) => matchRoute(path, pattern));
  }

  const indexPath = join(__dirname, '..', 'dist', 'index.html');

  if (isStaticRoute(path)) {
    if (existsSync(indexPath)) {
      return c.html(readFileSync(indexPath, 'utf-8'));
    }
    return c.text('index.html not found', 404);
  }

  const exists = await checkPathInDatabase(path, sql);
  if (exists) {
    if (existsSync(indexPath)) {
      return c.html(readFileSync(indexPath, 'utf-8'));
    }
    return c.text('index.html not found', 404);
  }

  console.log(`Not found: ${path}`);
  return c.html(errorHtml, 404);
});

serve(
  {
    fetch: app.fetch,
    port: process.env.PORT || 80,
  },
  (info) => {
    console.log(`Server running at http://localhost:${info.port}`);
  },
);

(async () => {
  try {
    await initJobsTable();
    console.log('Job system initialized');
  } catch (e) {
    console.error('Failed to initialize job system:', e);
  }

  try {
    await loadCronJobs();
  } catch (e) {
    console.error('Failed to load cron jobs:', e);
  }

  // Warmup cache with frequently accessed data
  try {
    const { default: postgres } = await import('postgres');
    const sql = postgres(process.env.DATABASE_URL);
    // await warmupCache(sql);
    await sql.end();
  } catch (e) {
    console.warn('Cache warmup failed:', e.message);
  }
})();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const clientId = url.searchParams.get('clientId');

  if (clientId) {
    connectedClients.set(clientId, ws);
  }
  ws.on('close', () => {
    if (clientId) connectedClients.delete(clientId);
  });
});
