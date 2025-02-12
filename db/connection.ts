import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("⚠️ MONGO_URI is not defined in environment variables!");
}

export const connectToDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("✅ Already connected to MongoDB.");
      return;
    }

    await mongoose.connect(MONGO_URI); // Simple connection

    console.log("🚀 Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
