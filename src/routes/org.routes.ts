import { Router } from "express";
import { createOrganizationController } from "../controllers/org.controller";

const orgRoutes = Router();

orgRoutes.post("/create", createOrganizationController);

export default orgRoutes;
