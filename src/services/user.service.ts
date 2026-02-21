import User from "../Models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ================= CREATE USERS BY ROLE ================= */

export const createUserByRole = async (creator: any, payload: any) => {

  const exists = await User.findOne({ email: payload.email });
  if (exists) throw new Error("Email already registered");
  console.log("payload",payload)
  /* ========= BRANCH ADMIN UNIQUE ========= */
  if (payload.role === "BRANCH_ADMIN") {
    const existingBranchAdmin = await User.findOne({
      role: "BRANCH_ADMIN",
      branchId: payload.branchId,
      organizationId: creator.organizationId
    });

    if (existingBranchAdmin)
      throw new Error("Branch already has an admin");
  }

  /* ========= ZONE ADMIN UNIQUE ========= */
  if (payload.role === "ZONE_ADMIN") {
    const existingZoneAdmin = await User.findOne({
      role: "ZONE_ADMIN",
      zoneId: payload.zoneId,
      organizationId: creator.organizationId
    });

    if (existingZoneAdmin)
      throw new Error("Zone already has an admin");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  /* ========= ROLE CREATION ========= */

  if (payload.role === "BRANCH_ADMIN") {
    return User.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: "BRANCH_ADMIN",
      organizationId: creator.organizationId,
      branchId: payload.branchId
    });
  }

  if (payload.role === "ZONE_ADMIN") {
    return User.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: "ZONE_ADMIN",
      organizationId: creator.organizationId,
      branchId: creator.branchId || payload.branchId,
      zoneId: payload.zoneId
    });
  }

  if (payload.role === "USER") {
    return User.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: "USER",
      organizationId: creator.organizationId,
      branchId: creator.branchId || payload.branchId,
      zoneId: payload.zoneId
    });
  }

  throw new Error("Invalid role assignment");
};

/* ================= LOGIN ================= */

export const loginUser = async (
  email: string,
  password: string,
  role: string
) => {

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  if (user.role !== role)
    throw new Error("Not authorized for this role");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      organizationId: user.organizationId,
      branchId: user.branchId,
      zoneId: user.zoneId
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

/* ================= GET USERS ================= */

export const getUsers = async (filter: any) => {
  return User.find(filter).select("-password");
};
