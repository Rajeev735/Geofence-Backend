import mongoose, { Schema, Document } from "mongoose";

export interface ICoordinate {
  latitude: string;
  longitude: string;
}

export interface IBranch extends Document {
  branchName: string;
  organizationId: mongoose.Types.ObjectId;
  countryName: string;
  stateName: string;
  vertex: ICoordinate[];
  area?: number;
  perimeter?: number;
}

const BranchSchema = new Schema<IBranch>(
  {
    branchName: { type: String, required: true },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required:true
    },

    countryName: String,
    stateName: String,

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

export default mongoose.model<IBranch>("Branch", BranchSchema);
