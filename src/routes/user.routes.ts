import { Router } from "express";
import { protect, requireOrg } from "../Middlewares/auth.middleware";
import { createUser, getUsersUnderMe } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post("/create", protect,requireOrg, createUser);

userRoutes.get("/", protect,requireOrg, getUsersUnderMe);

export default userRoutes;
