// Load env variables - MUST be first
require('dotenv').config();
const config = require('./config');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fileUpload = require('express-fileupload');
const errorHandler = require('./middleware/errorHandler');

// Load Cloudinary configuration
require('./config/cloudinary');

// Create Express app
const app = express();

// Debug environment variables
console.log('MongoDB URI defined:', !!config.MONGO_URI);
console.log('PORT:', config.PORT);
console.log('Using Cloudinary for image storage');

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  createParentPath: true, // Creates upload directory if it doesn't exist
  useTempFiles: true,
  tempFileDir: './temp/'
}));

// Routes import
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const skillRoutes = require('./routes/skills');
const contactRoutes = require('./routes/contact');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);

// Error handler middleware
app.use(errorHandler);

// Serve static assets in production
if (config.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Connect to MongoDB
mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');

    // Start server
    const PORT = config.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
