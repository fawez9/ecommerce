import { Schema, model } from "mongoose";

export interface IOrder {
  _id?: string;
  userId: string;
  productId: string;
  quantity: number;
  total: number;
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.String, ref: "users", required: true },
  productId: { type: Schema.Types.String, ref: "products", required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
});

export const OrderModel = model<IOrder>("orders", OrderSchema);
