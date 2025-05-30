const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [100, 'Project title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    technologies: {
      type: [String],
      required: [true, 'Please provide at least one technology'],
    },
    github: {
      type: String,
      default: '',
    },
    liveDemo: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema); 