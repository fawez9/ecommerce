interface IProduct {
  _id: string; // Make this required to avoid undefined errors
  productName: string;
  regularPrice: number; // Changed to number
  salePrice?: number; // Changed to number
  stockQuantity: number;
  img1: string;
  img2: string;
  img3?: string;
  description: string;
}

interface IUser {
  _id: string; // Make this required
  fullName: string;
  password: string;
  imgURL?: string;
  email: string;
  phone: string;
  address: string;
  isAdmin: boolean;
  orders: string[];
}

interface IOrderItem {
  productId: string; // ID of the product
  quantity: number; // Quantity of this product in the order
}

interface IOrder {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  items: IOrderItem[]; // List of items in the order
  total: number;
  status: string;
  createdAt: string; // Order creation date
}

interface IFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  items?: IOrderItem[]; // Items should reference IOrderItem
  total?: number;
  userID?: string; // Make userID optional
}

export type { IProduct, IUser, IOrder, IOrderItem, IFormData };
