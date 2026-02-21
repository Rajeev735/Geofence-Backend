import { Router } from "express";
import { protect } from "../Middlewares/auth.middleware";
import { createUser, getUsersUnderMe } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post("/create", protect, createUser);
userRoutes.get("/", protect, getUsersUnderMe);

export default userRoutes;
