import { Router, Request, Response } from "express";
import { IUser, UserModel } from "../models/user";
import { UserErrors } from "../errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyToken } from "../middlewares/user";
import { ProductModel } from "../models/product";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { fullName, password, email, phone, address } = req.body;
  try {
    //check if user exists

    const Username = await UserModel.findOne({ fullName });
    const Email = await UserModel.findOne({ email });
    const Phone = await UserModel.findOne({ phone });
    if (Username) {
      return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
    } else if (Email) {
      return res.status(400).json({ type: UserErrors.EMAIL_TAKEN });
    } else if (Phone) {
      return res.status(400).json({ type: UserErrors.PHONE_TAKEN });
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

router.get("/profile/:userID", verifyToken, async (req: Request, res: Response) => {
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

router.put("/profile/:userID", verifyToken, async (req: Request, res: Response) => {
  const { userID } = req.params;
  const { fullName, email, phone, address, currentPassword, newPassword } = req.body;

  try {
    const user = await UserModel.findById(userID);
    if (!user) return res.status(404).json({ type: UserErrors.NO_USER_FOUND });

    // Check for password update
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });

      user.password = await bcrypt.hash(newPassword, 12); // Hash new password
    }

    // Update other user fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();
    res.json({ message: "User Updated Successfully" });
  } catch (err) {
    res.status(500).json({ type: err.message });
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

router.get("/purchased-items/:userID", async (req: Request, res: Response) => {
  const { userID } = req.params;
  try {
    const user = await UserModel.findById(userID);
    if (!user) {
      return res.status(404).json({ type: UserErrors.NO_USER_FOUND });
    }

    const purchasedItems = user.purchasedItems;
    const products = await Promise.all(
      purchasedItems.map(async (itemId) => {
        const product = await ProductModel.findById(itemId);
        return product;
      })
    );
    res.json({ products });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});
export { router as userRouter };
