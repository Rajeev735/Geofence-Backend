"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const geo_controller_1 = require("../controllers/geo.controller");
const geoRoutes = (0, express_1.Router)();
geoRoutes.post("/country", geo_controller_1.getCountryCoords);
geoRoutes.post("/state", geo_controller_1.getStateCoords);
exports.default = geoRoutes;
