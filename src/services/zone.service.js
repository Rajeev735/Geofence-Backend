"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getZonesByScope = exports.updateZone = exports.createZone = void 0;
const Zone_1 = __importDefault(require("../Models/Zone"));
const mongoose_1 = __importDefault(require("mongoose"));
/* ================= CREATE ZONE ================= */
const createZone = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Always enforce org from token (never trust frontend)
    data.organizationId = user.organizationId;
    // Branch admin & zone admin always scoped to their branch
    if (user.role === "BRANCH_ADMIN" || user.role === "ZONE_ADMIN") {
        data.branchId = user.branchId;
    }
    // Super admin must explicitly pass branchId
    if (user.role === "SUPER_ADMIN" && !data.branchId) {
        throw new Error("branchId is required");
    }
    return Zone_1.default.create(data);
});
exports.createZone = createZone;
/* ================= UPDATE ZONE ================= */
const updateZone = (user, zoneId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(zoneId)) {
        throw new Error("Invalid zone ID");
    }
    const filter = {
        _id: zoneId,
        organizationId: user.organizationId
    };
    // Branch admin cannot update other branch zones
    if (user.role === "BRANCH_ADMIN") {
        filter.branchId = user.branchId;
    }
    // Zone admin can only update their own zone
    if (user.role === "ZONE_ADMIN") {
        filter._id = user.zoneId;
    }
    const zone = yield Zone_1.default.findOne(filter);
    if (!zone) {
        throw new Error("Zone not found or unauthorized");
    }
    Object.assign(zone, updateData);
    return zone.save();
});
exports.updateZone = updateZone;
/* ================= GET ZONES BY ROLE ================= */
const getZonesByScope = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, organizationId, branchId, zoneId } = user;
    let filter = { organizationId };
    if (role === "BRANCH_ADMIN") {
        filter.branchId = branchId;
    }
    if (role === "ZONE_ADMIN" || role === "USER") {
        filter._id = zoneId;
    }
    return Zone_1.default.find(filter);
});
exports.getZonesByScope = getZonesByScope;
