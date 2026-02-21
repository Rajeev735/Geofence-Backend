import { Request, Response } from "express";
import * as UserService from "../services/user.service";

/* =========================================
   CREATE USER BY ROLE (ASSIGNMENT)
========================================= */

export const createUser = async (req: any, res: Response) => {
  try {
    const creator = req.user;   // from auth middleware
    const payload = req.body;
    console.log("cpayload",payload)
    const user = await UserService.createUserByRole(creator, payload);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


/* =========================================
   GET USERS BASED ON ROLE SCOPE
========================================= */

export const getUsersUnderMe = async (req: any, res: Response) => {
  try {
    const { role, organizationId, branchId, zoneId } = req.user;

    let filter: any = { organizationId };

    if (role === "BRANCH_ADMIN") {
      filter.branchId = branchId;
    }

    if (role === "ZONE_ADMIN") {
      filter.zoneId = zoneId;
    }

    const users = await UserService.getUsers(filter);

    res.json({
      success: true,
      count: users.length,
      users
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
