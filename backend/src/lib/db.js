import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) return mongoose.connection;
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vibe_commerce';
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });
  isConnected = true;
  return mongoose.connection;
}


