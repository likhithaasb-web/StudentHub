import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studenthub';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection notice: ${error.message}`);
    console.log(`[MongoDB] Note: To connect to MongoDB Atlas, add your cluster connection string to server/.env (MONGODB_URI)`);
    return null;
  }
};
