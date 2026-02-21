import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId;
        role: "SUPER_ADMIN" | "BRANCH_ADMIN" | "ZONE_ADMIN" | "USER";
        organizationId: Types.ObjectId;
        branchId?: Types.ObjectId;
        zoneId?: Types.ObjectId;
      };
    }
  }
}

export {};
