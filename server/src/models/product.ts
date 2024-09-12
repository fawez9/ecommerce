import { Schema, model } from "mongoose";

export interface IProduct {
  productName: string;
  regularPrice: GLfloat;
  salePrice?: GLfloat;
  stockQuantity: number;
  img1: string;
  img2: string;
  img3?: string;
  description: string;
}

const ProductSchema = new Schema<IProduct>({
  productName: { type: String, required: true },
  regularPrice: { type: Number, required: true, min: [1, "Price must be greater than 0"] },
  salePrice: { type: Number, min: [0, "Sale price must be greater than or equal to 0 also less than regular price"] },
  stockQuantity: { type: Number, required: true, min: [0, "Stock quantity must be greater than or equal to 0"] },
  img1: { type: String, required: true },
  img2: { type: String, required: true },
  img3: { type: String },
  description: { type: String, required: true },
});

export const ProductModel = model<IProduct>("products", ProductSchema);
