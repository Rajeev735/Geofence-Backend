"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const org_controller_1 = require("../controllers/org.controller");
const orgRoutes = (0, express_1.Router)();
orgRoutes.post("/create", org_controller_1.createOrganizationController);
exports.default = orgRoutes;
