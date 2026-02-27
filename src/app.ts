import express from "express";
import cors from "cors";

import orgRoutes from "./routes/org.routes";
import branchRoutes from "./routes/branch.routes";
import zoneRoutes from "./routes/zone.Routes";
import geoRoutes from "./routes/geo.Routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import attendanceRoutes from "./routes/attendance.Routes";
import profileRoutes from "./routes/profile.routes";
import statusRoutes from "./routes/status.Routes";

const app = express();

app.use(cors());
app.use(express.json());



/* Routes */
app.use("/api/orgs", orgRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/geo", geoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/status",statusRoutes)

export default app;