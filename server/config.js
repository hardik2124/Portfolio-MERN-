// Configuration file for MongoDB and other settings
module.exports = {
  MONGO_URI: process.env.MONGO_URI ,
  PORT: process.env.PORT ,//|| 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'portfolio_secret_key',
  NODE_ENV: process.env.NODE_ENV || 'development'
}; 