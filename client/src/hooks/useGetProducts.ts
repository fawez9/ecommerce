import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useGetToken } from "./useGetToken";
import { IProduct } from "../models/interfaces";

interface UseGetProductsReturn {
  products: IProduct[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => void;
}

export const useGetProducts = (): UseGetProductsReturn => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { headers } = useGetToken();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3001/product", { headers });
      setProducts(response.data.products || []);
    } catch (err) {
      setError("ERROR: Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [headers.Authorization]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, fetchProducts };
};
