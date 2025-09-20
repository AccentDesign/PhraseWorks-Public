import postgres from 'postgres';
import { config } from 'dotenv';
import { handleError } from '../utils/errorHandler.js';

config();

const sql = postgres(process.env.DATABASE_URL, {
  max: 10,
  idle_timeout: 10,
  connect_timeout: 10,
  fetch_types: false,
  debug: process.env.NODE_ENV === 'development',
});

sql.listen('error', async (error) => {
  await handleError(error, 'Database.PoolError', {
    additionalData: {
      connectionString: process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@') // Hide password
    }
  });
});

sql.listen('notice', (notice) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('📢 Postgres notice:', notice.message || notice);
  }
});

sql.listen('connect', () => {
  console.log('✅ Postgres connection established');
});

sql.listen('end', () => {
  console.log('📪 Postgres pool ended');
});

export default sql;
