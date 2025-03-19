import jwt from "jsonwebtoken";
import { Request } from "express";

import User, { IUser } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

// Function to sign a token for a user
export const signToken = (user: IUser): string => {
  const signOptions = {
    expiresIn: JWT_EXPIRATION,
  };

  return jwt.sign(
    { userId: user._id, username: user.username },
    JWT_SECRET,
    signOptions as jwt.SignOptions
  );
};

// Middleware to authenticate the token from the request
export const authenticateToken = async (
  req: Request
) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get the token from the Authorization header
  if (!token) {
    return null; // Return null if no token
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string;
    };

    // Fetch the full user details from the database
    const user = await User.findById(decoded.userId).exec();
    if (!user) {
      return null; // Return null if user not found
    }
    
    return user; // Return the user object directly
  } catch (error) {
    console.error("Token validation error:", error);
    return null; // Return null on token error instead of throwing
  }
};

// Custom error class for authentication errors
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export default authenticateToken;
