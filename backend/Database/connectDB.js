import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db_url = process.env.MONGODB_URI;
    const db = await mongoose.connect(db_url, {
      bufferCommands: false,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("Database Successfully Connected ------->");
  } catch (error) {
    console.log("Database Not Connected !!!!!!", error.message);
  }
};

export default connectDB;