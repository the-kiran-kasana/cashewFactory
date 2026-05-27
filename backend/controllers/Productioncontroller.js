const ProductionItem = require('../models/Productionitem');
const Stock = require('../models/Stock');

const STAGE_ORDER = ['store', 'cutting', 'grinding', 'packaging', 'finished'];

// GET /api/production/:stage
exports.getStageItems = async (req, res) => {
  try {
    const { stage } = req.params;
    if (!STAGE_ORDER.includes(stage)) {
      return res.status(400).json({ message: `Invalid stage: ${stage}` });
    }
    const items = await ProductionItem.find({ stage }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/production/pull/stock-to-store
// Body: { stockId, quantity }
exports.pullFromStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    if (!stockId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'stockId and a positive quantity are required.' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) return res.status(404).json({ message: 'Stock item not found.' });

    if (stock.quantity < quantity) {
      return res.status(400).json({
        message: `Not enough quantity. Available: ${stock.quantity} ${stock.unit}`,
      });
    }

    // Deduct from stock
    stock.quantity -= quantity;
    await stock.save();

    // Merge if same item already in store, else create
    let storeItem = await ProductionItem.findOne({ stage: 'store', sourceStockId: stockId });
    if (storeItem) {
      storeItem.quantity += quantity;
      await storeItem.save();
    } else {
      storeItem = await ProductionItem.create({
        stage: 'store',
        sourceStockId: stock._id,
        name: stock.name,
        category: stock.category,
        origin: stock.origin,
        quality: stock.quality,
        quantity,
        unit: stock.unit,
      });
    }

    res.status(201).json({
      message: `Pulled ${quantity} ${stock.unit} of "${stock.name}" into Store.`,
      storeItem,
      updatedStock: stock,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/production/pull/:fromStage/:toStage
// Body: { productionItemId, quantity }
exports.pullBetweenStages = async (req, res) => {
  try {
    const { fromStage, toStage } = req.params;
    const { productionItemId, quantity } = req.body;

    const fromIndex = STAGE_ORDER.indexOf(fromStage);
    const toIndex = STAGE_ORDER.indexOf(toStage);

    if (fromIndex === -1 || toIndex === -1 || toIndex !== fromIndex + 1) {
      return res.status(400).json({ message: `Invalid stage transition: ${fromStage} → ${toStage}` });
    }

    if (!productionItemId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'productionItemId and a positive quantity are required.' });
    }

    const sourceItem = await ProductionItem.findOne({ _id: productionItemId, stage: fromStage });
    if (!sourceItem) {
      return res.status(404).json({ message: `Item not found in ${fromStage}.` });
    }

    if (sourceItem.quantity < quantity) {
      return res.status(400).json({
        message: `Not enough quantity. Available: ${sourceItem.quantity} ${sourceItem.unit}`,
      });
    }

    // Deduct from source; delete if quantity hits 0
    sourceItem.quantity -= quantity;
    if (sourceItem.quantity === 0) {
      await ProductionItem.findByIdAndDelete(sourceItem._id);
    } else {
      await sourceItem.save();
    }

    // Merge if same item already in destination, else create
    let destItem = await ProductionItem.findOne({
      stage: toStage,
      sourceStockId: sourceItem.sourceStockId,
    });

    if (destItem) {
      destItem.quantity += quantity;
      await destItem.save();
    } else {
      destItem = await ProductionItem.create({
        stage: toStage,
        sourceStockId: sourceItem.sourceStockId,
        name: sourceItem.name,
        category: sourceItem.category,
        origin: sourceItem.origin,
        quality: sourceItem.quality,
        quantity,
        unit: sourceItem.unit,
      });
    }

    res.status(201).json({
      message: `Pulled ${quantity} ${sourceItem.unit} of "${sourceItem.name}" from ${fromStage} → ${toStage}.`,
      destItem,
      sourceItem: sourceItem.quantity === 0 ? null : sourceItem,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/production/:stage/:id
exports.deleteStageItem = async (req, res) => {
  try {
    const { stage, id } = req.params;
    const item = await ProductionItem.findOneAndDelete({ _id: id, stage });
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json({ message: `"${item.name}" deleted from ${stage}.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};