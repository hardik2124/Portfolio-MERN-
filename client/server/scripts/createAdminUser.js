const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('../config');

// Default admin credentials - you should change these in production
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

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

// Create admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    // Check if an admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return existingAdmin;
    }
    
    // Create a new admin user
    const newAdmin = new User(adminUser);
    
    // Generate and save token
    const token = newAdmin.generateToken();
    newAdmin.token = token;
    
    await newAdmin.save();
    
    console.log('Admin user created successfully');
    console.log('Email:', adminUser.email);
    console.log('Password:', adminUser.password);
    console.log('Token:', token);
    
    return newAdmin;
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Main function
const main = async () => {
  // Connect to the database
  const connected = await connectDB();
  
  if (connected) {
    // Create admin user
    await createAdminUser();
    
    // Close the connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
main(); 