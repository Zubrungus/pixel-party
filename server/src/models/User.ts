import mongoose, { Schema, Document } from "mongoose";

// Interface for User document
interface IUser extends Document {
  username: string;
  password: string;
  createdAt: Date;
}

// Define the User schema
const userSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create the model from the schema
const User = mongoose.model<IUser>("User", userSchema);

export default User;
