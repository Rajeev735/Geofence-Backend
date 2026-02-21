import mongoose, { Schema, Document } from "mongoose";

interface ISession {
  checkIn: Date;
  checkOut?: Date;
  duration: number; // minutes
}

export interface IAttendance extends Document {
  organizationId: mongoose.Types.ObjectId;

  userId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  zoneId: mongoose.Types.ObjectId;

  date: string;

  sessions: ISession[];

  totalDuration: number;

  status: "PRESENT" | "HALF_DAY" | "ABSENT";
}

const SessionSchema = new Schema<ISession>({
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
  duration: { type: Number, default: 0 }
});

const AttendanceSchema = new Schema<IAttendance>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required:true,
      index: true
    },

    zoneId: {
      type: Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
      index: true
    },

    date: {
      type: String,
      required: true,
      index: true
    },

    sessions: [SessionSchema],

    totalDuration: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["PRESENT", "HALF_DAY", "ABSENT"],
      default: "ABSENT"
    }
  },
  { timestamps: true }
);

AttendanceSchema.index({ userId: 1, date: 1, organizationId: 1 }, { unique: true });

export default mongoose.model<IAttendance>("Attendance", AttendanceSchema);
