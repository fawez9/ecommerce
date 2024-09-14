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
router.post("/", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
  const { fullName, productId, quantity, total } = req.body;
  try {
    const order = new OrderModel({
      productId,
      quantity,
      total,
    });
    await order.save();
    res.json({ message: "Order Added Successfully" });
  } catch (err) {
    res.status(500).json({ type: err });
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
