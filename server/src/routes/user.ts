import { Router, Request, Response } from "express";
import { IUser, UserModel } from "../models/user";
import { UserErrors } from "../errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyToken } from "../middlewares/user";
const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { fullName, password, email, phone, address } = req.body;
  try {
    //check if user exists
    const user = await UserModel.findOne({ fullName, email, phone });
    if (!user) {
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
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
    res.json({ token, userID: user._id });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

router.get("/profile", verifyToken, async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const user = await UserModel.findById(id);
    res.json({ user });
  } catch (err) {
    res.status(400).json({ err });
  }
});
router.put("/profile", verifyToken, async (req: Request, res: Response) => {
  const { id } = req.body;
  const { fullName, password, email, phone, address } = req.body;
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }
    if (fullName) {
      user.fullName = fullName;
    }
    if (password) {
      user.password = password;
    }
    if (email) {
      user.email = email;
    }
    if (phone) {
      user.phone = phone;
    }
    if (address) {
      user.address = address;
    }
    await user.save();
    res.json({ message: "User Updated Successfully" });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});
router.delete("/profile", verifyToken, async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const user = await UserModel.findByIdAndDelete(id);
    res.json({ message: "User Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});
export { router as userRouter };
