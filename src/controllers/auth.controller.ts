import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

/* =========================================
   REGISTER ORGANIZATION + SUPER ADMIN
========================================= */

export const registerOrganization = async (req:Request, res:Response) => {
  try {
    const data = await AuthService.registerOrgWithSuperAdmin(req.body);

    res.status(201).json({
      success: true,
      organization: data.organization,
      superAdmin: data.superAdmin
    });

  } catch (err:any) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/* =========================================
   REGISTER PERSONAL USER
========================================= */

export const registerPersonal = async (req:Request, res:Response) => {
  try {
    const user = await AuthService.registerPersonalUser(req.body);

    res.status(201).json({
      success: true,
      user
    });

  } catch (err:any) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/* =========================================
   LOGIN
========================================= */

export const login = async (req:Request, res:Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role required"
      });
    }

    const data = await AuthService.login(email, password, role);

    res.status(200).json({
      success: true,
      token: data.token,
      user: data.user
    });

  } catch (err:any) {
    res.status(401).json({
      success: false,
      message: err.message
    });
  }
};