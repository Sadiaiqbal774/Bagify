const dbService = require('../services/dbService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res) => {
  const { orderItems, paymentMethod } = req.body;

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }

  try {
    const products = dbService.find('products');
    const validatedItems = [];
    let serverTotal = 0;

    for (const item of orderItems) {
      const itemId = item.id || item._id;
      const quantity = Number(item.qty);

      if (!itemId || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'Invalid order item quantity' });
      }

      const product = products.find((p) => String(p.id) === String(itemId) || String(p._id) === String(itemId));
      if (!product) {
        return res.status(400).json({ message: 'One or more products are no longer available' });
      }

      const price = Number(product.price);
      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({ message: `Invalid price for ${product.name}` });
      }

      validatedItems.push({
        id: product.id,
        _id: product._id,
        name: product.name,
        image: product.image,
        category: product.category,
        price,
        qty: quantity,
      });
      serverTotal += price * quantity;
    }

    const orderStr = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const order = dbService.create('orders', {
      orderNumber: orderStr,
      user: req.user ? (req.user.id || req.user._id || 'guest') : ('guest_' + Date.now()),
      userEmail: req.user ? (req.user.email || 'guest@bagify.com') : 'guest@bagify.com',
      orderItems: validatedItems,
      totalPrice: Number(serverTotal.toFixed(2)),
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

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = dbService.find('orders').filter(o => o.userEmail === req.user.email || String(o.user) === String(req.user.id || req.user._id));
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
