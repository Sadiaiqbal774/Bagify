const dbService = require('../services/dbService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getRoleForEmail } = require('../utils/role');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
exports.registerUser = async (req, res) => {
  const { name, email, password, role: requestedRole } = req.body;

  try {
    const userExists = dbService.findOne('users', { email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    if (requestedRole === 'admin' && getRoleForEmail(email) !== 'admin') {
      return res.status(403).json({
        message: 'Administrator access is limited to authorized store owner accounts only.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const role = requestedRole === 'admin' ? 'admin' : 'user';

    const user = dbService.create('users', { 
      name, 
      email, 
      password: hashedPassword, 
      role,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: getRoleForEmail(user.email),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = dbService.findOne('users', { email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: getRoleForEmail(user.email),
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
