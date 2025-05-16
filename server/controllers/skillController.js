const Skill = require('../models/Skill');
const mongoose = require('mongoose');

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private/Admin
const createSkill = async (req, res) => {
  try {
    // Make sure createdBy is set - fix userId vs id issue
    if (req.user && req.user.userId) {
      req.body.createdBy = req.user.userId;
    } else if (req.user && req.user.id) {
      req.body.createdBy = req.user.id;
    } else {
      // For development purposes - set a default user ID if not available
      // This should be removed in production
      console.log('Warning: No user ID found in request. Using default ID for development.');
      req.body.createdBy = '65f50d5b11eb3a0018d1f9a1'; // Use a valid MongoDB ObjectId from your users collection
    }
    
    // If category is not in enum list and strict validation is causing issues
    // we can use 'Other' as a fallback
    if (req.body.category) {
      console.log(`Category provided: ${req.body.category}`);
    }
    
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, skill });
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getAllSkills = async (req, res) => {
  try {
    console.log('Received request for getAllSkills', { query: req.query });
    
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    // Filtering with operators ($gt, $gte, etc)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    let query = Skill.find(JSON.parse(queryStr));
    
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-level');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100; // Higher limit for skills
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    const skills = await query;
    console.log(`Found ${skills.length} skills`);
    
    res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    console.error('Error in getAllSkills:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get skills by category
// @route   GET /api/skills/category/:category
// @access  Public
const getSkillsByCategory = async (req, res) => {
  try {
    const skills = await Skill.find({ category: req.params.category }).sort('-proficiency');
    
    res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single skill
// @route   GET /api/skills/:id
// @access  Public
const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ 
        success: false, 
        message: `No skill found with id: ${req.params.id}` 
      });
    }
    
    res.status(200).json({
      success: true,
      skill,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a skill
// @route   PATCH /api/skills/:id
// @access  Private/Admin
const updateSkill = async (req, res) => {
  try {
    // Extract skill ID from params
    const skillId = req.params.id;
    
    // Handle different user ID formats
    let userId;
    if (req.user && req.user.userId) {
      userId = req.user.userId;
    } else if (req.user && req.user.id) {
      userId = req.user.id;
    } else {
      // For development, use the same default ID
      console.log('Warning: No user ID found in request. Using default ID for development.');
      userId = '65f50d5b11eb3a0018d1f9a1';
    }

    if (req.body.category) {
      console.log(`Category provided: ${req.body.category}`);
    }

    // For development, allow updates without createdBy filter
    let query = { _id: skillId };
    
    // In production, you should uncomment this to enforce user ownership
    // query = { _id: skillId, createdBy: userId };

    const skill = await Skill.findByIdAndUpdate(
      query,
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ 
        success: false, 
        message: `No skill with id ${skillId}` 
      });
    }

    res.status(200).json({ success: true, skill });
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ 
        success: false, 
        message: `No skill found with id: ${req.params.id}` 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSkill,
  getAllSkills,
  getSkillsByCategory,
  getSkill,
  updateSkill,
  deleteSkill,
}; 