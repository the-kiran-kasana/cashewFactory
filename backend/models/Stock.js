const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'Raw' },
  origin: { type: String, default: '' },
  quality: { type: String, default: 'A' },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);