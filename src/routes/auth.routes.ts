import { Router } from "express";
import {
  
  login,
  registerOrganization,
  registerPersonal
} from "../controllers/auth.controller";


const authRoutes = Router();

/* =========================================
   REGISTER SUPER ADMIN (one per org)
========================================= */
authRoutes.post("/register-org", registerOrganization);

/* =========================================
   LOGIN (ROLE-BOUND)
========================================= */
authRoutes.post("/login", login);
authRoutes.post("/register-user", registerPersonal);


export default authRoutes;
