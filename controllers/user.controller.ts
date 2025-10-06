import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";  // model এর টাইপ আলাদা বানাতে হবে
import dotenv from "dotenv";
dotenv.config();

interface AuthRequest extends Request {
  userId?: string; // middleware থেকে আসা userId
}

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { fullName, email, password }: { fullName: string; email: string; password: string } = req.body;

    if (!fullName || !email || !password) {
      return res.status(404).json({
        message: "Something is missing",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    if (!/[a-zA-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one letter",
      });
    }

    if (!/\d/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one number",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: "Registration failed",
      error: err.message,
      success: false,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, role }: { email: string; password: string; role: string } = req.body;

    if (!email || !password || !role) {
      return res.status(404).json({
        message: "Something is missing",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Password is incorrect",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(401).json({
        message: "User not available with this role",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY as string, {
      expiresIn: "7d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: "Login successful",
        user,
        success: true,
      });
  } catch (err: any) {
    return res.status(500).json({
      message: "Login failed",
      error: err.message,
      success: false,
    });
  }
};

export const firebaseLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { fullName, email }: { fullName: string; email: string } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: "Invalid data", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName,
        email,
        password: "firebase_auth",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY as string, {
      expiresIn: "7d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ success: true, message: "Login successful", user });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
};

export const logout = async (_: Request, res: Response): Promise<Response> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(200).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed", success: false });
  }
};

export const getAllVendor = async (_: Request, res: Response): Promise<Response> => {
  try {
    const vendors = await User.find({ role: "vendor" });
    if (!vendors || vendors.length === 0) {
      return res.status(404).json({
        message: "No member found",
        success: false,
      });
    }
    return res.status(200).json({
      vendors,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed", success: false });
  }
};

export const removeVendor = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { vendorId } = req.params;
    const vendor = await User.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
        success: false,
      });
    }

    vendor.role = "user";
    await vendor.save();

    return res.status(200).json({
      message: "Vendor removed",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed", success: false });
  }
};

