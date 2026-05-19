const mongoose = require('mongoose');
const app = require('../backend/src/app');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      family: 4,
    });
    isConnected = true;
  }
  return app(req, res);
};
