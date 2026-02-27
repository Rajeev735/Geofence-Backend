import { Router } from "express";
import {
  createZoneController,
  updateZoneController,
  getZonesController
} from "../controllers/zone.controller";

import { allowRoles, protect } from "../Middlewares/auth.middleware";

const zoneRoutes = Router();

/* ================= PROTECTED ================= */

zoneRoutes.post("/", protect,allowRoles("SUPER_ADMIN"), createZoneController);

zoneRoutes.put("/:zoneId", protect,allowRoles("SUPER_ADMIN"), updateZoneController);

zoneRoutes.get("/", protect, getZonesController);

export default zoneRoutes;
