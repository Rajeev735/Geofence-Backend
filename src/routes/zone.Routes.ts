import { Router } from "express";
import {
  createZoneController,
  updateZoneController,
  getZonesController
} from "../controllers/zone.controller";

import { allowRoles, protect } from "../Middlewares/auth.middleware";

const zoneRoutes = Router();

/* ================= PROTECTED ================= */

zoneRoutes.post("/", protect, createZoneController);

zoneRoutes.put("/:zoneId", protect, updateZoneController);

zoneRoutes.get("/", protect, getZonesController);

export default zoneRoutes;
