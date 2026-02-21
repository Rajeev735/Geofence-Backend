import { io } from "../server";
import jwt from "jsonwebtoken";

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
console.log("AUTH MIDDLEWARE RUNNING");
  if (!token) return next(new Error("Unauthorized"));
  console.log("Token:", socket.handshake.auth);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (socket as any).user = decoded;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});