import { Router, Request, Response, NextFunction } from "express";
import { IUser, UserModel } from "../models/user";
import { UserErrors } from "../errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { fullName, password, email, phone, address } = req.body;
  try {
    //check if user exists
    const user = await UserModel.findOne({ fullName, email, phone });
    if (user) {
      return res.status(400).json({ type: UserErrors.FULLNAME_TAKEN });
    }
    //password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    //create new user
    const newUser = new UserModel({
      fullName,
      password: hashedPassword,
      email,
      phone,
      address,
    });
    await newUser.save();
    res.json({ message: "User Registered Successfully" });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { fullName, password } = req.body;
  try {
    const user: IUser = await UserModel.findOne({ fullName });
    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, userID: user._id });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  }
  return res.sendStatus(401);
};

export { router as userRouter };
