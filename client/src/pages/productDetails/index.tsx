// ProductDetailsPage component
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import "./style.css";

export const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartItems, addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const apiUrl = `http://localhost:3001/product/${productId}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.product) {
          setProduct(data.product);
        } else {
          throw new Error("Product data not found in response");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    addToCart(productId);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  const cartItemCount = cartItems[productId] || 0;

  const safelyGetPrice = (priceType) => {
    if (product && product[priceType] !== undefined) {
      return typeof product[priceType] === "number" ? product[priceType].toFixed(2) : product[priceType];
    }
    return "N/A";
  };

  return (
    <div className="product-details">
      <div className="product-image">{product.img1 && <img src={product.img1} alt={product.productName} className="main-image" />}</div>
      <div className="product-info">
        <h1 className="product-name">{product.productName || "Unnamed Product"}</h1>
        <h3>Description:</h3>
        <p className="description">{product.description || "No description available"}</p>
        <div className="price-section">
          {safelyGetPrice("salePrice") !== "N/A" ? (
            <>
              <p className="sale-price">{safelyGetPrice("salePrice")} DT</p>
              <p className="original-price">{safelyGetPrice("regularPrice")} DT</p>
            </>
          ) : (
            <p className="price">{safelyGetPrice("regularPrice")} DT</p>
          )}
        </div>
        {product.stockQuantity > 0 || product.stockQuantity === undefined ? (
          <div className="add-to-cart-section">
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart {cartItemCount > 0 && `(${cartItemCount})`}
            </button>
          </div>
        ) : (
          <p className="out-of-stock">Out of Stock</p>
        )}
      </div>
    </div>
  );
};
