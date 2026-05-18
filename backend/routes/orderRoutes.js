const express = require('express');
const router = express.Router();
const { addOrderItems, getOrders, getMyOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { protect, adminCheck } = require('../middleware/authMiddleware');

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, adminCheck, getOrders);
router.put('/:id/status', protect, adminCheck, updateOrderStatus);
router.delete('/:id', protect, adminCheck, deleteOrder);

module.exports = router;
