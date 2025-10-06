import { Response } from "express";
import { AuthRequest } from "../types/express";
import { Product } from "../models/product.model";

export const addProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, price, stock, category, images } = req.body;

    if (!title || !description || !price || !stock || !category || !images) {
      return res.status(400).json({
        success: false,
        message: "Something is missing",
      });
    }

    const product = new Product({
      title,
      description,
      price,
      stock,
      category,
      vendor: req.userId,
      images,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find().populate("vendor", "fullName email");

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const vendorId = req.userId;
    const product = await Product.findOne({ _id: productId, vendor: vendorId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

