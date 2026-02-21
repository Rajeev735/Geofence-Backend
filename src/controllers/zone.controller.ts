import { Request, Response } from "express";
import * as ZoneService from "../services/zone.service";

/* ================= CREATE ZONE ================= */

export const createZoneController = async (req: any, res: Response) => {
  try {
    const zone = await ZoneService.createZone(req.user, req.body);

    res.status(201).json({
      success: true,
      zone
    });

  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


/* ================= UPDATE ZONE ================= */

export const updateZoneController = async (req: any, res: Response) => {
  try {
    const zoneId = req.params.zoneId;

    const zone = await ZoneService.updateZone(
      req.user,
      zoneId,
      req.body
    );

    res.json({
      success: true,
      zone
    });

  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


/* ================= GET ZONES BY ROLE ================= */

export const getZonesController = async (req: any, res: Response) => {
  try {
    const zones = await ZoneService.getZonesByScope(req.user);

    res.json({
      success: true,
      zones
    });

  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
