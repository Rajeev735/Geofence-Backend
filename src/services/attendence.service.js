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
exports.checkOutService = exports.checkInService = exports.isInsidePolygon = void 0;
const point_in_polygon_1 = __importDefault(require("point-in-polygon"));
const Attendance_1 = __importDefault(require("../Models/Attendance"));
/* ================= UTILS ================= */
const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
const isInsidePolygon = (point, polygon) => (0, point_in_polygon_1.default)(point, polygon);
exports.isInsidePolygon = isInsidePolygon;
/* ================= CHECK IN ================= */
const checkInService = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const date = today();
    let record = yield Attendance_1.default.findOne({
        userId: user._id,
        date,
        organizationId: user.organizationId
    });
    if (!record) {
        record = yield Attendance_1.default.create({
            organizationId: user.organizationId,
            userId: user._id,
            branchId: user.branchId,
            zoneId: user.zoneId,
            date,
            sessions: [],
            totalDuration: 0,
            status: "ABSENT"
        });
    }
    const lastSession = record.sessions[record.sessions.length - 1];
    if (lastSession && !lastSession.checkOut) {
        throw new Error("Already checked in");
    }
    record.sessions.push({
        checkIn: new Date(),
        duration: 0
    });
    yield record.save();
    return record;
});
exports.checkInService = checkInService;
/* ================= CHECK OUT ================= */
const checkOutService = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const date = today();
    const record = yield Attendance_1.default.findOne({
        userId: user._id,
        date,
        organizationId: user.organizationId
    });
    if (!record)
        throw new Error("No attendance record found");
    const session = record.sessions[record.sessions.length - 1];
    if (!session)
        throw new Error("No active session");
    if (session.checkOut)
        throw new Error("Already checked out");
    session.checkOut = new Date();
    const minutes = (session.checkOut.getTime() - session.checkIn.getTime()) / 60000;
    session.duration = Math.round(minutes);
    record.totalDuration += session.duration;
    /* ===== STATUS CALC ===== */
    if (record.totalDuration >= 480) {
        record.status = "PRESENT";
    }
    else if (record.totalDuration >= 240) {
        record.status = "HALF_DAY";
    }
    else {
        record.status = "ABSENT";
    }
    yield record.save();
    return record;
});
exports.checkOutService = checkOutService;
