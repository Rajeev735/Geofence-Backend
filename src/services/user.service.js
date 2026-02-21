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
exports.getUsers = exports.loginUser = exports.createUserByRole = void 0;
const User_1 = __importDefault(require("../Models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/* ================= CREATE USERS BY ROLE ================= */
const createUserByRole = (creator, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield User_1.default.findOne({ email: payload.email });
    if (exists)
        throw new Error("Email already registered");
    console.log("payload", payload);
    /* ========= BRANCH ADMIN UNIQUE ========= */
    if (payload.role === "BRANCH_ADMIN") {
        const existingBranchAdmin = yield User_1.default.findOne({
            role: "BRANCH_ADMIN",
            branchId: payload.branchId,
            organizationId: creator.organizationId
        });
        if (existingBranchAdmin)
            throw new Error("Branch already has an admin");
    }
    /* ========= ZONE ADMIN UNIQUE ========= */
    if (payload.role === "ZONE_ADMIN") {
        const existingZoneAdmin = yield User_1.default.findOne({
            role: "ZONE_ADMIN",
            zoneId: payload.zoneId,
            organizationId: creator.organizationId
        });
        if (existingZoneAdmin)
            throw new Error("Zone already has an admin");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
    /* ========= ROLE CREATION ========= */
    if (payload.role === "BRANCH_ADMIN") {
        return User_1.default.create({
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            role: "BRANCH_ADMIN",
            organizationId: creator.organizationId,
            branchId: payload.branchId
        });
    }
    if (payload.role === "ZONE_ADMIN") {
        return User_1.default.create({
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            role: "ZONE_ADMIN",
            organizationId: creator.organizationId,
            branchId: creator.branchId || payload.branchId,
            zoneId: payload.zoneId
        });
    }
    if (payload.role === "USER") {
        return User_1.default.create({
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            role: "USER",
            organizationId: creator.organizationId,
            branchId: creator.branchId || payload.branchId,
            zoneId: payload.zoneId
        });
    }
    throw new Error("Invalid role assignment");
});
exports.createUserByRole = createUserByRole;
/* ================= LOGIN ================= */
const loginUser = (email, password, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email });
    if (!user)
        throw new Error("Invalid credentials");
    if (user.role !== role)
        throw new Error("Not authorized for this role");
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match)
        throw new Error("Invalid credentials");
    const token = jsonwebtoken_1.default.sign({
        userId: user._id,
        role: user.role,
        organizationId: user.organizationId,
        branchId: user.branchId,
        zoneId: user.zoneId
    }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
});
exports.loginUser = loginUser;
/* ================= GET USERS ================= */
const getUsers = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    return User_1.default.find(filter).select("-password");
});
exports.getUsers = getUsers;
