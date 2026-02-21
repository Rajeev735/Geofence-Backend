import { Request, Response } from "express";
import Zone from "../Models/Zone";

import { checkInService,checkOutService,isInsidePolygon } from "../services/attendence.service";

/* ================= CHECK IN ================= */

export const checkIn = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.body;
    const user = req.user as any;

    if (!user.zoneId)
      return res
        .status(400)
        .json({ message: "User not assigned to zone" });

    const zone = await Zone.findOne({
      _id: user.zoneId,
      organizationId: user.organizationId
    });

    if (!zone)
      return res.status(404).json({ message: "Zone not found" });

    const polygon: [number, number][] = zone.vertex.map(
      (v: any): [number, number] => [Number(v.longitude), Number(v.latitude)]
    );

    const inside = isInsidePolygon([lng, lat], polygon);

    if (!inside)
      return res
        .status(403)
        .json({ message: "Outside geofence" });

    const attendance = await checkInService(user);

    res.json({
      success: true,
      attendance
    });

  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

/* ================= CHECK OUT ================= */

export const checkOut = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    const attendance = await checkOutService(user);

    res.json({
      success: true,
      attendance
    });

  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};
