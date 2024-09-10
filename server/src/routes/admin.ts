import { Router, Request, Response } from "express";
import { verifyToken, verifyAdmin } from "../middlewares/user";
import { UserModel } from "../models/user";
import { UserErrors } from "../errors";
import { ProductModel } from "../models/product";

const router = Router();

// Admin route example
router.get("/users", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
  try {
    // Example admin functionality: get all users
    const users = await UserModel.find({});
    res.json({ users });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

router.get("/users/:userID", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
  const { userID } = req.params;
  try {
    const user = await UserModel.findById(userID);
    if (!user) {
      return res.status(404).json({ type: UserErrors.NO_USER_FOUND });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

router.get("/products", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find({});
    res.json({ products });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

export { router as adminRouter };
