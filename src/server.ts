import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";
import { loadCountryGeoJSON } from "./utils/geojson";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 7000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","https://geofence-frontend-fawn.vercel.app/" ],// better than "*"
    methods: ["GET", "POST"]
  }
});
import "./sockets/index"
import "./sockets/location.socket"

const startServer = async () => {
  await connectDB();
  await loadCountryGeoJSON();

  server.listen(PORT, () => {
    console.log("🚀 Server running on port", PORT);
  });
};

startServer();