const express = require('express');
const router = express.Router();
const { getStock, addStock, updateStock, deleteStock } = require('../controllers/stockController');

router.get('/', getStock);
router.post('/', addStock);
router.put('/:id', updateStock);
router.delete('/:id', deleteStock);

module.exports = router;