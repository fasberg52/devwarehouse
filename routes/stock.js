const express = require('express');
const router = express.Router();
const { createStock, getAllStocks, getStockById, updateStock, deleteStock } = require('../controllers/stockController');

const adminMiddleware = require('./../middleware/adminMiddleware');

router.post('/',adminMiddleware,createStock);
  
router.get('/', adminMiddleware,getAllStocks);
  
router.get('/:id', adminMiddleware,getStockById);
  
router.put('/:id',adminMiddleware, updateStock);
  
router.delete('/:id',adminMiddleware,deleteStock);
  

module.exports = router;
