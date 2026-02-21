import Zone from "../Models/Zone";
import mongoose from "mongoose";

/* ================= CREATE ZONE ================= */

export const createZone = async (user: any, data: any) => {

  // Always enforce org from token (never trust frontend)
  data.organizationId = user.organizationId;

  // Branch admin & zone admin always scoped to their branch
  if (user.role === "BRANCH_ADMIN" || user.role === "ZONE_ADMIN") {
    data.branchId = user.branchId;
  }

  // Super admin must explicitly pass branchId
  if (user.role === "SUPER_ADMIN" && !data.branchId) {
    throw new Error("branchId is required");
  }

  return Zone.create(data);
};


/* ================= UPDATE ZONE ================= */

export const updateZone = async (
  user: any,
  zoneId: string,
  updateData: any
) => {
  if (!mongoose.Types.ObjectId.isValid(zoneId)) {
    throw new Error("Invalid zone ID");
  }

  const filter: any = {
    _id: zoneId,
    organizationId: user.organizationId
  };

  // Branch admin cannot update other branch zones
  if (user.role === "BRANCH_ADMIN") {
    filter.branchId = user.branchId;
  }

  // Zone admin can only update their own zone
  if (user.role === "ZONE_ADMIN") {
    filter._id = user.zoneId;
  }

  const zone = await Zone.findOne(filter);

  if (!zone) {
    throw new Error("Zone not found or unauthorized");
  }

  Object.assign(zone, updateData);
  return zone.save();
};


/* ================= GET ZONES BY ROLE ================= */

export const getZonesByScope = async (user: any) => {
  const { role, organizationId, branchId, zoneId } = user;

  let filter: any = { organizationId };

  if (role === "BRANCH_ADMIN") {
    filter.branchId = branchId;
  }

  if (role === "ZONE_ADMIN" || role === "USER") {
    filter._id = zoneId;
  }

  return Zone.find(filter);
};
