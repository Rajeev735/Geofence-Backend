"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendence_controller_1 = require("../controllers/attendence.controller");
const auth_middleware_1 = require("../Middlewares/auth.middleware");
const attendanceRoutes = (0, express_1.Router)();
attendanceRoutes.get("/check-in", auth_middleware_1.protect, attendence_controller_1.checkIn);
attendanceRoutes.get("/check-out", auth_middleware_1.protect, attendence_controller_1.checkOut);
exports.default = attendanceRoutes;
