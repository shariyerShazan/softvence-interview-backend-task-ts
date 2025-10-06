import express, { Router } from "express";
import { isAuthed } from "../middlewares/isAuthed.ts";
import { isVendor } from "../middlewares/role.middleware.ts";
import { addProduct, deleteProduct, getAllProducts, updateProduct } from "../controllers/product.controller.ts";

const route: Router = express.Router();

route.post("/", isAuthed, isVendor, addProduct);
route.get("/", getAllProducts);
route.delete("/:productId", isAuthed, isVendor, deleteProduct);
route.patch("/:productId/update", isAuthed, isVendor, updateProduct);

export default route;
