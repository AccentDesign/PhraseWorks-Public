import { cors } from 'hono/cors';
import { createHandler } from 'graphql-http/lib/use/fetch';
import { createSchema } from '../graphql/schema.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { dbMiddleware } from '../middleware/dbMiddleware.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';
import rateLimit from '../middleware/rateLimit.js';
import { validationMiddleware } from '../middleware/validationMiddleware.js';
import { runPluginInits } from '../utils/initPlugins.js';
import {
  createCommentLoader,
  createFeaturedImageLoader,
  createPostCategoriesLoader,
  createPostLoader,
  createPostMetaLoader,
  createPostsByAuthorsLoader,
  createTermLoader,
  createUserLoader,
} from '../utils/loaders.js';

const customFormatErrorFn = (err) => {
  if (!err.originalError) {
    return err;
  }
  const data = err.extensions?.data || {};
  const message = err.message || 'An error occurred.';
  const code = err.originalError.code || 500;
  return { message, status: code, data };
};

export const setupGraphQL = (app) => {
  // GraphQL CORS
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

  // GraphQL middleware
  app.use(
    '/graphql',
    authMiddleware,
    dbMiddleware,
    validationMiddleware,
    cacheMiddleware({ ttl: 300 }),
    rateLimit({ windowMs: 60000, max: 400 }),
  );

  // File upload handling for GraphQL
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
            'application/csv',
          ];

          if (!allowedTypes.includes(file.type)) {
            return c.json({ error: `File type ${file.type} not allowed` }, 400);
          }

          const maxSize = 25 * 1024 * 1024; // 25MB
          if (file.size > maxSize) {
            return c.json({ error: 'File size exceeds 25MB limit' }, 400);
          }

          const arrayBuffer = await file.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');

          for (const path of paths) {
            let target = operations;
            for (let i = 0; i < path.length - 1; i++) {
              target = target[path[i]] || (target[path[i]] = {});
            }
            target[path[path.length - 1]] = {
              filename: file.name,
              type: file.type,
              size: file.size,
              data: base64,
            };
          }
        }
      }

      c.set('graphqlOperations', operations);
    }

    await next();
  });

  // Main GraphQL endpoint
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

    try {
      const loaders = {
        post: createPostLoader(sql),
        user: createUserLoader(sql),
        comment: createCommentLoader(sql),
        categories: createPostCategoriesLoader(sql),
        postMeta: createPostMetaLoader(sql),
        featuredImage: createFeaturedImageLoader(sql),
        term: createTermLoader(sql),
        postsByAuthors: createPostsByAuthorsLoader(sql),
      };

      const handler = createHandler({
        schema,
        formatError: customFormatErrorFn,
        context: {
          isAuth: isAuthMid,
          userId: userIdMid,
          connection: sql,
          loaders,
          url: c.req.url,
          c,
          secret: process.env.SECRET_KEY,
        },
      });

      const response = await handler(fetchRequest);
      const resBody = await response.json();
      c.set('graphqlResponse', resBody); // for cacheMiddleware

      return c.json(resBody, response.status);
    } catch (e) {
      console.error('GraphQL handler error:', e);
      return c.json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
    }
  });
};