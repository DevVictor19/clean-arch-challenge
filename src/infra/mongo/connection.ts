import mongoose from "mongoose";
import { getEnv } from "../env/env-config";

export async function connectDB(): Promise<void> {
  const MONGO_URI = getEnv().mongoURI;

  mongoose.set("strictQuery", false);

  const connectWithRetry = () => {
    console.log("Attempting to connect to MongoDB...");

    mongoose
      .connect(MONGO_URI)
      .then(() => {
        console.log("MongoDB successfully connected!");
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        console.log("Retrying connection in 5 seconds...");
        setTimeout(connectWithRetry, 5000);
      });
  };

  connectWithRetry();

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected! Retrying connection...");
    connectWithRetry();
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
}
