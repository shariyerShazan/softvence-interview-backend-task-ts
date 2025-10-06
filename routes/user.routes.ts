import express, { Router } from "express";
import { acceptVendorRequest, firebaseLogin, getAllVendor, login, logout, register, removeVendor, requestForVendor } from "../controllers/user.controller.ts";
import { isAuthed } from "../middlewares/isAuthed.ts";
import { isAdmin, isUser } from "../middlewares/role.middleware.ts";



const route: Router = express.Router();

route.post("/register", register);
route.post("/login", login);
route.post("/firebase-login", firebaseLogin);
route.post("/logout", isAuthed, logout);

route.get("/vendors", isAuthed, isAdmin, getAllVendor);
route.delete("/remove-vendor/:vendorId", isAuthed, isAdmin, removeVendor);

route.post("/request-vendor", isAuthed, isUser, requestForVendor);
route.post("/:userID/vendor", isAuthed, isAdmin, acceptVendorRequest);

export default route;
