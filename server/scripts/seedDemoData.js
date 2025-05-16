const mongoose = require('mongoose');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const User = require('../models/User');
const config = require('../config');

// Demo data for projects
const demoProjects = [
  {
    title: 'Portfolio Website',
    description: 'A modern portfolio website built with MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS. Features include dark/light theme, responsive design, and admin dashboard.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1631234567/portfolio/projects/portfolio.jpg',
    technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    github: 'https://github.com/yourusername/portfolio',
    liveDemo: 'https://yourportfolio.com',
    featured: true
  },
  {
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform with product catalog, shopping cart, user authentication, and payment processing. Built with React, Node.js, and Stripe integration.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1631234568/portfolio/projects/ecommerce.jpg',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    github: 'https://github.com/yourusername/ecommerce',
    liveDemo: 'https://yourecommerce.com',
    featured: true
  },
  {
    title: 'Task Management App',
    description: 'A productivity app that helps users organize tasks, set priorities, and track progress. Features include drag-and-drop interface, notifications, and team collaboration.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1631234569/portfolio/projects/taskmanager.jpg',
    technologies: ['React', 'Redux', 'Express', 'MongoDB'],
    github: 'https://github.com/yourusername/taskmanager',
    liveDemo: 'https://yourtaskmanager.com',
    featured: false
  }
];

// Demo data for skills
const demoSkills = [
  {
    name: 'React',
    category: 'Frontend',
    level: 90
  },
  {
    name: 'JavaScript',
    category: 'Frontend',
    level: 85
  },
  {
    name: 'HTML/CSS',
    category: 'Frontend',
    level: 95
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    level: 80
  },
  {
    name: 'Node.js',
    category: 'Backend',
    level: 85
  },
  {
    name: 'Express',
    category: 'Backend',
    level: 80
  },
  {
    name: 'MongoDB',
    category: 'Backend',
    level: 75
  },
  {
    name: 'Git',
    category: 'Tools',
    level: 85
  },
  {
    name: 'Docker',
    category: 'Tools',
    level: 70
  },
  {
    name: 'Figma',
    category: 'Design',
    level: 65
  }
];

// Connect to the database
const connectDB = async () => {
  try {
    // Use the MONGO_URI from the config file or use a default local URI
    const mongoURI = config.MONGO_URI || 'mongodb://localhost:27017/portfolio';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Add demo projects if none exist
const seedProjects = async (adminId) => {
  try {
    // Check if any projects exist
    const existingProjects = await Project.countDocuments();
    
    if (existingProjects > 0) {
      console.log(`${existingProjects} projects already exist, skipping project seeding`);
      return;
    }
    
    // Add creator ID to all projects
    const projectsWithCreator = demoProjects.map(project => ({
      ...project,
      createdBy: adminId
    }));
    
    // Insert demo projects
    await Project.insertMany(projectsWithCreator);
    console.log(`${demoProjects.length} demo projects added successfully`);
  } catch (error) {
    console.error('Error seeding projects:', error);
  }
};

// Add demo skills if none exist
const seedSkills = async (adminId) => {
  try {
    // Check if any skills exist
    const existingSkills = await Skill.countDocuments();
    
    if (existingSkills > 0) {
      console.log(`${existingSkills} skills already exist, skipping skill seeding`);
      return;
    }
    
    // Add creator ID to all skills
    const skillsWithCreator = demoSkills.map(skill => ({
      ...skill,
      createdBy: adminId
    }));
    
    // Insert demo skills
    await Skill.insertMany(skillsWithCreator);
    console.log(`${demoSkills.length} demo skills added successfully`);
  } catch (error) {
    console.error('Error seeding skills:', error);
  }
};

// Main function
const main = async () => {
  // Connect to the database
  const connected = await connectDB();
  
  if (connected) {
    try {
      // Find admin user
      const admin = await User.findOne({ role: 'admin' });
      
      if (!admin) {
        console.log('No admin user found. Please run createAdminUser.js first');
        mongoose.connection.close();
        return;
      }
      
      // Seed projects and skills
      await seedProjects(admin._id);
      await seedSkills(admin._id);
      
      console.log('Demo data seeding completed');
    } catch (error) {
      console.error('Error during seeding:', error);
    } finally {
      // Close the connection
      mongoose.connection.close();
      console.log('Database connection closed');
    }
  }
};

// Run the script
main(); 