import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) return mongoose.connection;
  const uri =
    process.env.MONGODB_URI || "mongodb://vibe-mongo:27017/vibe_commerce";
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  isConnected = true;
  return mongoose.connection;
}
