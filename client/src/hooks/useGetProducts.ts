import axios from "axios";
import { useEffect, useState } from "react";
import { useGetToken } from "./useGetToken";

interface Product {
  _id: string;
  productName: string;
  regularPrice: number;
  salePrice?: number;
  stockQuantity: number;
  img1: string;
  img2: string;
  img3?: string;
  description: string;
}

interface UseGetProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => void;
}

export const useGetProducts = (): UseGetProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { headers } = useGetToken();

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/product", { headers });
      setProducts(response.data.products);
    } catch (err) {
      setError("ERROR: Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [headers.authorization]);

  return { products, isLoading, error, fetchProducts };
};
