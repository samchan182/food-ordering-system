import express from 'express';
import pg from 'pg';
import morgan from 'morgan';

const app = express(); 
const port = 3000;

app.use(morgan('dev')); 
// Parse incoming JSON data from the checkout request
app.use(express.json()); 
// Serve the HTML/JS frontend from the 'public' directory
app.use(express.static('public')); 

// GET: Send the menu data to the frontend
app.get('/api/menu', (req, res) => {
  const menuData = [
    { id: 1, name: 'Double Smashburger', price: 12.00, desc: 'Two beef patties, cheese, house sauce.' },
    { id: 2, name: 'Spicy Chicken Sandwich', price: 10.50, desc: 'Crispy fried chicken, pickles, spicy mayo.' },
    { id: 3, name: 'Truffle Fries', price: 6.00, desc: 'Crispy fries tossed in truffle oil and parmesan.' }
  ];
  res.json(menuData); 
});

// POST: send by client to server, create new resources
app.post('/api/checkout', (req, res) => {
  const order = req.body;
  console.log("New Order Received:", order);
  
  // Later, this is where you will INSERT into PostgreSQL 
  // and trigger the Epson printer
  
  res.json({ success: true, message: 'Order processed successfully!', orderId: Math.floor(Math.random() * 1000) });
});

app.listen(port, () => {
  console.log(`System running on http://localhost:${port}`);
});