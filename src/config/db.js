import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// If DATABASE_URL is provided, use it (common for hosted Postgres / deployment platforms).

// Otherwise fall back to individual PG* environment variables.
export const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : undefined,
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || '0000',
        database: process.env.PGDATABASE || 'student_dashboard',
      }
);

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected error on idle PostgreSQL client', err);
});

export const query = (text, params) => pool.query(text, params);