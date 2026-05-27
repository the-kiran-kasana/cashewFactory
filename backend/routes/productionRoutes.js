const express = require('express');
const router = express.Router();
const {
  getStageItems,
  pullFromStock,
  pullBetweenStages,
  deleteStageItem,
} = require('../controllers/productionController');

// GET items in a stage: store | cutting | grinding | packaging | finished
router.get('/:stage', getStageItems);

// Pull Stock → Store | Body: { stockId, quantity }
router.post('/pull/stock-to-store', pullFromStock);

// Pull between stages | Body: { productionItemId, quantity }
router.post('/pull/:fromStage/:toStage', pullBetweenStages);

// Delete item from a stage
router.delete('/:stage/:id', deleteStageItem);

module.exports = router;