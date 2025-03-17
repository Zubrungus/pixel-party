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
): Promise<IUser | null> => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get the token from the Authorization header
  if (!token) {
    throw new AuthenticationError("Authentication token is required");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string;
    };

    // Fetch the full user details from the database
    const user = await User.findById(decoded.userId).exec();
    if (!user) {
      throw new AuthenticationError("User not found");
    }

    return user; // Return the full user object
  } catch (error) {
    throw new AuthenticationError("Invalid or expired token");
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
