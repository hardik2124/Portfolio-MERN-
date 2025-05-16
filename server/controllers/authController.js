const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Create user first
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token after user is created
    const token = user.generateToken();
    
    // Update user with token
    user.token = token;
    await user.save();

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        theme: user.theme,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = user.generateToken();
    
    // Save token to user document
    user.token = token;
    await user.save();
    
    console.log(`User ${user.name} logged in successfully. Token generated.`);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        theme: user.theme,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        yearsOfExperience: user.yearsOfExperience,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        socialLinks: user.socialLinks,
        theme: user.theme,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PATCH /api/auth/updateprofile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, location, yearsOfExperience, bio, socialLinks, theme, profileImage } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;
    if (yearsOfExperience !== undefined) updateData.yearsOfExperience = yearsOfExperience;
    if (bio) updateData.bio = bio;
    if (socialLinks) updateData.socialLinks = socialLinks;
    if (theme) updateData.theme = theme;
    if (profileImage) updateData.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        yearsOfExperience: user.yearsOfExperience,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        socialLinks: user.socialLinks,
        theme: user.theme,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload user avatar
// @route   POST /api/auth/avatar
// @access  Private
const uploadAvatar = async (req, res) => {
  try {
    console.log('Received avatar upload request:', req.files);
    
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const avatar = req.files.avatar;
    console.log('Avatar file received:', avatar.name, avatar.mimetype, avatar.size);
    
    // Validate file type
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(avatar.mimetype);
    
    if (!mimeType) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed (jpeg, jpg, png, gif)'
      });
    }
    
    // Create a temporary file path for the upload
    const tempFilePath = avatar.tempFilePath || path.join(__dirname, '../temp', `${Date.now()}-${avatar.name}`);
    
    if (!avatar.tempFilePath) {
      // Move the file to a temp location if it's not already there
      await avatar.mv(tempFilePath);
    }
    
    try {
      // Upload the image to Cloudinary
      console.log('Uploading to Cloudinary...');
      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: 'portfolio/avatars',
        public_id: `avatar-${req.user.id}-${Date.now()}`,
        overwrite: true,
        resource_type: 'image',
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },  // Crop to square with face detection
          { radius: "max" }  // Make it circular
        ],
        format: 'png'  // PNG format preserves transparency for circular images
      });
      
      console.log('Cloudinary upload result:', result.secure_url);
      
      // Remove the temporary file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      
      // Save Cloudinary URL to user profile
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profileImage: result.secure_url },
        { new: true }
      );
      
      console.log('User profile updated with new image:', user.profileImage);
      
      res.status(200).json({
        success: true,
        data: {
          profileImage: result.secure_url
        }
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      
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
    console.error('Avatar upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get public profile for portfolio display
// @route   GET /api/auth/profile/public
// @access  Public
const getPublicProfile = async (req, res) => {
  try {
    // Find an admin user - assuming the first admin user is the portfolio owner
    const user = await User.findOne({ role: 'admin' });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        yearsOfExperience: user.yearsOfExperience,
        profileImage: user.profileImage,
        bio: user.bio,
        socialLinks: user.socialLinks,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change user password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to change password'
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  uploadAvatar,
  changePassword,
  getPublicProfile,
}; 