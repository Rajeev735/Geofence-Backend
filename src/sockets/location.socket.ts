import { io } from "../server";
import Zone from "../Models/Zone";
import Attendance from "../Models/Attendance";
import inside from "point-in-polygon";

io.on("connection", socket => {
  const user = (socket as any).user;
  console.log("🟢 Socket connected:", socket.id);
  socket.on("LOCATION_UPDATE", async ({ lat, lng }) => {
    if (!user.zoneId) return;
   console.log("u",user)
    const zone = await Zone.findOne({
      _id: user.zoneId,
      organizationId: user.organizationId
    });

    if (!zone) return;

    const polygon: [number, number][] = zone.vertex.map(
      (v: any) => [Number(v.longitude), Number(v.latitude)]
    );

    const inZone = inside(
      [Number(lng), Number(lat)],
      polygon
    );

    const today = new Date().toISOString().split("T")[0];

    let record = await Attendance.findOne({
      userId: user.userId,
      date: today,
      organizationId: user.organizationId
    });

    const lastSession = record?.sessions[record.sessions.length - 1];

    /* ===== AUTO CHECK IN ===== */
    if (inZone && (!record || lastSession?.checkOut)) {
      if (!record) {
        record = await Attendance.create({
          organizationId: user.organizationId,
          userId: user.userId,
          branchId: user.branchId,
          zoneId: user.zoneId,
          date: today,
          sessions: [],
          totalDuration: 0
        });
      }

      record.sessions.push({
        checkIn: new Date(),
        duration: 0
      });

      await record.save();
      socket.emit("STATUS", "CHECKED_IN");
    }

    /* ===== AUTO CHECK OUT ===== */
    if (!inZone && record && lastSession && !lastSession.checkOut) {
      lastSession.checkOut = new Date();

      const mins =
        (lastSession.checkOut.getTime() - lastSession.checkIn.getTime()) / 60000;

      lastSession.duration = Math.round(mins);
      record.totalDuration += lastSession.duration;

      await record.save();
      socket.emit("STATUS", "CHECKED_OUT");
    }
    console.log("Broadcasting location:", user.userId, lat, lng, inZone);
    socket.broadcast.emit("USER_LOCATION", {
  userId: user.userId,
  lat,
  lng,
  inZone
});
  });
});