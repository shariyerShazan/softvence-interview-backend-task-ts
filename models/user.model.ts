import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email?: string;
  password: string;
  profilePicture?: string;
  role: "user" | "vendor" | "admin";
  vendorRequest?: "pending" | "approved" | "rejected" | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    role: { type: String, enum: ["user", "vendor", "admin"], default: "user" },
    vendorRequest: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: null,
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
