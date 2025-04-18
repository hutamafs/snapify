import type { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/index.js";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const payload = verifyJwt(token) as Request["user"];
    req.user = payload;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid or expired token" });
    return;
  }
};
