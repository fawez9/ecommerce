import { Router, Request, Response } from "express";
import { ProductModel } from "../models/product";
import { UserModel } from "../models/user";
import { ProductErrors } from "../errors";
import { verifyAdmin } from "../middlewares/user";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find({});
    res.json({ products });
  } catch (err) {
    res.status(400).json({ err });
  }
});
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById(id);
    res.json({ product });
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.post("/", verifyAdmin, async (req: Request, res: Response) => {
  const { productName, regularPrice, salePrice, stockQuantity, img1, img2, img3, description } = req.body;
  try {
    const product = new ProductModel({
      productName,
      regularPrice,
      salePrice,
      stockQuantity,
      img1,
      img2,
      img3,
      description,
    });
    await product.save();
    res.json({ message: "Product Added Successfully" });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

//order product
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
    //TODO: billing
    return res.json({ purchasedItems: [...productIDs], totalPrice: totalPrice });
  } catch (err) {
    return res.status(400).json({ err });
  }
});

router.put("/:id", verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productName, regularPrice, salePrice, stockQuantity, img1, img2, img3, description } = req.body;
  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
    }
    if (productName) {
      product.productName = productName;
    }
    if (regularPrice) {
      product.regularPrice = regularPrice;
    }
    if (salePrice) {
      product.salePrice = salePrice;
    }
    if (stockQuantity) {
      product.stockQuantity = stockQuantity;
    }
    if (img1) {
      product.img1 = img1;
    }
    if (img2) {
      product.img2 = img2;
    }
    if (img3) {
      product.img3 = img3;
    }
    if (description) {
      product.description = description;
    }
    await product.save();
    res.json({ product });
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.delete("/:id", verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
    }
    res.json({ product });
  } catch (err) {
    res.status(400).json({ err });
  }
});

export { router as productRouter };
