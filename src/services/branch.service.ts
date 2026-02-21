import Branch from "../Models/Branch";
import mongoose from "mongoose";

export const createBranch = async (data: any) => {
  return Branch.create(data);
};



export const updateBranch = async (
  branchId: string,
  updateData: any,
  organizationId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(branchId)) {
    throw new Error("Invalid branch ID");
  }

  const branch = await Branch.findOne({
    _id: branchId,
    organizationId,
  });

  if (!branch) {
    throw new Error("Branch not found or unauthorized");
  }

  Object.assign(branch, updateData);

  return branch.save();
};

export const getBranchesByOrg = async (organizationId: string) => {
  return Branch.find({ organizationId }).sort({ createdAt: -1 });
};