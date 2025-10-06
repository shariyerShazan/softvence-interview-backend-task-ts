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



