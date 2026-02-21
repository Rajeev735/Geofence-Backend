import { Request, Response } from "express";
import * as OrgService from "../services/org.service";

export const createOrganizationController = async (req: Request, res: Response) => {
  try {
    const org = await OrgService.createOrganization(req.body);
    res.status(201).json({ success: true, org });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
