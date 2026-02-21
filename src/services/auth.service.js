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
exports.login = exports.registerOrgWithSuperAdmin = void 0;
const User_1 = __importDefault(require("../Models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Organization_1 = __importDefault(require("../Models/Organization"));
/* =========================================
   REGISTER FIRST SUPER ADMIN (ONE TIME)
========================================= */
const registerOrgWithSuperAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield User_1.default.findOne({ email: payload.email });
    if (existing)
        throw new Error("Email already registered");
    // create organization
    const org = yield Organization_1.default.create({
        org: payload.orgName,
        country: payload.country,
        state: payload.state,
        email: payload.email
    });
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
    // create super admin
    const user = yield User_1.default.create({
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        organizationId: org._id
    });
    return { organization: org, superAdmin: user };
});
exports.registerOrgWithSuperAdmin = registerOrgWithSuperAdmin;
/* =========================================
   LOGIN (ROLE-BOUND)
========================================= */
const login = (email, password, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email });
    if (!user)
        throw new Error("Invalid credentials");
    if (user.role !== role)
        throw new Error("Not authorized for this role");
    const valid = yield bcrypt_1.default.compare(password, user.password);
    if (!valid)
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
exports.login = login;
