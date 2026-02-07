// connecter la db
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  console.error('Unexpected PG error', err);
  process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);
export default pool;
export async function connectDB() {
  try {
    const res = await pool.query('SELECT current_database() AS db, now() AS now');
    return res.rows[0]; // { db: 'movies', now: '...' }
  } catch (err) {
    throw err;
  }
}