import mongoose, { Schema, Document } from "mongoose";

export type UserRole =
  | "SUPER_ADMIN"
  | "BRANCH_ADMIN"
  | "ZONE_ADMIN"
  | "USER";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;

  organizationId: mongoose.Types.ObjectId;

  branchId?: mongoose.Types.ObjectId;
  zoneId?: mongoose.Types.ObjectId;

  isActive: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "BRANCH_ADMIN", "ZONE_ADMIN", "USER"],
      required: true
    },

    /* ================= MULTI TENANT ================= */

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default:null,
      index: true
    },

    /* ================= SCOPES ================= */

    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      default: null
    },

    zoneId: {
      type: Schema.Types.ObjectId,
      ref: "Zone",
      default: null
    },

    /* ================= STATUS ================= */

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
