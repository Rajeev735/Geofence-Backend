import Branch from "../Models/Branch";
import mongoose from "mongoose";

/* =========================================
   CREATE BRANCH
========================================= */

export const createBranch = async (data: any) => {
  return Branch.create(data);
};

/* =========================================
   UPDATE BRANCH (SECURE)
========================================= */

export const updateBranch = async (
  branchId: string,
  updateData: any,
  user: any
) => {
  if (!mongoose.Types.ObjectId.isValid(branchId)) {
    throw new Error("Invalid branch ID");
  }

  const filter: any = { _id: branchId };

  if (user.organizationId) {
    filter.organizationId = user.organizationId;
  } else {
    filter.ownerUserId = user.userId;
  }

  const branch = await Branch.findOne(filter);

  if (!branch) {
    throw new Error("Branch not found or unauthorized");
  }

  Object.assign(branch, updateData);

  return branch.save();
};

/* =========================================
   DELETE BRANCH
========================================= */

export const deleteBranch = async (
  branchId: string,
  user: any
) => {
  if (!mongoose.Types.ObjectId.isValid(branchId)) {
    throw new Error("Invalid branch ID");
  }

  const filter: any = { _id: branchId };

  if (user.organizationId) {
    filter.organizationId = user.organizationId;
  } else {
    filter.ownerUserId = user.userId;
  }

  const branch = await Branch.findOneAndDelete(filter);

  if (!branch) {
    throw new Error("Branch not found or unauthorized");
  }

  return branch;
};

/* =========================================
   GET MY BRANCHES
========================================= */

export const getMyBranches = async (user: any) => {
  if (user.organizationId) {
    return Branch.find({
      organizationId: user.organizationId
    }).sort({ createdAt: -1 });
  } else {
    return Branch.find({
      ownerUserId: user.userId
    }).sort({ createdAt: -1 });
  }
};