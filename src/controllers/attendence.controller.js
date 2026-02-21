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
exports.checkOut = exports.checkIn = void 0;
const Zone_1 = __importDefault(require("../Models/Zone"));
const attendence_service_1 = require("../services/attendence.service");
/* ================= CHECK IN ================= */
const checkIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lat, lng } = req.body;
        const user = req.user;
        if (!user.zoneId)
            return res
                .status(400)
                .json({ message: "User not assigned to zone" });
        const zone = yield Zone_1.default.findOne({
            _id: user.zoneId,
            organizationId: user.organizationId
        });
        if (!zone)
            return res.status(404).json({ message: "Zone not found" });
        const polygon = zone.vertex.map((v) => [Number(v.longitude), Number(v.latitude)]);
        const inside = (0, attendence_service_1.isInsidePolygon)([lng, lat], polygon);
        if (!inside)
            return res
                .status(403)
                .json({ message: "Outside geofence" });
        const attendance = yield (0, attendence_service_1.checkInService)(user);
        res.json({
            success: true,
            attendance
        });
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
});
exports.checkIn = checkIn;
/* ================= CHECK OUT ================= */
const checkOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const attendance = yield (0, attendence_service_1.checkOutService)(user);
        res.json({
            success: true,
            attendance
        });
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
});
exports.checkOut = checkOut;
