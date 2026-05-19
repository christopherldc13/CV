const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Mi CV Principal',
      trim: true,
    },
    cvData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    language: {
      type: String,
      default: 'es',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CV', cvSchema);
