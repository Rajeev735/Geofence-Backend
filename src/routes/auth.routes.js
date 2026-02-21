"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authRoutes = (0, express_1.Router)();
/* =========================================
   REGISTER SUPER ADMIN (one per org)
========================================= */
authRoutes.post("/register", auth_controller_1.registerOrganization);
/* =========================================
   LOGIN (ROLE-BOUND)
========================================= */
authRoutes.post("/login", auth_controller_1.login);
exports.default = authRoutes;
