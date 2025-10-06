import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGO_URL as string;
    if (!mongoUrl) {
      throw new Error("MONGO_URL not found in environment variables");
    }

    await mongoose.connect(mongoUrl);
    console.log("Mongodb connected");
  } catch (error) {
    console.error("Error connecting to DB:", error);
  }
};
