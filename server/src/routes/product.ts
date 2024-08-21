import { Router, Request, Response } from "express";
import { ProductModel } from "../models/product";
import { UserModel } from "../models/user";
import { ProductErrors } from "../errors";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find({});
    res.json({ products });
  } catch (err) {
    res.status(400).json({ err });
  }
});
router.post("/order", async (req: Request, res: Response) => {
  const { customerID, cartItems } = req.body;
  try {
    const user = await UserModel.findById(customerID);
    const productIDs = Object.keys(cartItems);
    const products = await ProductModel.find({ _id: { $in: productIDs } });
    if (products.length !== productIDs.length || productIDs.length === 0) {
      res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
    }
    let totalPrice = 0;
    for (const item in cartItems) {
      if (cartItems[item] <= 0) {
        return res.status(400).json({ type: ProductErrors.INVALID_QUANTITY });
      }
      const product = products.find((p) => String(p._id) === item);
      if (!product) {
        return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
      }
      if (product.stockQuantity < cartItems[item]) {
        return res.status(400).json({ type: ProductErrors.NOT_ENOUGH_STOCK });
      }
      if (product.salePrice) {
        totalPrice += product.salePrice * cartItems[item];
      } else {
        totalPrice += product.regularPrice * cartItems[item];
      }
      if (user) {
        user.purchasedItems.push(...productIDs);
        await user.save();
      }
      await ProductModel.updateMany({ _id: { $in: productIDs } }, { $inc: { stockQuantity: -1 } });
    }

    return res.json({ purchasedItems: [...productIDs], totalPrice: totalPrice });
  } catch (err) {
    return res.status(400).json({ err });
  }
});

export { router as productRouter };
