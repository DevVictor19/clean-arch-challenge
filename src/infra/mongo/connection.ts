import mongoose from "mongoose";
import { getEnv } from "../env/env-config";

export async function connectDB(): Promise<void> {
  try {
    console.log("Attempting connection to mongoDB...");
    await mongoose.connect(getEnv().mongo.uri, {
      autoIndex: true,
      dbName: getEnv().mongo.dbName,
    });
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected! Retrying connection...");
  setTimeout(() => connectDB(), 5000);
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
