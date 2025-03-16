import mongoose, { Schema, Document } from "mongoose";

// Interface for Pixel document
interface IPixel extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  x: number;
  y: number;
  color: string;
  placedAt: Date;
}

// Define the Pixel schema
const pixelSchema: Schema<IPixel> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    color: { type: String, required: true },
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create the model from the schema
const Pixel = mongoose.model<IPixel>("Pixel", pixelSchema);

export default Pixel;
