const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductBySlug, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { protect, adminCheck } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin routes
router.post('/', protect, adminCheck, createProduct);
router.put('/:id', protect, adminCheck, updateProduct);
router.delete('/:id', protect, adminCheck, deleteProduct);

module.exports = router;
