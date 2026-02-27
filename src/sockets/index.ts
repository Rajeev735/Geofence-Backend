import { io } from "../server";
import jwt from "jsonwebtoken";

io.use((socket, next) => {
  console.log("🔐 SOCKET AUTH MIDDLEWARE");

  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers?.authorization?.split(" ")[1];

  if (!token) {
    return next(new Error("Unauthorized: token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    (socket as any).user = decoded; // contains _id, role, org, branch, zone

    next();
  } catch (err) {
    console.error("JWT error:", err);
    next(new Error("Unauthorized: invalid token"));
  }
});