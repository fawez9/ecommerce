import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Ensure the request has a token in the Authorization header
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    jwt.verify(token, process.env.JWT_SECRET!, (err, user: JwtPayload) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user; // Attach user to request object
      next();
    });
  } else {
    return res.sendStatus(401); // Unauthorized
  }
};

// Verify that the user has admin privileges
export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    jwt.verify(token, process.env.JWT_SECRET!, (err, user: JwtPayload) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      // Check if the user object contains an isAdmin property and it's true
      if (user && typeof user === "object" && "isAdmin" in user && user.isAdmin) {
        next();
      } else {
        return res.sendStatus(403); // Forbidden
      }
    });
  } else {
    return res.sendStatus(401); // Unauthorized
  }
};
