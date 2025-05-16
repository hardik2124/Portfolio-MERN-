const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log('MongoDB connected from DatabaseConnection');
        return true;
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        return false;
    }
};

module.exports = connectDB;
