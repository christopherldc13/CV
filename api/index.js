const mongoose = require('mongoose');
const app = require('../backend/src/app');

let isConnected = false;

module.exports = async (req, res) => {
  // Diagnostic: show env state
  if (req.url === '/api/health') {
    return res.status(200).json({
      mongoUriSet: !!process.env.MONGODB_URI,
      mongoState: mongoose.connection.readyState,
      nodeEnv: process.env.NODE_ENV,
    });
  }

  if (!isConnected) {
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ message: 'MONGODB_URI env var is not set' });
    }
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        family: 4,
      });
      isConnected = true;
    } catch (err) {
      console.error('[DB] connection failed:', err.message);
      return res.status(500).json({ message: 'DB connection failed: ' + err.message });
    }
  }
  return app(req, res);
};
