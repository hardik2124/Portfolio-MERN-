const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getCurrentUser, 
  updateProfile,
  uploadAvatar,
  changePassword,
  getPublicProfile
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile/public', getPublicProfile);

// Debug route - remove in production
router.get('/test-token', (req, res) => {
  const token = req.headers.authorization;
  res.json({
    success: true,
    message: 'Token debug info',
    hasToken: !!token,
    tokenValue: token ? token.split(' ')[1].substring(0, 10) + '...' : 'none',
    timestamp: new Date().toISOString()
  });
});

// Auth diagnostic route
router.get('/auth-status', authenticateUser, (req, res) => {
  res.json({
    success: true,
    message: 'Authentication status',
    user: {
      id: req.user.id,
      role: req.user.role,
      name: req.user.name
    },
    isAdmin: req.user.role === 'admin',
    timestamp: new Date().toISOString()
  });
});

// Protected routes
router.get('/me', authenticateUser, getCurrentUser);
router.patch('/updateprofile', authenticateUser, updateProfile);
router.post('/avatar', authenticateUser, uploadAvatar);
router.post('/change-password', authenticateUser, changePassword);
router.get('/checkauth', authenticateUser, (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'User is authenticated',
    user: { 
      id: req.user.id, 
      name: req.user.name, 
      email: req.user.email,
      role: req.user.role 
    }
  });
});

module.exports = router; 