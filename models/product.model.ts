import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { IUser } from "./user.model";


export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  vendor: Types.ObjectId | IUser;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);
