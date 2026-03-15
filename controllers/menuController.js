import * as menuModel from '../models/menuModel.js';

export async function getMenu(req, res) {
  try {
    const items = await menuModel.getAll();
    res.json(items);
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Failed to fetch menu from the database.' });
  }
}
