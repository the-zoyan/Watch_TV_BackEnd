import mongoose from "mongoose";
import { config } from "./index.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.db);
    console.log("DB connected");
  } catch (err) {
    console.log("DB error", err);
    process.exit(1);
  }
};