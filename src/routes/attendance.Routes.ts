import { Router } from "express";
import { checkIn, checkOut } from "../controllers/attendence.controller";
import { protect } from "../Middlewares/auth.middleware";

const attendanceRoutes=Router()

attendanceRoutes.get("/check-in",protect, checkIn)
attendanceRoutes.get("/check-out",protect, checkOut)

export default attendanceRoutes;