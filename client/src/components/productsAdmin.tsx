import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useGetToken } from "../hooks/useGetToken";
import "./styles/productAdmin.css";
import { IProduct } from "../models/interfaces";
import { useGetProducts } from "../hooks/useGetProducts";

interface ProductFormData extends Omit<IProduct, "regularPrice" | "salePrice" | "stockQuantity"> {
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
  _id: "",
};

export const ProductsAdmin = () => {
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { headers } = useGetToken();
  const { products, isLoading, error: fetchError, fetchProducts } = useGetProducts();
  const { register, handleSubmit, reset, setValue } = useForm<ProductFormData>({
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (fetchError) {
      setError(fetchError);
    }
  }, [fetchError]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      const productData: IProduct = {
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
      fetchProducts(); // Refresh products list after submitting
    } catch (err) {
      setError("Error saving product");
    }
  };

  const handleEdit = (product: IProduct) => {
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
      fetchProducts(); // Refresh products list after deletion
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
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="products">
          {products.map((product) => {
            if (!product || product.regularPrice === undefined || product.productName === undefined) {
              console.warn("Product is missing fields:", product);
              return null;
            }

            return (
              <div className="product-card" key={product._id}>
                {product.salePrice && product.stockQuantity > 0 ? <div className="sale-banner">en promotion</div> : null}
                {product.stockQuantity === 0 ? <div className="out-of-stock-banner">Rupture de stock</div> : null}
                <div className="product-quantity">{product.stockQuantity}</div>
                <img src={product.img1} alt={product.productName} className="product-img" />
                <h2 className="product-name">{product.productName}</h2>
                <div className="price-wrapper">
                  {product.salePrice ? (
                    <>
                      <p className="sale-price">{product.salePrice.toFixed(2)} DT</p>
                      <p className="original-price">{product.regularPrice.toFixed(2)} DT</p>
                    </>
                  ) : (
                    <p className="product-price">{product.regularPrice.toFixed(2)} DT</p>
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
      )}
    </div>
  );
};
