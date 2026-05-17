const dbService = require('../services/dbService');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = dbService.find('users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user._id === req.params.id || req.user.id === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    // Prevent deleting other admins
    const targetUser = dbService.findById('users', req.params.id);
    if (targetUser && targetUser.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete another admin account' });
    }

    const success = dbService.delete('users', req.params.id);
    if (success) {
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
