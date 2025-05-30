const Project = require('../models/Project');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    // Add user id to request body
    req.body.createdBy = req.user.id;
    
    const project = await Project.create(req.body);
    
    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getAllProjects = async (req, res) => {
  try {
    console.log('Received request for getAllProjects', { query: req.query });
    
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    // Filtering with operators ($gt, $gte, etc)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    let query = Project.find(JSON.parse(queryStr));
    
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    const projects = await query;
    console.log(`Found ${projects.length} projects`);
    
    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error('Error in getAllProjects:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single project
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: `No project found with id: ${req.params.id}` 
      });
    }
    
    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a project
// @route   PATCH /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: `No project found with id: ${req.params.id}` 
      });
    }
    
    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: `No project found with id: ${req.params.id}` 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload project image
// @route   POST /api/projects/upload-image
// @access  Private/Admin
const uploadProjectImage = async (req, res) => {
  try {
    if (!req.files || !req.files.projectImage) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const image = req.files.projectImage;
    
    // Validate file type
    const fileTypes = /jpeg|jpg|png|gif|webp/;
    const mimeType = fileTypes.test(image.mimetype);
    
    if (!mimeType) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed (jpeg, jpg, png, gif, webp)'
      });
    }
    
    // Create a temporary file path for the upload
    const tempFilePath = image.tempFilePath || path.join(__dirname, '../temp', `${Date.now()}-${image.name}`);
    
    if (!image.tempFilePath) {
      // Move the file to a temp location if it's not already there
      await image.mv(tempFilePath);
    }
    
    try {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: 'portfolio/projects',
        public_id: `project-${req.user.id}-${Date.now()}`,
        overwrite: true,
        resource_type: 'image'
      });
      
      // Remove the temporary file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      
      res.status(200).json({
        success: true,
        data: {
          imageUrl: result.secure_url
        }
      });
    } catch (cloudinaryError) {
      // Remove the temporary file if it exists
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error uploading image to cloud storage'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
}; 