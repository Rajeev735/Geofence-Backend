import { Request, Response } from "express";
import {
  getMyProfileService,
  updateMyProfileService
} from "../services/profile.service";

export const getMyProfile = async (req: any, res: Response) => {
  try {
    const profile = await getMyProfileService(req.user.userId);

    if (!profile)
      return res.status(404).json({ message: "User not found" });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
};

export const updateMyProfile = async (req: any, res: Response) => {
  try {
    const allowedFields = ["name", "email", "password"];

    const updates: any = {};
    allowedFields.forEach(field => {
      if (req.body[field]) updates[field] = req.body[field];
    });

    const profile = await updateMyProfileService(
      req.user.id,
      updates
    );

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
};