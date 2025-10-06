import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./utils/connectDB";
import userRoutes from "./routes/user.routes"
import productRoutes from  "./routes/product.routes"
import orderRoutes from "./routes/order.routes"

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "",
    credentials: true,
  })
);

app.get("/", (_: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "server is running",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

const PORT: number = Number(process.env.PORT) || 7007;

const runServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

runServer();
