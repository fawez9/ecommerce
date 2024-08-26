import { Schema, model } from "mongoose";

export interface IUser {
  _id?: string;
  fullName: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  isAdmin: boolean;
  purchasedItems: string[];
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String },
  isAdmin: { type: Boolean, default: false },
  purchasedItems: [{ type: Schema.Types.ObjectId, ref: "products", default: [] }],
});

export const UserModel = model<IUser>("users", UserSchema);
