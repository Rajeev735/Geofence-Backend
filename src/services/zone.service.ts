import Zone from "../Models/Zone";
import mongoose from "mongoose";

/* =========================================
   CREATE ZONE
========================================= */

export const createZone = async (user:any, data:any) => {

  const zoneData:any = { ...data };

  if (user.organizationId) {
    // ORG MODE
    zoneData.organizationId = user.organizationId;

    if (user.role === "BRANCH_ADMIN" || user.role === "ZONE_ADMIN") {
      zoneData.branchId = user.branchId;
    }

    if (user.role === "SUPER_ADMIN" && !zoneData.branchId) {
      throw new Error("branchId is required");
    }

  } else {
    // PERSONAL MODE
    zoneData.ownerUserId = user.userId;

    if (!zoneData.branchId) {
      throw new Error("branchId is required for personal zones");
    }
  }

  return Zone.create(zoneData);
};

/* =========================================
   UPDATE ZONE (SECURE)
========================================= */

export const updateZone = async (
  user:any,
  zoneId:string,
  updateData:any
) => {
  if (!mongoose.Types.ObjectId.isValid(zoneId)) {
    throw new Error("Invalid zone ID");
  }

  const filter:any = { _id: zoneId };

  if (user.organizationId) {
    // ORG MODE
    filter.organizationId = user.organizationId;

    if (user.role === "BRANCH_ADMIN") {
      filter.branchId = user.branchId;
    }

    if (user.role === "ZONE_ADMIN") {
      filter._id = user.zoneId;
    }

  } else {
    // PERSONAL MODE
    filter.ownerUserId = user.userId;
  }

  const zone = await Zone.findOne(filter);

  if (!zone) throw new Error("Zone not found or unauthorized");

  Object.assign(zone, updateData);
  return zone.save();
};

/* =========================================
   GET ZONES (PERSONAL + ORG)
========================================= */

export const getZonesByScope = async (user:any) => {

  if (user.organizationId) {
    const filter:any = { organizationId: user.organizationId };

    if (user.role === "BRANCH_ADMIN") {
      filter.branchId = user.branchId;
    }

    if (user.role === "ZONE_ADMIN" || user.role === "USER") {
      filter._id = user.zoneId;
    }

    return Zone.find(filter);

  } else {
    // PERSONAL MODE
    return Zone.find({ ownerUserId: user.userId });
  }
};