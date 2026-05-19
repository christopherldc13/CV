require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const cvsRoutes = require('./routes/cvs');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/cvs', cvsRoutes);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

module.exports = app;
