import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { IUser } from "./user.model";
import { IProduct } from "./product.model";


interface IOrderProduct {
  product: Types.ObjectId | IProduct;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  customer: Types.ObjectId | IUser;
  vendors: (Types.ObjectId | IUser)[];
  products: IOrderProduct[];
  totalAmount: number;
  status: "pending" | "completed" | "canceled";
  shippingAddress?: string;
  paymentMethod: "cod" | "card" | "paypal" | "other";
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vendors: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "canceled"], default: "pending" },
    shippingAddress: { type: String },
    paymentMethod: { type: String, enum: ["cod", "card", "paypal", "other"], default: "cod" },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
