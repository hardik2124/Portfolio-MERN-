const express = require('express');
const router = express.Router();
const { 
  createSkill, 
  getAllSkills, 
  getSkillsByCategory, 
  getSkill, 
  updateSkill, 
  deleteSkill 
} = require('../controllers/skillController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllSkills);
router.get('/category/:category', getSkillsByCategory);
router.get('/:id', getSkill);

// Protected routes for admin
router.post('/', authenticateUser, authorizeAdmin, createSkill);
router.patch('/:id', authenticateUser, authorizeAdmin, updateSkill);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteSkill);

module.exports = router; 