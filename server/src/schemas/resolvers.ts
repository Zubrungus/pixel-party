import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Pixel, Cooldown } from "../models";
import dotenv from "dotenv";

dotenv.config();

const resolvers = {
  Query: {
    users: async () => await User.find(),
    pixels: async () => await Pixel.find(),
    cooldowns: async () => await Cooldown.find(),
  },

  Mutation: {
    signup: async (
      _: any,
      { username, password }: { username: string; password: string }
    ) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hashedPassword });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      return { token, user };
    },

    login: async (
      _: any,
      { username, password }: { username: string; password: string }
    ) => {
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      return { token, user };
    },

    placePixel: async (
      _: any,
      { x, y, color }: { x: number; y: number; color: string },
      context: any
    ) => {
      if (!context.token) {
        throw new Error("Unauthorized");
      }

      const decoded: any = jwt.verify(context.token, process.env.JWT_SECRET!);
      const userId = decoded.userId;

      const pixel = await Pixel.create({ userId, x, y, color });
      return pixel;
    },
  },
};

export default resolvers;
