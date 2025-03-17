import bcrypt from "bcrypt";
import { ObjectId } from "mongoose";
import { GraphQLContext } from "../models/GraphQlContext";

import User from "../models/User";
import Pixel from "../models/Pixel";
import Cooldown from "../models/Cooldown";
import { signToken, AuthenticationError } from "../utils/auth";

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
    placePixel: async (
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
