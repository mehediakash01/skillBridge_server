import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

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
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "you are not authorized",
        });
      }
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!dbUser) {
        return res.status(401).json({
          success: false,
          message: "user not found",
        });
      }

      const isEmailVerified = Boolean(dbUser.emailVerified || session.user.emailVerified);

      if (!isEmailVerified) {
        return res.status(403).json({
          success: false,
          message: "email verification required. Please verify your email",
        });
      }

      const userRole = (dbUser.role || "STUDENT").toUpperCase();

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: userRole as string,
        emailVerified: isEmailVerified,
      };

      // Check role permissions if roles are specified
      if (roles.length > 0 && !roles.includes(userRole as UserRole)) {
        return res.status(403).json({
          success: false,
          message: "forbidden! you don't have permissions to access this resource",
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};


export default sessionAuth;