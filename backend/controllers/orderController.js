const dbService = require('../services/dbService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res) => {
  const { orderItems, totalPrice, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }

  try {
    const orderStr = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const order = dbService.create('orders', {
      user: req.user.id || req.user._id,
      userEmail: req.user.email,
      orderItems,
      totalPrice,
      paymentMethod: paymentMethod || 'Credit / Debit Card',
      status: 'Processing',
      timeline: ['Ordered', 'Processing'],
      lastUpdate: 'We have received your order and are preparing it for shipment.',
      createdAt: new Date().toISOString()
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const orders = dbService.find('orders');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let timelineUpdate = ['Ordered', 'Processing'];
    let lastMsg = 'Order is processing.';

    if (status === 'Shipped') {
      timelineUpdate.push('Shipped');
      lastMsg = 'Your order has been shipped and is on its way.';
    } else if (status === 'Delivered') {
      timelineUpdate.push('Shipped', 'Delivered');
      lastMsg = 'Your order has been delivered successfully.';
    }

    const order = dbService.update('orders', req.params.id, { 
      status, 
      timeline: timelineUpdate,
      lastUpdate: lastMsg 
    });

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res) => {
  try {
    const success = dbService.delete('orders', req.params.id);
    if (success) {
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
