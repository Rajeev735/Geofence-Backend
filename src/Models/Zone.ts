import mongoose, { Schema, Document } from "mongoose";

export interface IZone extends Document {
  zoneName: string;
  branchId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  vertex: {
    latitude: string;
    longitude: string;
  }[];
  area?: number;
  perimeter?: number;
  ownerUserId:Schema.Types.ObjectId
}

const ZoneSchema = new Schema<IZone>(
  {
    zoneName: { type: String, required: true },

    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default:null
    },

ownerUserId: {
  type: Schema.Types.ObjectId,
  ref: "User",
  default: null
},
    area: Number,
    perimeter: Number,

    vertex: [
      {
        latitude: String,
        longitude: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<IZone>("Zone", ZoneSchema);
