import { Request, Response } from "express";
import * as BranchService from "../services/branch.service";

/* =========================================
   CREATE BRANCH
========================================= */

export const createBranchController = async (req: any, res: Response) => {
  try {
    const data: any = { ...req.body };

    if (req.user.organizationId) {
      data.organizationId = req.user.organizationId; // Org mode
    } else {
      data.ownerUserId = req.user.userId; // Personal mode
    }

    const branch = await BranchService.createBranch(data);

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
   UPDATE BRANCH
========================================= */

export const updateBranchController = async (req: any, res: Response) => {
  try {
    const branch = await BranchService.updateBranch(
      req.params.branchId,
      req.body,
      req.user
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

/* =========================================
   DELETE BRANCH
========================================= */

export const deleteBranchController = async (req: any, res: Response) => {
  try {
    const branch = await BranchService.deleteBranch(
      req.params.branchId,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
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
   GET MY BRANCHES
========================================= */

export const getMyBranchesController = async (req: any, res: Response) => {
  try {
    const branches = await BranchService.getMyBranches(req.user);

    res.status(200).json({
      success: true,
      branches
    });

  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};