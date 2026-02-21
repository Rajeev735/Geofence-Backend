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
      required: true
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
