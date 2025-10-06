import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

interface AuthRequest extends Request {
    userId?: string;
  }

dotenv.config();
// Authentication middleware
export const isAuthed = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as { userId: string };
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};