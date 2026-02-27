import { Router } from "express";
import {
  createBranchController,
  getMyBranchesController,
  updateBranchController
} from "../controllers/branch.controller";
import { allowRoles, protect } from "../Middlewares/auth.middleware";

const branchRoutes = Router();

branchRoutes.post("/create",protect,allowRoles("SUPER_ADMIN"), createBranchController);
branchRoutes.put("/:branchId",protect, allowRoles("SUPER_ADMIN"),updateBranchController);
branchRoutes.get("/", protect, getMyBranchesController);

export default branchRoutes;
