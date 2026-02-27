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
  ownerUserId: mongoose.Types.ObjectId;
}

const BranchSchema = new Schema<IBranch>(
  {
    branchName: { type: String, required: true },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
     
      default:null
    },

    countryName: String,
    stateName: String,

    area: Number,
    perimeter: Number,
  
    ownerUserId: {
  type: Schema.Types.ObjectId,
  ref: "User",
  default: null
},
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
