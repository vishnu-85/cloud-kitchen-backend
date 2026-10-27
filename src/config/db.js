const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not set. Skipping MongoDB connection.');
    return;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 50, // Requested maximum for this long-running server's connection pool.
      minPoolSize: 5, // Keep a small number of connections ready between requests.
      maxIdleTimeMS: 60000,
      waitQueueTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;