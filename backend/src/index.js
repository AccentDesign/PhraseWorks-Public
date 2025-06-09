import { Hono } from 'hono';
import postgres from 'postgres';
import { cors } from 'hono/cors';

import { createHandler } from 'graphql-http/lib/use/fetch';
import graphqlSchema from './graphql/schema';
import graphqlResolver from './graphql/resolvers';
import { authMiddleware } from './middleware/authMiddleware';
import Media from './models/media';
import { dbMiddleware } from './middleware/dbMiddleware';

export default {
  async fetch(request, env, ctx) {
    const app = new Hono();
    app.use(
      '/api/*',
      cors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
      }),
    );

    app.get('/r2/*', async (c) => {
      const key = c.req.path.substring('/r2/'.length);
      const file = await c.env.phrase_works.get(key);
      if (!file) throw new APIError('file not found', { status: 404 });
      const headers = new Headers();
      headers.append('etag', file.httpEtag);
      return new Response(file.body, {
        headers,
      });
    });

    app.use(
      '/graphql',
      cors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
        exposeHeaders: [],
        maxAge: 600,
        credentials: false,
      }),
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

    app.get('/api/v1/files/list', async (c) => {
      try {
        const list = await c.env.phrase_works.list({
          delimiter: '/',
          include: ['httpMetadata'],
        });

        const files = list.objects.map((obj) => ({
          key: obj.key,
          size: obj.size,
          contentType: obj.httpMetadata?.contentType || 'unknown',
          lastModified: obj.uploaded,
        }));

        const folders = list.delimitedPrefixes || [];

        return c.json({
          files,
          folders,
        });
      } catch (err) {
        console.error('Error listing bucket:', err);
        return c.json({ error: 'Failed to list bucket contents' }, 500);
      }
    });

    app.get('/api/v1/files/:key', async (c) => {
      const key = c.req.param('key');
      const object = await c.env.phrase_works.get(key);

      if (!object || !object.body) {
        return c.text('File not found', 404);
      }

      return new Response(object.body, {
        headers: {
          'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    });

    app.put('/api/v1/files/upload', authMiddleware, async (c) => {
      const isAuthMid = c.get('isAuth');
      const userIdMid = c.get('userId');

      if (!isAuthMid) {
        return c.json({ error: 'Invalid Auth Token.' }, 401);
      }

      const sql = postgres(env.HYPERDRIVE.connectionString, {
        max: 5,
        fetch_types: false,
      });

      const formData = await c.req.formData();
      const files = formData.getAll('files'); // handle multiple files

      if (!files || files.length === 0) {
        return c.json({ error: 'No files uploaded' }, 400);
      }

      const results = [];

      for (const file of files) {
        if (!(file instanceof File)) continue;
        const size = await Media.getImageDimensions(file);
        const key = file.name;

        await env.phrase_works.put(key, file.stream());
        await Media.uploadFile(key, file, sql, userIdMid, size.width, size.height, env);

        results.push({ key, size: file.size });
      }

      return c.json(results);
    });

    app.post('/graphql', authMiddleware, dbMiddleware, async (c) => {
      const body = await c.req.text();
      const isAuthMid = c.get('isAuth');
      const userIdMid = c.get('userId');
      const sql = c.get('connection');

      const fetchRequest = new Request(c.req.url, {
        method: c.req.method,
        headers: c.req.header(),
        body,
      });

      const graphqlHandler = createHandler({
        schema: graphqlSchema,
        rootValue: graphqlResolver,
        context: async () => {
          try {
            const ctx = c;
            const connection = sql;
            const secret = env.SECRET_KEY;
            const isAuth = isAuthMid || false;
            const userId = userIdMid || null;

            return { c, connection, secret, isAuth, userId, env };
          } catch (e) {
            console.error('Failed to create connection:', e);
            throw new Error('Database connection failed');
          }
        },
        formatError: customFormatErrorFn,
      });

      try {
        const response = await graphqlHandler(fetchRequest);
        ctx.waitUntil(sql.end());
        return new Response(response.body, {
          status: response.status,
          headers: response.headers,
        });
      } catch (e) {
        console.error('GraphQL handler error:', e);
        return new Response(
          JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }
    });

    app.get('/*', async (c) => {
      const path = c.req.path;
      const asset = await c.env.ASSETS.fetch(new Request(`http://localhost${path}`)).catch(
        () => null,
      );

      if (!asset || asset.status === 404) {
        return c.env.ASSETS.fetch(new Request('http://localhost/index.html'));
      }

      return asset;
    });

    app.notFound((c) => {
      return c.json({ error: 'Not Found' }, 404);
    });

    app.onError((err, c) => {
      console.error('Error:', err);
      return c.json({ error: 'Internal Server Error' }, 500);
    });

    return app.fetch(request, env, ctx);
  },
};
