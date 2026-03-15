import pool from '../db.js';

export async function getAll() {
  const result = await pool.query(
    'SELECT id, name, description, price, category FROM menu_items ORDER BY id ASC'
  );
  return result.rows;
}
