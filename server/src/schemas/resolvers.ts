import bcrypt from "bcrypt";
import { ObjectId } from "mongoose";
import { GraphQLContext } from "../models/GraphQlContext";

import User from "../models/User.js";
import Pixel from "../models/Pixel.js";
import Cooldown from "../models/Cooldown.js";
import { signToken, AuthenticationError } from "../utils/auth.js";
import { pubsub } from "./index.js";

// Event names
const PIXEL_UPDATED = 'PIXEL_UPDATED';

// Interfaces for User, Pixel, and Cooldown
interface IUser {
  username: string;
  password: string;
  createdAt: Date;
}

interface IPixel {
  userId: ObjectId;
  x: number;
  y: number;
  color: string;
  placedAt: Date;
}

interface ICooldown {
  userId: ObjectId;
  lastPlacedAt: Date;
}

interface IUserWithToken extends IUser {
  token: string;
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
    getAllPixels: async (): Promise<IPixel[]> => {
      return Pixel.find({}); // Get all pixels in the canvas
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
    ): Promise<IUserWithToken> => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      const token = signToken(newUser); // Generate token after user creation
      return { ...newUser.toObject(), token }; // Return token along with the user object
    },
    createPixel: async (
      _parent: any,
      { x, y, color }: any,
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to place a pixel."
        );
      }

      const newPixel = await Pixel.create({
        x,
        y,
        color,
        userId: context.user._id, // Associate pixel with the user
      });
      const existingUser = await User.findOne({_id: context.user._id});
      // Check if pixel already exists at this location
      const existingPixel = await Pixel.findOne({ x, y });
      let newPixelToSend;
      
      
      if (existingPixel && existingUser) {
        // Update existing pixel
        existingPixel.color = color;
        existingPixel.userId = existingUser?._id;
        existingPixel.placedAt = new Date();
        await existingPixel.save();
        newPixelToSend = existingPixel;
      } else {
        // Create new pixel
        newPixelToSend = new Pixel({ userId: context.user._id, x, y, color });
        await newPixel.save();
      }
      
      // Publish the pixel update to all subscribers
      pubsub.publish(PIXEL_UPDATED, { pixelUpdated: newPixelToSend });
 
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
  Subscription: {
    pixelUpdated: {
      subscribe: () => pubsub.subscribe(PIXEL_UPDATED, (message) => message),
    },
  },
};

export default resolvers;
