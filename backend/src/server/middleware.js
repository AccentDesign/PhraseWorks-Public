import { cors } from 'hono/cors';
import { compress } from 'hono/compress';
import {
  securityMiddleware,
  timeoutMiddleware,
  requestSizeMiddleware,
} from '../middleware/securityMiddleware.js';

export const setupGlobalMiddleware = (app) => {
  app.use('*', compress());
  app.use('*', securityMiddleware);
  app.use('*', timeoutMiddleware(30000));
  app.use('*', requestSizeMiddleware(10 * 1024 * 1024));
};

export const setupCORS = (app) => {
  app.use(
    '/api/*',
    cors({
      origin: '*',
      allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
      allowHeaders: ['Content-Type', 'Authorization', 'x-client-id'],
    }),
  );
};