import { Router, Request, Response } from "express";
import { verifyToken, verifyAdmin } from "../middlewares/user";
import { OrderModel } from "../models/order";
import { UserErrors } from "../errors";

const router = Router();

router.get("/", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find({});
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

router.get("/:id", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await OrderModel.findById(id);
    res.json({ order });
  } catch (err) {
    res.status(400).json({ err });
  }
});

//order product ----> TODO

router.post("/", async (req: Request, res: Response) => {
  const { fullName, email, phone, address, items, total } = req.body;

  // Validation (basic example, you might want to add more comprehensive validation)
  if (!fullName || !email || !phone || !address || !items || !total) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Create and save the order
    const order = new OrderModel({
      fullName,
      email,
      phone,
      address,
      items, // Items will be embedded directly
      total,
    });
    await order.save();

    res.json({ message: "Order Added Successfully", order });
  } catch (err) {
    console.error(err); // Better error logging
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await OrderModel.findByIdAndDelete(id);
    res.json({ message: "Order Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

router.put("/:id", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await OrderModel.findByIdAndUpdate(id, { status });
    res.json({ message: "Order Status Updated Successfully" });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

export { router as orderRouter };
