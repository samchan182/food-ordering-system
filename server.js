/**
 * Node + Express + PostgreSQL
 */
import express from 'express';
import pg from 'pg';
import morgan from 'morgan';

const { Pool } = pg; // Extract the connection Pool from the pg library

const app = express(); // Create Express application instance
const port = 3000;

/**
 * Database Connection Bridge
 * This establishes the network connections to port 5246 
 * where your PostgreSQL engine is listening.
 */
const pool = new Pool({
  user: 'postgres',             // Your PostgreSQL username 
  host: '127.0.0.1',            // The local machine address
  database: 'food-ordering-db', // The specific database container we built
  password: 'Aaq112211',    // **REPLACE THIS with your pgAdmin password**
  port: 5432,                   // Your specific database door
});

/**
 * Middleware
 */
app.use(morgan('dev')); 

/**
 * Frontend Serving 
 */
app.use(express.json()); // Parse incoming JSON data from the checkout request
app.use(express.static('public')); // Serve the HTML/JS frontend from the 'public' directory

// GET: get request from client, for reading data from the non-volatile disk
app.get('/api/menu', async (req, res) => {
  try {
    // Send a signal over the bridge asking PostgreSQL for the menu table
    const result = await pool.query('SELECT id, name, description, price, category FROM menu_items ORDER BY id ASC');
    
    // PostgreSQL sends the data back inside the 'rows' array. We forward it to the frontend.
    res.json(result.rows); 

  } catch (error) {
    console.error("Database connection failed:", error);
    // If the bridge breaks, tell the frontend there was a server error
    res.status(500).json({ error: "Failed to fetch menu from the database." }); 
  }
});

// POST: send by client to server, create new resources, writing data
app.post('/api/checkout', (req, res) => {
  const order = req.body;
  console.log("New Order Received:", order); // Show request body in terminal
  
  // Later, this is where you will INSERT into PostgreSQL 
  // and trigger the Epson printer
  
  res.json({ success: true, message: 'Order processed successfully!', orderId: Math.floor(Math.random() * 1000) });
});

app.listen(port, () => {
  console.log(`System running on http://localhost:${port}`);
});