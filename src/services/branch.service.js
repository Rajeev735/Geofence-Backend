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
exports.getBranchesByOrg = exports.updateBranch = exports.createBranch = void 0;
const Branch_1 = __importDefault(require("../Models/Branch"));
const mongoose_1 = __importDefault(require("mongoose"));
const createBranch = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return Branch_1.default.create(data);
});
exports.createBranch = createBranch;
const updateBranch = (branchId, updateData, organizationId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(branchId)) {
        throw new Error("Invalid branch ID");
    }
    const branch = yield Branch_1.default.findOne({
        _id: branchId,
        organizationId,
    });
    if (!branch) {
        throw new Error("Branch not found or unauthorized");
    }
    Object.assign(branch, updateData);
    return branch.save();
});
exports.updateBranch = updateBranch;
const getBranchesByOrg = (organizationId) => __awaiter(void 0, void 0, void 0, function* () {
    return Branch_1.default.find({ organizationId }).sort({ createdAt: -1 });
});
exports.getBranchesByOrg = getBranchesByOrg;
