const jwt = require('jsonwebtoken');
const dbService = require('../services/dbService');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = dbService.findById('users', decoded.id);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
      } else {
        req.user = { id: decoded.id || 'guest_' + Date.now(), email: 'guest@bagify.com', role: 'customer' };
      }
      return next();
    } catch (error) {
      req.user = { id: 'guest_' + Date.now(), email: 'guest@bagify.com', role: 'customer' };
      return next();
    }
  }

  if (!token) {
    req.user = { id: 'guest_' + Date.now(), email: 'guest@bagify.com', role: 'customer' };
    return next();
  }
};

const adminCheck = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, adminCheck };
