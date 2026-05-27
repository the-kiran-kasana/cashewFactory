const mongoose = require('mongoose');

const productionItemSchema = new mongoose.Schema({
  stage: {
    type: String,
    enum: ['store', 'cutting', 'grinding', 'packaging', 'finished'],
    required: true,
  },
  sourceStockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
  name: { type: String, required: true },
  category: { type: String, default: '' },
  origin: { type: String, default: '' },
  quality: { type: String, default: 'A' },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
}, { timestamps: true });

module.exports = mongoose.model('ProductionItem', productionItemSchema);