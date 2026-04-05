import { io } from "../server";
import Zone from "../Models/Zone";
import Branch from "../Models/Branch";
import Attendance from "../Models/Attendance";
import inside from "point-in-polygon";

io.on("connection", async (socket) => {
  const user = (socket as any).user;

  console.log("🟢 Socket connected:", socket.id, user.role);

  /* ================= ROOMS ================= */

  socket.join(`org:${user.organizationId}`);

  if (user.branchId)
    socket.join(`branch:${user.organizationId}:${user.branchId}`);

  if (user.zoneId) socket.join(`zone:${user.organizationId}:${user.zoneId}`);

  /* ================= DISCONNECT HANDLER (IMPORTANT) ================= */

  socket.on("disconnect", () => {
    emitExit();
  });

  const emitExit = () => {
    io.to(`org:${user.organizationId}`).emit("USER_EXIT", {
      userId: user.userId,
    });

    if (user.branchId)
      io.to(`branch:${user.organizationId}:${user.branchId}`).emit(
        "USER_EXIT",
        { userId: user.userId },
      );

    if (user.zoneId)
      io.to(`zone:${user.organizationId}:${user.zoneId}`).emit("USER_EXIT", {
        userId: user.userId,
      });
  };

  /* ================= LOCATION ================= */

  socket.on("LOCATION_UPDATE", async ({ lat, lng }) => {
    if (user.role === "SUPER_ADMIN") return;

    let inAllowedArea = true;

    if (user.role === "USER" || user.role === "ZONE_ADMIN") {
      const zone = await Zone.findOne({
        _id: user.zoneId,
        organizationId: user.organizationId,
        branchId: user.branchId,
      });
      if (!zone) return;

      const poly = zone.vertex.map((v) => [
        Number(v.longitude),
        Number(v.latitude),
      ]);

      inAllowedArea = inside([lng, lat], poly);
    }

    if (user.role === "BRANCH_ADMIN") {
      const branch = await Branch.findOne({
        _id: user.branchId,
        organizationId: user.organizationId,
      });
      if (!branch) return;

      const poly = branch.vertex.map((v) => [
        Number(v.longitude),
        Number(v.latitude),
      ]);

      inAllowedArea = inside([lng, lat], poly);
    }

    const today = new Date().toISOString().split("T")[0];

    let record = await Attendance.findOne({
      userId: user.userId,
      organizationId: user.organizationId,
      date: today,
    });

    const lastSession =
      record && record.sessions.length
        ? record.sessions[record.sessions.length - 1]
        : null;

    /* ===== CHECK IN ===== */

    if (inAllowedArea && (!record || lastSession?.checkOut)) {
      if (!record) {
        record = await Attendance.create({
          organizationId: user.organizationId,
          userId: user.userId,
          branchId: user.branchId,
          zoneId: user.zoneId,
          date: today,
          sessions: [],
          totalDuration: 0,
        });
      }

      const newSession = {
        checkIn: new Date(),
        duration: 0,
      };

      record.sessions.push(newSession);
      await record.save();

      broadcast(lat, lng, true, newSession.checkIn);
      return;
    }

    /* ===== CHECK OUT ===== */

    if (!inAllowedArea) {
      broadcast(lat, lng, false); // 🔥 SEND LOCATION ALSO
      emitExit();
      return;
    }

    /* ===== STILL INSIDE ===== */

    if (inAllowedArea && lastSession && !lastSession.checkOut) {
      broadcast(lat, lng, true, lastSession.checkIn);
    }
  });

  /* ================= BROADCAST ================= */

  const broadcast = (
    lat: number,
    lng: number,
    inZone: boolean,
    entryTime?: Date,
  ) => {
    const payload = {
      userId: user.userId,
      lat,
      lng,
      inZone,
      entryTime,
      name: user.name,
    };

    io.to(`org:${user.organizationId}`).emit("USER_LOCATION", payload);
    console.log(payload);
    if (user.branchId) {
      io.to(`branch:${user.organizationId}:${user.branchId}`).emit(
        "USER_LOCATION",
        payload,
      );

      console.log("🚀 emitting:", payload);
    }

    if (user.zoneId) {
      io.to(`zone:${user.organizationId}:${user.zoneId}`).emit(
        "USER_LOCATION",
        payload,
      );
      console.log("🚀 emitting:", payload);
    }
  };
});
