import { Router } from "express";
import {
  createBranchController,
  getMyBranchesController,
  updateBranchController
} from "../controllers/branch.controller";
import { allowRoles, protect } from "../Middlewares/auth.middleware";

const branchRoutes = Router();

branchRoutes.post("/create",protect,createBranchController);
branchRoutes.put("/:branchId",protect,updateBranchController);
branchRoutes.get("/", protect, getMyBranchesController);

export default branchRoutes;
