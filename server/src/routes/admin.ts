import { Router, Request, Response } from "express";
import { verifyToken, verifyAdmin } from "../middlewares/user";
import { UserModel } from "../models/user";

const router = Router();

// Admin route example
router.get("/data", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
  try {
    // Example admin functionality: get all users
    const users = await UserModel.find({});
    res.json({ users });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

export { router as adminRouter };
