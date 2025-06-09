import postgres from 'postgres';

export const dbMiddleware = async (c, next) => {
  const env = c.env;

  try {
    const sql = postgres(env.HYPERDRIVE.connectionString, {
      max: 5,
      fetch_types: false,
    });

    // Set DB client into context
    c.set('connection', sql);
  } catch (err) {
    console.error('Database connection failed:', err);
    c.set('connection', null);
  }

  await next();
};
