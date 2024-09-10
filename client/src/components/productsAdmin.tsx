import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useGetToken } from "../hooks/useGetToken";
import "./styles/style-productAdmin.css";

interface Product {
  _id?: string;
  productName: string;
  regularPrice: number;
  salePrice?: number;
  stockQuantity: number;
  img1: string;
  img2: string;
  img3?: string;
  description: string;
}

interface ProductFormData extends Omit<Product, "regularPrice" | "salePrice" | "stockQuantity"> {
  regularPrice: string;
  salePrice?: string;
  stockQuantity: string;
}

const defaultFormValues: ProductFormData = {
  productName: "",
  regularPrice: "",
  salePrice: "",
  stockQuantity: "",
  img1: "",
  img2: "",
  img3: "",
  description: "",
};

export const ProductsAdmin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { headers } = useGetToken();
  const { register, handleSubmit, reset, setValue } = useForm<ProductFormData>({
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/product", { headers });
        setProducts(response.data.products || []);
      } catch (err) {
        setError("Error fetching products");
      }
    };

    fetchProducts();
  }, [headers.Authorization]);

  const updateProductList = async () => {
    try {
      const response = await axios.get("http://localhost:3001/product", { headers });
      setProducts(response.data.products || []);
    } catch (err) {
      setError("Error fetching products");
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const productData: Product = {
        ...data,
        regularPrice: parseFloat(data.regularPrice),
        stockQuantity: parseInt(data.stockQuantity, 10),
        salePrice: data.salePrice ? parseFloat(data.salePrice) : undefined,
      };

      if (editProductId) {
        await axios.put(`http://localhost:3001/product/${editProductId}`, productData, { headers });
      } else {
        await axios.post("http://localhost:3001/product", productData, { headers });
      }
      clearForm();
      updateProductList();
    } catch (err) {
      setError("Error saving product");
    }
  };

  const handleEdit = (product: Product) => {
    setEditProductId(product._id || "");
    Object.entries(product).forEach(([key, value]) => {
      if (key === "regularPrice" || key === "salePrice" || key === "stockQuantity") {
        setValue(key, value?.toString() ?? "");
      } else {
        setValue(key as keyof ProductFormData, value);
      }
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/product/${id}`, { headers });
      updateProductList();
    } catch (err) {
      setError("Error deleting product");
    }
  };

  const clearForm = () => {
    reset(defaultFormValues);
    setEditProductId(null);
  };

  return (
    <div className="products-admin">
      <form className="product-form" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("productName")} placeholder="Product Name" required />
        <input {...register("regularPrice")} type="number" step="0.01" placeholder="Regular Price" required />
        <input {...register("salePrice")} type="number" step="0.01" placeholder="Sale Price (optional)" />
        <input {...register("stockQuantity")} type="number" placeholder="Stock Quantity" required />
        <input {...register("img1")} placeholder="Image URL 1" required />
        <input {...register("img2")} placeholder="Image URL 2" required />
        <input {...register("img3")} placeholder="Image URL 3 (optional)" />
        <textarea {...register("description")} placeholder="Description"></textarea>
        <button type="submit">{editProductId ? "Update Product" : "Add Product"}</button>
        <button type="button" onClick={clearForm}>
          Clear Form
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <div className="products">
        {products.map((product) => {
          if (!product || product.regularPrice === undefined || product.productName === undefined) {
            console.warn("Product is missing fields:", product);
            return null;
          }

          return (
            <div className="product-card" key={product._id}>
              {product.salePrice ? <div className="sale-banner">On Sale!</div> : null}
              <img src={product.img1} alt={product.productName} className="product-img" />
              <h2 className="product-name">{product.productName}</h2>
              <div className="price-wrapper">
                {product.salePrice ? (
                  <>
                    <p className="sale-price">${product.salePrice.toFixed(2)}</p>
                    <p className="original-price">${product.regularPrice.toFixed(2)}</p>
                  </>
                ) : (
                  <p className="product-price">${product.regularPrice.toFixed(2)}</p>
                )}
              </div>
              <p className="product-description">{product.description}</p>
              <div>
                <button className="edit-button" onClick={() => handleEdit(product)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
