"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
server_1.io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log("AUTH MIDDLEWARE RUNNING");
    if (!token)
        return next(new Error("Unauthorized"));
    console.log("Token:", socket.handshake.auth);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    }
    catch (_a) {
        next(new Error("Invalid token"));
    }
});
