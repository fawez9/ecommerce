interface IProduct {
  _id?: string;
  productName: string;
  regularPrice: GLfloat;
  salePrice?: GLfloat;
  stockQuantity: number;
  img1: string;
  img2: string;
  img3?: string;
  description: string;
}

interface IUser {
  _id?: string;
  fullName: string;
  password: string;
  imgURL?: string;
  email: string;
  phone: string;
  address: string;
  isAdmin: boolean;
  purchasedItems: string[];
}

interface IOrderItem {
  productId: string;
  quantity: number;
}

interface IOrder {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  items: IOrderItem[];
  total: number;
  createdAt: string; // Added to show order creation date
}

export type { IProduct, IUser, IOrder, IOrderItem };
