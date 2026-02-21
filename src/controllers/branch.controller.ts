import { Request, Response } from "express";
import * as BranchService from "../services/branch.service";

/* =========================================
   CREATE BRANCH (AUTO ORG FROM TOKEN)
========================================= */

export const createBranchController = async (req: any, res: Response) => {
  try {
    console.log(req)
    const organizationId = req.user.organizationId; // FROM JWT
    console.log("org",organizationId)
    const branch = await BranchService.createBranch({
      ...req.body,
      organizationId
    });

    res.status(201).json({
      success: true,
      branch
    });

  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


/* =========================================
   UPDATE BRANCH (ORG SAFE)
========================================= */

export const updateBranchController = async (req: any, res: Response) => {
  try {
    const branchId = Array.isArray(req.params.branchId)
      ? req.params.branchId[0]
      : req.params.branchId;

    const organizationId = req.user.organizationId; // FROM JWT

    const branch = await BranchService.updateBranch(
      branchId,
      req.body,
      organizationId
    );

    res.status(200).json({
      success: true,
      branch
    });

  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const getMyBranchesController = async (req: any, res: Response) => {
  try {
    const organizationId = req.user.organizationId;

    const branches = await BranchService.getBranchesByOrg(organizationId);

    res.json({
      success: true,
      branches
    });

  } catch (err:any) {
    res.status(400).json({
      success:false,
      message: err.message
    });
  }
};
