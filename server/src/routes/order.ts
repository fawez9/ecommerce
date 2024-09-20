import { Router, Request, Response } from "express";
import { verifyToken, verifyAdmin } from "../middlewares/user";
import { OrderModel } from "../models/order";
import { ProductErrors, UserErrors } from "../errors";
import { UserModel } from "../models/user";
import { ProductModel } from "../models/product";

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
  const { fullName, email, phone, address, items, total, userID } = req.body;

  if (!fullName || !email || !phone || !address || !items || !total) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const orderData: {
      fullName: string;
      email: string;
      phone: string;
      address: string;
      items: any[];
      total: number;
      userId?: string;
    } = {
      fullName,
      email,
      phone,
      address,
      items,
      total,
    };

    if (userID) {
      orderData.userId = userID; // Only add userId if it exists
    }

    const order = new OrderModel(orderData);
    await order.save();

    if (userID) {
      await UserModel.findByIdAndUpdate(userID, { $push: { orders: order._id } });
    }

    res.json({ message: "Order Added Successfully", order });
  } catch (err) {
    console.error(err);
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

//order product
router.post("/confirm", async (req: Request, res: Response) => {
  const { userID, products, orderID } = req.body;

  try {
    // Find the order
    const order = await OrderModel.findById(orderID);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update product quantities
    for (const product of products) {
      const { productId, quantity } = product;
      const dbProduct = await ProductModel.findById(productId);
      if (!dbProduct) {
        return res.status(404).json({ error: `Product ${productId} not found` });
      }
      if (dbProduct.stockQuantity < quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ${productId}` });
      }
      dbProduct.stockQuantity -= quantity;
      await dbProduct.save();
    }

    // Update order status
    order.status = "confirmed";
    await order.save();

    // Update user's order history if userID is provided
    if (userID) {
      await UserModel.findByIdAndUpdate(userID, { $push: { orders: orderID } });
    }

    res.json({ message: "Order confirmed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while confirming the order" });
  }
});

export { router as orderRouter };
