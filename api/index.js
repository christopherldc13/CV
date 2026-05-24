import mongoose from 'mongoose';
import app from '../backend/src/app.js';

let isConnected = false;

export default async (req, res) => {
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
