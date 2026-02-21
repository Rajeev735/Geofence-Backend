"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zone_controller_1 = require("../controllers/zone.controller");
const auth_middleware_1 = require("../Middlewares/auth.middleware");
const zoneRoutes = (0, express_1.Router)();
/* ================= PROTECTED ================= */
zoneRoutes.post("/", auth_middleware_1.protect, zone_controller_1.createZoneController);
zoneRoutes.put("/:zoneId", auth_middleware_1.protect, zone_controller_1.updateZoneController);
zoneRoutes.get("/", auth_middleware_1.protect, zone_controller_1.getZonesController);
exports.default = zoneRoutes;
