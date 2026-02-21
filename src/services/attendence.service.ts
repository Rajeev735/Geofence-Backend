import inside from "point-in-polygon";
import Attendance from "../Models/Attendance";

/* ================= UTILS ================= */

const today = () =>
  new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

export const isInsidePolygon = (
  point: [number, number],
  polygon: [number, number][]
) => inside(point, polygon);

/* ================= CHECK IN ================= */

export const checkInService = async (user: any) => {
  const date = today();

  let record = await Attendance.findOne({
    userId: user._id,
    date,
    organizationId: user.organizationId
  });

  if (!record) {
    record = await Attendance.create({
      organizationId: user.organizationId,
      userId: user._id,
      branchId: user.branchId,
      zoneId: user.zoneId,
      date,
      sessions: [],
      totalDuration: 0,
      status: "ABSENT"
    });
  }

  const lastSession = record.sessions[record.sessions.length - 1];

  if (lastSession && !lastSession.checkOut) {
    throw new Error("Already checked in");
  }

  record.sessions.push({
    checkIn: new Date(),
    duration: 0
  });

  await record.save();
  return record;
};

/* ================= CHECK OUT ================= */

export const checkOutService = async (user: any) => {
  const date = today();

  const record = await Attendance.findOne({
    userId: user._id,
    date,
    organizationId: user.organizationId
  });

  if (!record) throw new Error("No attendance record found");

  const session = record.sessions[record.sessions.length - 1];

  if (!session) throw new Error("No active session");

  if (session.checkOut)
    throw new Error("Already checked out");

  session.checkOut = new Date();

  const minutes =
    (session.checkOut.getTime() - session.checkIn.getTime()) / 60000;

  session.duration = Math.round(minutes);

  record.totalDuration += session.duration;

  /* ===== STATUS CALC ===== */

  if (record.totalDuration >= 480) {
    record.status = "PRESENT";
  } else if (record.totalDuration >= 240) {
    record.status = "HALF_DAY";
  } else {
    record.status = "ABSENT";
  }

  await record.save();
  return record;
};
