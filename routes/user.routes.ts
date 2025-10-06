import express, { Router } from "express";
import { register } from "module";


const route: Router = express.Router();

route.post("/register", register);
route.post("/login", logi);
route.post("/firebase-login", firebaseLogin);
route.post("/logout", isAuthed, logout);

route.get("/vendors", isAuthed, isAdmin, getAllVendor);
route.delete("/remove-vendor/:vendorId", isAuthed, isAdmin, removeVendor);

route.post("/request-vendor", isAuthed, isUser, requestForVendor);
route.post("/:userID/vendor", isAuthed, isAdmin, acceptVendorRequest);

export default route;
