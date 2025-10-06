import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

// Extend Request interface to include userId
interface AuthRequest extends Request {
  userId?: string;
}



// Admin middleware
export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId);
    if (user?.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Only admin allowed",
        success: false,
      });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Vendor middleware
export const isVendor = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId);
    if (user?.role !== "vendor") {
      return res.status(403).json({
        message: "Forbidden: Only Vendor allowed",
        success: false,
      });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

// User middleware
export const isUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId);
    if (user?.role !== "user") {
      return res.status(403).json({
        message: "Forbidden: Only user allowed",
        success: false,
      });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error", success: false });
  }
};
