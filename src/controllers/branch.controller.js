"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyBranchesController = exports.updateBranchController = exports.createBranchController = void 0;
const BranchService = __importStar(require("../services/branch.service"));
/* =========================================
   CREATE BRANCH (AUTO ORG FROM TOKEN)
========================================= */
const createBranchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req);
        const organizationId = req.user.organizationId; // FROM JWT
        console.log("org", organizationId);
        const branch = yield BranchService.createBranch(Object.assign(Object.assign({}, req.body), { organizationId }));
        res.status(201).json({
            success: true,
            branch
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});
exports.createBranchController = createBranchController;
/* =========================================
   UPDATE BRANCH (ORG SAFE)
========================================= */
const updateBranchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const branchId = Array.isArray(req.params.branchId)
            ? req.params.branchId[0]
            : req.params.branchId;
        const organizationId = req.user.organizationId; // FROM JWT
        const branch = yield BranchService.updateBranch(branchId, req.body, organizationId);
        res.status(200).json({
            success: true,
            branch
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});
exports.updateBranchController = updateBranchController;
const getMyBranchesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizationId = req.user.organizationId;
        const branches = yield BranchService.getBranchesByOrg(organizationId);
        res.json({
            success: true,
            branches
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});
exports.getMyBranchesController = getMyBranchesController;
