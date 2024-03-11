const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const adminMiddelware = require('./../middleware/adminMiddleware');

router.post('/',adminMiddelware,createProduct);
  
router.get('/', adminMiddelware,getAllProducts);
  
// router.get('/:id', getProductById);
  
router.put('/:id', adminMiddelware,updateProduct);
  
router.delete('/:id',adminMiddelware , deleteProduct);
  

module.exports = router;
