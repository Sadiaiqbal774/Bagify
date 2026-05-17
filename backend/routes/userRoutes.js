const express = require('express');
const router = express.Router();
const { getUsers, deleteUser } = require('../controllers/userController');
const { protect, adminCheck } = require('../middleware/authMiddleware');

router.get('/', protect, adminCheck, getUsers);
router.delete('/:id', protect, adminCheck, deleteUser);

module.exports = router;
