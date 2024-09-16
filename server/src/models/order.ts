import { Schema, model } from "mongoose";

// Embedded OrderItem Schema
const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to Product
    quantity: { type: Number, required: true },
  },
  { _id: false }
); // Disable auto _id for embedded documents

// Order Model Interface
export interface IOrder {
  _id?: Schema.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  items: (typeof OrderItemSchema)[];
  total: number;
  createdAt?: Date;
}

// Order Schema
const OrderSchema = new Schema<IOrder>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  items: [OrderItemSchema], // Embedded OrderItem schema
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Order Model
export const OrderModel = model<IOrder>("Order", OrderSchema);
