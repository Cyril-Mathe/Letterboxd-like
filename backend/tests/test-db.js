// test-db.js
import pool from '../database/dbConnect.js';

(async () => {
  try {
    const res = await pool.query('SELECT current_database() AS db, now() AS now');
    console.log('Connected to DB:', res.rows[0].db);
    console.log('Time on server:', res.rows[0].now);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('DB test failed:', err.message);
    process.exit(1);
  }
})();