"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../Middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const userRoutes = (0, express_1.Router)();
userRoutes.post("/create", auth_middleware_1.protect, user_controller_1.createUser);
userRoutes.get("/", auth_middleware_1.protect, user_controller_1.getUsersUnderMe);
exports.default = userRoutes;
