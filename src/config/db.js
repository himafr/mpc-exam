import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT) || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '0000',
    database: process.env.PGDATABASE || 'student_dashboard',
    ssl: {
      rejectUnauthorized: false,
    },
  };
export const pool = new Pool(config);

    // : {
    //     host: process.env.PGHOST || 'localhost',
    //     port: Number(process.env.PGPORT) || 5432,
    //     user: process.env.PGUSER || 'postgres',
    //     password: process.env.PGPASSWORD || '0000',
    //     database: process.env.PGDATABASE || 'student_dashboard',
    //   }

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected error on idle PostgreSQL client', err);
});

export const query = (text, params) => pool.query(text, params);