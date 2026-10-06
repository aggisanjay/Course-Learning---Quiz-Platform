const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnflow';
  
  // Set mongoose options
  mongoose.set('strictQuery', false);

  try {
    // Attempt standard connection with 2.5s server selection timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] Connected to MongoDB: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[Database] Standard MongoDB connection failed (${err.message}).`);
    console.log('[Database] Starting in-memory MongoDB fallback server...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      
      await mongoose.connect(memUri);
      console.log(`[Database] Successfully connected to In-Memory MongoDB at: ${memUri}`);
      console.log('[Database] Tip: You can configure a remote MongoDB Atlas or local MongoDB in backend/.env');
    } catch (memErr) {
      console.error('[Database] Failed to start in-memory MongoDB fallback:', memErr);
      process.exit(1);
    }
  }
};

const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, closeDB };
