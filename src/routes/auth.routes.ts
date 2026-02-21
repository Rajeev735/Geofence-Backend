import { Router } from "express";
import {
  
  login,
  registerOrganization
} from "../controllers/auth.controller";

const authRoutes = Router();

/* =========================================
   REGISTER SUPER ADMIN (one per org)
========================================= */
authRoutes.post("/register", registerOrganization);

/* =========================================
   LOGIN (ROLE-BOUND)
========================================= */
authRoutes.post("/login", login);

export default authRoutes;
