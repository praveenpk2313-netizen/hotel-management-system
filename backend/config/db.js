const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('[DB] Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB] Error connecting to MongoDB: ${error.message}`);
    console.error(`[DB] Continuing startup without functional DB. Reconnection may trigger automatically via mongoose.`);
    // Removed process.exit(1) to allow HTTP port to stay open for health checks
  }
};

module.exports = connectDB;
