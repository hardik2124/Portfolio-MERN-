const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const authenticateUser = async (req, res, next) => {
  try {
    // Check for token in headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Authentication failed: No token or invalid format', { header: authHeader });
      return res.status(401).json({ success: false, message: 'Authentication failed: No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify token
      const payload = jwt.verify(token, config.JWT_SECRET);
      console.log('Token verified successfully for user:', payload.id);
      
      // Find user in database to ensure they exist
      const user = await User.findById(payload.id);
      if (!user) {
        console.log('User not found in database:', payload.id);
        return res.status(401).json({
          success: false,
          message: 'Authentication failed: User not found'
        });
      }
      
      // Attach user to request
      req.user = { id: payload.id, name: payload.name, role: payload.role };
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        console.error('Invalid token format:', error.message);
        return res.status(401).json({
          success: false,
          message: 'Authentication failed: Invalid token format',
          error: error.message
        });
      } else if (error.name === 'TokenExpiredError') {
        console.error('Token expired:', error.message);
        return res.status(401).json({
          success: false,
          message: 'Authentication failed: Token expired',
          error: error.message
        });
      } else {
        console.error('Token verification error:', error.message);
        return res.status(401).json({
          success: false,
          message: 'Authentication failed: Invalid token',
          error: error.message
        });
      }
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message
    });
  }
};

const authorizeAdmin = (req, res, next) => {
  console.log('Authorizing admin access for user:', {
    id: req.user.id,
    role: req.user.role,
    name: req.user.name
  });
  
  if (req.user.role !== 'admin') {
    console.error('Authorization failed: User does not have admin role', {
      userId: req.user.id,
      userRole: req.user.role,
      requiredRole: 'admin'
    });
    return res.status(403).json({ 
      success: false, 
      message: 'Not authorized to access this route. Admin permission required.',
      currentRole: req.user.role
    });
  }
  
  console.log('Admin authorization successful for user:', req.user.id);
  next();
};

module.exports = { authenticateUser, authorizeAdmin }; 