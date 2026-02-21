import cron from "node-cron";
import Attendance from "../Models/Attendance";

cron.schedule("*/5 * * * *", async () => {
  const limit = new Date(Date.now() - 12 * 60 * 60 * 1000);

  const records = await Attendance.find({
    "sessions.checkOut": { $exists: false }
  });

  for (const record of records) {
    const session = record.sessions[record.sessions.length - 1];

    if (!session?.checkIn) continue;

    if (session.checkIn < limit) {
      session.checkOut = new Date();
      session.duration =
        (session.checkOut.getTime() - session.checkIn.getTime()) / 60000;

      record.totalDuration += session.duration;
      await record.save();
    }
  }

  console.log("Auto checkout executed");
});
