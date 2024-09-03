import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_SECRET, (err, user: JwtPayload) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_SECRET, (err, user: JwtPayload) => {
      if (err) {
        return res.sendStatus(403);
      }
      if (user && typeof user === "object" && "isAdmin" in user && user.isAdmin) {
        next();
      } else {
        return res.sendStatus(403);
      }
    });
  } else {
    return res.sendStatus(401);
  }
};
