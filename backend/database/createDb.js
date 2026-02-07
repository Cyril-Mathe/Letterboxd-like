import { Pool } from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const sql = fs.readFileSync('./model/schema.sql', 'utf8');

// Connexion temporaire pour créer la DB
const tempPool = new Pool({
  connectionString: process.env.DATABASE_URL.replace(/\/[^\/]+$/, '/postgres'),
});

await tempPool.query(`CREATE DATABASE movies`).catch(() => {});
await tempPool.end();

// Maintenant exécuter le schema dans movies
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
await pool.query(sql);
await pool.end();
