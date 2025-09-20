import sql from './db.js';

export const dbMiddleware = async (c, next) => {
  c.set('connection', sql);
  try {
    await next();
  } catch (err) {
    console.error('Error in dbMiddleware next:', err);
    throw err;
  }
};
