const mongoose = require('mongoose');
const app = require('../backend/src/app');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
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
