import express, { Router } from "express";
import { isAuthed } from "../middlewares/isAuthed.ts";
import { isUser, isVendor } from "../middlewares/role.middleware.ts";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/order.controller.ts";


const route: Router = express.Router();

route.post("/", isAuthed, isUser, createOrder);
route.get("/", isAuthed, getOrders);
route.post("/:orderId/status", isAuthed, isVendor, updateOrderStatus);

export default route;
