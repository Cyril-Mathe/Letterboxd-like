// initdb.js
import fs from 'fs';
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
run();