import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { Request } from "express";

dotenv.config();
const SECRET = process.env.JWT_SECRET || "supersecret";
const EXPIRATION = "2h";

export const signToken = (user: any) => {
  const payload = { _id: user._id, username: user.username };
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRATION });
};

export const authenticateToken = ({ req }: { req: Request }) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;

  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
};
