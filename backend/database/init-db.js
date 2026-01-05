// initdb.js
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../database/dbConnect.js';

const sql = fs.readFileSync(new URL('../model/schema.sql', import.meta.url), 'utf8');

export default async function run() {
  try {
    await pool.query(sql);
    console.log('DB initialisée avec succès');
  } catch (err) {
    console.error('Erreur init DB', err);
    process.exit(1);
  }
}

// Execute only when run directly (node database/init-db.js)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run();
} 