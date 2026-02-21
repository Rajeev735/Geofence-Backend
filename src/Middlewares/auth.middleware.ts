import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const protect = (req:any,res:Response,next:NextFunction)=>{
  const token = req.headers.authorization?.split(" ")[1];
  if(!token) return res.status(401).json({message:"No token"});

  try{
    req.user = jwt.verify(token, process.env.JWT_SECRET!);
    next();
  }catch{
    res.status(401).json({message:"Invalid token"});
  }
};

export const allowRoles = (...roles:string[]) => {
  return (req:any,res:Response,next:NextFunction)=>{
    if(!roles.includes(req.user.role))
      return res.status(403).json({message:"Forbidden"});
    next();
  };
};
