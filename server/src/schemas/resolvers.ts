import { User, Pixel, Cooldown } from "./models";
import bcrypt from "bcrypt";
import { signToken, AuthenticationError } from "../utils/auth";

// Interfaces for User, Pixel, and Cooldown
interface IUser {
  username: string;
  password: string;
  createdAt: Date;
}

interface IPixel {
  userId: string;
  x: number;
  y: number;
  color: string;
  placedAt: Date;
}

interface ICooldown {
  userId: string;
  lastPlacedAt: Date;
}

const resolvers = {
  Query: {
    getUser: async (
      _: any,
      { username }: { username: string }
    ): Promise<IUser | null> => {
      return User.findOne({ username }); // Find user by username
    },
    getPixels: async (
      _: any,
      { userId }: { userId: string }
    ): Promise<IPixel[]> => {
      return Pixel.find({ userId }); // Get all pixels placed by a user
    },
    getCooldown: async (
      _: any,
      { userId }: { userId: string }
    ): Promise<ICooldown | null> => {
      return Cooldown.findOne({ userId }); // Get cooldown for a user
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { username, password }: { username: string; password: string }
    ): Promise<IUser> => {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      return newUser;
    },
    createPixel: async (
      _: any,
      {
        userId,
        x,
        y,
        color,
      }: { userId: string; x: number; y: number; color: string }
    ): Promise<IPixel> => {
      const newPixel = new Pixel({ userId, x, y, color });
      await newPixel.save();
      return newPixel;
    },
    setCooldown: async (
      _: any,
      { userId }: { userId: string }
    ): Promise<ICooldown> => {
      const lastPlacedAt = new Date();
      const cooldown = new Cooldown({ userId, lastPlacedAt });
      await cooldown.save();
      return cooldown;
    },
  },
};

export default resolvers;
