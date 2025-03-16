import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

// Check if MONGODB_URI is defined
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables.");
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Database connected."))
  .catch((error) => {
    console.error("❌ Database connection error:", error);
    process.exit(1); // Exit process if connection fails
  });

export default mongoose.connection;
