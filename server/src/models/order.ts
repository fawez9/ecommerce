import { Schema, model } from "mongoose";

// Embedded OrderItem Schema
const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false } // Disable auto _id for embedded documents
);

// Order Item Interface
export interface IOrderItem {
  productId: Schema.Types.ObjectId;
  quantity: number;
}

// Order Model Interface
export interface IOrder {
  _id?: Schema.Types.ObjectId;
  userId?: Schema.Types.ObjectId; // Optional userId for registered users
  fullName: string;
  email: string;
  phone: string;
  address: string;
  items: IOrderItem[];
  total: number;
  status: string; // Added status field
  createdAt?: Date;
  updatedAt?: Date; // Optional, if using timestamps
}

// Order Schema
const OrderSchema = new Schema<IOrder>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    userId: { type: Schema.Types.ObjectId, ref: "users", required: false }, // Optional field for user ID
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    items: [OrderItemSchema], // Embedded OrderItem schema
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmed", "in progress", "declined"],
      default: "in progress",
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);

// Order Model
export const OrderModel = model<IOrder>("orders", OrderSchema);
