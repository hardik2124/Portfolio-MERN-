const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getAllProjects, 
  getProject, 
  updateProject, 
  deleteProject,
  uploadProjectImage
} = require('../controllers/projectController');
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllProjects);
router.get('/:id', getProject);

// Protected routes
router.post('/', authenticateUser, authorizeAdmin, createProject);
router.post('/upload-image', authenticateUser, authorizeAdmin, uploadProjectImage);
router.patch('/:id', authenticateUser, authorizeAdmin, updateProject);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteProject);

module.exports = router; 