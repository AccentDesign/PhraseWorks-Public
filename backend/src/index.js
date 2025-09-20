import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import postgres from 'postgres';

// Server modules
import { setupGlobalMiddleware, setupCORS } from './server/middleware.js';
import { setupStaticRoutes } from './server/staticFiles.js';
import { setupGraphQL } from './server/graphql.js';
import { createWebSocketServer } from './server/websocket.js';
import { setupRoutes } from './server/routes.js';

// Utilities
import { loadCronJobs } from './utils/cron.js';
import { initJobsTable } from './utils/simpleJobs.js';

config();

const app = new Hono();

// Setup middleware
setupGlobalMiddleware(app);
setupCORS(app);

// Setup routes
setupStaticRoutes(app);

// Setup GraphQL
setupGraphQL(app);

// Setup other routes (needs database connection)
const sql = postgres(process.env.DATABASE_URL);
setupRoutes(app, sql);

// Start HTTP server
serve(
  {
    fetch: app.fetch,
    port: process.env.PORT || 80,
  },
  (info) => {
    console.log(`Server running at http://localhost:${info.port}`);
  },
);

// Start WebSocket server
createWebSocketServer();

// Initialize background services
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