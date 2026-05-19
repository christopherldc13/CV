const mongoose = require('mongoose');
const app = require('../backend/src/app');

// Cache the connection across warm invocations
let connected = false;

module.exports = async (req, res) => {
  if (!connected) {
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    connected = true;
  }
  return app(req, res);
};
