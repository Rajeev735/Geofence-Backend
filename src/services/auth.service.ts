import User from "../Models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Organization from "../Models/Organization";

/* =========================================
   REGISTER FIRST SUPER ADMIN (ONE TIME)
========================================= */


export const registerOrgWithSuperAdmin = async (payload: any) => {

  const existing = await User.findOne({ email: payload.email });
  if (existing) throw new Error("Email already registered");

  // create organization
  const org = await Organization.create({
    org: payload.orgName,
    country: payload.country,
    state: payload.state,
    email: payload.email
  });

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // create super admin
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    role: "SUPER_ADMIN",
    organizationId: org._id
  });

  return { organization: org, superAdmin: user };
};
/* =========================================
   LOGIN (ROLE-BOUND)
========================================= */

export const login = async (
  email:string,
  password:string,
  role:string
) => {

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  if (user.role !== role)
    throw new Error("Not authorized for this role");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { 
      name:user.name,
      userId: user._id,
      role: user.role,
      organizationId: user.organizationId || null,
      branchId: user.branchId || null,
      zoneId: user.zoneId || null
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
      role: user.role,
      mode: user.organizationId ? "ORG" : "PERSONAL"
    }
  };
};
export const registerPersonalUser = async (payload:any) => {

  const exists = await User.findOne({ email: payload.email });
  if (exists) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    role: "USER",
    organizationId: null,   // 👈 personal mode
    branchId: null,
    zoneId: null
  });

  return user;
};