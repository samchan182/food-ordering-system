/**
 * Node + Express + PostgreSQL
 */
import express from 'express';
import morgan from 'morgan';

import menuRoutes from './routes/menu.js';
import checkoutRoutes from './routes/checkout.js';

const app = express();
const port = 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/checkout', checkoutRoutes);

app.listen(port, () => {
  console.log(`System running on http://localhost:${port}`);
});
