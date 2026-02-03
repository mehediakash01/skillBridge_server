import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth.js";

export enum UserRole {
    STUDENT="STUDENT",
    ADMIN="ADMIN",
    TUTOR="TUTOR"
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}
const sessionAuth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
 try{
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });
  
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "you are not authorized",
      });
    }
    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "email verification required. Please verify your email",
      });
    }
    req.user={
        id:session.user.id,
        email:session.user.email,
        name:session.user.name,
        role:session.user.role as string,
        emailVerified:session.user.emailVerified


    }
    if (roles.length&& !roles.includes(req.user.role as UserRole))
         return res.status(403).json({
        success: false,
        message: "forbidden! you don't have permissions to access this resources",
      });
      next()
     
 }
 catch(err){
    next(err)

 }
  }
};


export default sessionAuth;