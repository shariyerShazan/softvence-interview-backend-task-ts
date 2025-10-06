import { Request, Response } from "express";

import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { products, shippingAddress, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products selected",
      });
    }

    let vendors = new Set<string>();
    let totalAmount = 0;
    const orderProducts: {
      product: string;
      quantity: number;
      price: number;
    }[] = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.title}`,
        });
      }

      vendors.add(product.vendor.toString());

      const price = product.price * item.quantity;
      totalAmount += price;

      orderProducts.push({
        product: product._id.toString(),
        quantity: item.quantity,
        price,
      });
    }

    const order = new Order({
      customer: req.userId,
      vendors: Array.from(vendors),
      products: orderProducts,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    let orders;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "user") {
      orders = await Order.find({ customer: req.userId })
        .populate("products.product", "title price")
        .populate("vendors", "fullName email");
    } else if (user.role === "vendor") {
      orders = await Order.find({ vendors: req.userId })
        .populate("products.product", "title price")
        .populate("customer", "fullName email");
    } else if (user.role === "admin") {
      orders = await Order.find()
        .populate("products.product", "title price")
        .populate("customer vendors", "fullName email");
    } else {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      message: orders.length === 0 ? "No order yet!" : undefined,
      orders,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = ["pending", "completed", "canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findOne({ _id: orderId, vendors: req.userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Your orders not found",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
