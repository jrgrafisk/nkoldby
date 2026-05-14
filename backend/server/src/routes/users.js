const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:id', (req, res) => {
  try {
    // TODO: Get from database
    res.json({
      id: req.params.id,
      username: 'username',
      bio: 'User bio',
      avatar_url: null,
      created_at: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.patch('/:id', authMiddleware, (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { username, bio, email } = req.body;
    // TODO: Update in database

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
