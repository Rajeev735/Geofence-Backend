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
const server_1 = require("../server");
const Zone_1 = __importDefault(require("../Models/Zone"));
const Attendance_1 = __importDefault(require("../Models/Attendance"));
const point_in_polygon_1 = __importDefault(require("point-in-polygon"));
server_1.io.on("connection", socket => {
    const user = socket.user;
    console.log("🟢 Socket connected:", socket.id);
    socket.on("LOCATION_UPDATE", (_a) => __awaiter(void 0, [_a], void 0, function* ({ lat, lng }) {
        if (!user.zoneId)
            return;
        console.log("u", user);
        const zone = yield Zone_1.default.findOne({
            _id: user.zoneId,
            organizationId: user.organizationId
        });
        if (!zone)
            return;
        const polygon = zone.vertex.map((v) => [Number(v.longitude), Number(v.latitude)]);
        const inZone = (0, point_in_polygon_1.default)([Number(lng), Number(lat)], polygon);
        const today = new Date().toISOString().split("T")[0];
        let record = yield Attendance_1.default.findOne({
            userId: user.userId,
            date: today,
            organizationId: user.organizationId
        });
        const lastSession = record === null || record === void 0 ? void 0 : record.sessions[record.sessions.length - 1];
        /* ===== AUTO CHECK IN ===== */
        if (inZone && (!record || (lastSession === null || lastSession === void 0 ? void 0 : lastSession.checkOut))) {
            if (!record) {
                record = yield Attendance_1.default.create({
                    organizationId: user.organizationId,
                    userId: user.userId,
                    branchId: user.branchId,
                    zoneId: user.zoneId,
                    date: today,
                    sessions: [],
                    totalDuration: 0
                });
            }
            record.sessions.push({
                checkIn: new Date(),
                duration: 0
            });
            yield record.save();
            socket.emit("STATUS", "CHECKED_IN");
        }
        /* ===== AUTO CHECK OUT ===== */
        if (!inZone && record && lastSession && !lastSession.checkOut) {
            lastSession.checkOut = new Date();
            const mins = (lastSession.checkOut.getTime() - lastSession.checkIn.getTime()) / 60000;
            lastSession.duration = Math.round(mins);
            record.totalDuration += lastSession.duration;
            yield record.save();
            socket.emit("STATUS", "CHECKED_OUT");
        }
        console.log("Broadcasting location:", user.userId, lat, lng, inZone);
        socket.broadcast.emit("USER_LOCATION", {
            userId: user.userId,
            lat,
            lng,
            inZone
        });
    }));
});
