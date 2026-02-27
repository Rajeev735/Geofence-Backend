import { Request, Response } from "express";
import { getStatusData } from "../services/status.service";

export const getMyStatus = async (req: Request, res: Response) => {
  try {
    const data = await getStatusData(req.user);

    res.json({
      success: true,
      ...data
    });

  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};