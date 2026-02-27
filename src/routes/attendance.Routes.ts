import { Router } from "express";
import { checkIn, checkOut } from "../controllers/attendence.controller";
import { protect, requireOrg } from "../Middlewares/auth.middleware";

const attendanceRoutes=Router()

attendanceRoutes.get("/check-in",protect,requireOrg ,checkIn)
attendanceRoutes.get("/check-out",protect,requireOrg, checkOut)

export default attendanceRoutes;