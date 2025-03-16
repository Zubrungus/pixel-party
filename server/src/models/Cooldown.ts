import mongoose, { Schema, Document } from "mongoose";

// Interface for Cooldown document
interface ICooldown extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  lastPlacedAt: Date;
}

// Define the Cooldown schema
const cooldownSchema: Schema<ICooldown> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastPlacedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Create the model from the schema
const Cooldown = mongoose.model<ICooldown>("Cooldown", cooldownSchema);

export default Cooldown;
