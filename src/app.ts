import express from "express";
import cors from "cors";

import orgRoutes from "./routes/org.routes";
import branchRoutes from "./routes/branch.routes";
import zoneRoutes from "./routes/zoneRoutes";
import geoRoutes from "./routes/geo.Routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routhes";
import attendanceRoutes from "./routes/attendance.Routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/orgs", orgRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/geo", geoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("api/attendance",attendanceRoutes)

export default app;
