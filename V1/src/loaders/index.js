const { connectDB } = require('./mongoDB');

module.exports = () => {
  connectDB();
};