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
  _id: string | ObjectId;
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

interface AuthResponse {
  token: string;
  user: IUser;
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
    signup: async (
      _: any,
      { username, password }: { username: string; password: string }
    ): Promise<AuthResponse> => {
      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error("Username already exists");
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      const token = signToken(newUser); // Generate token after user creation
      
      return { 
        token,
        user: newUser
      };
    },
    login: async (
      _: any,
      { username, password }: { username: string; password: string }
    ): Promise<AuthResponse> => {
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        throw new AuthenticationError("Invalid username or password");
      }
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AuthenticationError("Invalid username or password");
      }
      
      // Generate token
      const token = signToken(user);
      
      return {
        token,
        user
      };
    },
    createPixel: async (
      _parent: any,
      { x, y, color }: any,
      context: GraphQLContext
    ) => {
      // Check for authenticated user
      if (!context.user) {
        throw new AuthenticationError(
          "You must be logged in to place a pixel."
        );
      }

      // Check if pixel already exists at this location
      const existingPixel = await Pixel.findOne({ x, y });
      
      if (existingPixel) {
        // Update existing pixel
        existingPixel.color = color;
        existingPixel.userId = context.user._id;
        existingPixel.placedAt = new Date();
        await existingPixel.save();
        
        console.log('Publishing pixel update to subscribers (existing pixel):', existingPixel);
        // Publish the pixel update to all subscribers
        pubsub.publish(PIXEL_UPDATED, { pixelUpdated: existingPixel });
        
        return existingPixel;
      } else {
        // Create new pixel
        const newPixel = new Pixel({ 
          x, 
          y, 
          color, 
          userId: context.user._id 
        });
        
        await newPixel.save();
        
        console.log('Publishing pixel update to subscribers (new pixel):', newPixel);
        // Publish the pixel update to all subscribers
        pubsub.publish(PIXEL_UPDATED, { pixelUpdated: newPixel });
        
        return newPixel;
      }
      
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
      subscribe: () => {
        console.log('New client subscribed to pixelUpdated');
        return pubsub.subscribe(PIXEL_UPDATED, (message) => {
          console.log('Sending subscription message:', message);
          return message;
        });
      },
    },
  },
};

export default resolvers;
