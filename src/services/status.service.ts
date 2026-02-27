import Attendance from "../Models/Attendance";

/* ================= LIVE STATUS ================= */
interface PopulatedAttendance {
  userId: {
    _id: string;
    name: string;
  };
  zoneId: {
    _id: string;
    zoneName: string;
  };
  sessions: any[];
  status: string;
}
export const getStatusData = async (user: any) => {

  let filter: any = {
    organizationId: user.organizationId
  };

  if (user.role === "BRANCH_ADMIN") {
    filter.branchId = user.branchId;
  }

  if (user.role === "ZONE_ADMIN" || user.role === "USER") {
    filter.zoneId = user.zoneId;
  }

  /* ================= TODAY ONLY ================= */

  const date = new Date().toLocaleDateString("en-CA");

  filter.date = date;

  const records = await Attendance.find(filter)
    .populate("userId", "name")
    .populate("zoneId", "zoneName") as unknown as PopulatedAttendance[];;

  /* ================= FORMAT ================= */

  const users = records.map(r => {
    const lastSession = r.sessions[r.sessions.length - 1];

    const inside = lastSession && !lastSession.checkOut;

    return {
      name: r.userId.name,
      zone: r.zoneId.zoneName ,
      inside,
      lastUpdate: lastSession?.checkOut || lastSession?.checkIn
    };
  });

  const insideCount = users.filter(u => u.inside).length;
  const outsideCount = users.length - insideCount;

  return {
    summary: {
      inside: insideCount,
      outside: outsideCount,
      checkedIn: insideCount,
      alerts: outsideCount
    },
    users,
    alerts:
      outsideCount
        ? ["Some users are outside their zone"]
        : []
  };
};