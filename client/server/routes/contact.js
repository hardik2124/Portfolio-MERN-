const express = require('express');
const router = express.Router();
const { 
  submitContact, 
  getAllContacts, 
  getContact, 
  updateContactStatus, 
  deleteContact 
} = require('../controllers/contactController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');

// Public routes
router.post('/', submitContact);

// Protected/Admin routes
router.get('/', authenticateUser, authorizeAdmin, getAllContacts);
router.get('/:id', authenticateUser, authorizeAdmin, getContact);
router.patch('/:id', authenticateUser, authorizeAdmin, updateContactStatus);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteContact);

module.exports = router;