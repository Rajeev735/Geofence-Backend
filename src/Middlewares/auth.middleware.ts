import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

export const protect: RequestHandler = (req: AuthRequest, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = auth.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= ROLE CHECK ================= */

export const allowRoles = (...roles: string[]): RequestHandler => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
};

/* ================= ORG MODE ONLY ================= */

export const requireOrg: RequestHandler = (req: any, res, next) => {
  if (!req.user?.organizationId) {
    res.status(403).json({ message: "Organization account required" });
    return;
  }
  next();
};