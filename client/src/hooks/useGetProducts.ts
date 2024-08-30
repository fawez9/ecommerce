import axios from "axios";
import { useEffect, useState } from "react";
import { useGetToken } from "./useGetToken";

export const useGetProducts = () => {
  const [products, setProducts] = useState([]);
  const {headers} = useGetToken()

  const fetchProducts = async () => {
    try{
    const fetchedProducts = await axios.get("http://localhost:3001/product", {headers});
    setProducts(fetchedProducts.data.products);
    }catch(err){
      alert("ERROR: Something went wrong")
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, fetchProducts };
};