/**
 * The setting of backend is node.js + express.js + PostgreSQL
 */

import express from 'express';
import pg from "pg";
import morgan from 'morgan';

/**
 * For index.js to set up express
 */
//const express = require('express'); // ??? why it doesn't need
const app = express(); // ???
const port = 3000;

/**
 * postgreSQL info to match database access
 */
const database = new pg.Client({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

/**
 * middleware is pre-handling
 */
app.use(morgan('tiny')); 

/**
 * Regulate routes of communication between client and server
 */
app.get('/', (req, res) => {
  res.send("Hello, My Backend is runningHere is only for testing the npm modules");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Test in Postman, doing post request with body
app.post('/', (req, res) => {
  console.log(req.body); // This would show the "Sam" data in your terminal
  res.send('Data received successfully!');
});
