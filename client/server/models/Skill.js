const mongoose = require('mongoose');

// Standard supported categories (for reference, but not enforced via enum)
const standardCategories = [
  'Frontend', 'frontend',
  'Backend', 'backend',
  'Database', 'database',
  'DevOps', 'devops',
  'Design', 'design',
  'Mobile', 'mobile',
  'Cloud', 'cloud',
  'AI/ML', 'ai/ml',
  'Blockchain', 'blockchain',
  'Security', 'security',
  'Other', 'other'
];

const SkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a skill name'],
      trim: true,
      maxlength: [50, 'Skill name cannot be more than 50 characters'],
    },
    icon: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
      validate: {
        validator: function(v) {
          // Allow any non-empty string as category (custom categories enabled)
          return v && v.length > 0;
        },
        message: props => `${props.value} is not a valid category. Category cannot be empty.`
      },
      default: 'Other',
    },
    level: {
      type: Number,
      min: [0, 'Level cannot be less than 0'],
      max: [100, 'Level cannot exceed 100'],
      default: 80,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      // Temporarily make this optional for development
      required: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', SkillSchema); 