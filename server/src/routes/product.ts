import { Router, Request, Response } from "express";
import { ProductModel } from "../models/product";
import { ProductErrors } from "../errors";
import { verifyAdmin, verifyToken } from "../middlewares/user";
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

router.post("/", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
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

router.put("/:id", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
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
    if (salePrice >= 0) {
      product.salePrice = salePrice;
    }
    if (stockQuantity >= 0) {
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

router.delete("/:id", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
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
