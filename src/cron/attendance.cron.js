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
const node_cron_1 = __importDefault(require("node-cron"));
const Attendance_1 = __importDefault(require("../Models/Attendance"));
node_cron_1.default.schedule("*/5 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const limit = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const records = yield Attendance_1.default.find({
        "sessions.checkOut": { $exists: false }
    });
    for (const record of records) {
        const session = record.sessions[record.sessions.length - 1];
        if (!(session === null || session === void 0 ? void 0 : session.checkIn))
            continue;
        if (session.checkIn < limit) {
            session.checkOut = new Date();
            session.duration =
                (session.checkOut.getTime() - session.checkIn.getTime()) / 60000;
            record.totalDuration += session.duration;
            yield record.save();
        }
    }
    console.log("Auto checkout executed");
}));
