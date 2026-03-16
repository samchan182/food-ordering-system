/**
 * Node + Express + PostgreSQL
 */
import 'dotenv/config';
import { HttpsProxyAgent } from 'https-proxy-agent';
import https from 'https';

// Route all outbound HTTPS through the local VPN proxy (needed in mainland China)
if (process.env.HTTPS_PROXY) {
  const agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
  https.globalAgent = agent;
}
import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import passport from './config/passport.js';

import menuRoutes from './routes/menu.js';
import checkoutRoutes from './routes/checkout.js';
import authRoutes from './routes/auth.js';

const app = express();
const port = 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/checkout', checkoutRoutes);

app.listen(port, () => {
  console.log(`System running on http://localhost:${port}`);
});
