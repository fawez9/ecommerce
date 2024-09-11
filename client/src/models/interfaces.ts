export interface IProduct {
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
