import React from "react";
import { useGetProducts } from "../../hooks/useGetProducts";
import { useCart } from "../../context/cartContext";
import { Link } from "react-router-dom";
import openingImage from "../../assets/skull.jpg";
import "./style.css";

export const HomePage = () => {
  const { products, isLoading, error } = useGetProducts();
  const { cartItems, addToCart } = useCart();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }
  if (products.length === 0) {
    return <div className="no-products">No products available</div>;
  }

  const getCartItemCount = (itemId) => {
    return cartItems[itemId] || 0;
  };

  return (
    <div className="home">
      <div className="opening-section">
        <img src={openingImage} alt="Welcome to our store" className="opening-image" />
      </div>
      <h1 className="home-title">Collection 2024</h1>
      <div className="products">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`} className="product-link">
              {product.salePrice ? <div className="sale-banner">On Sale!</div> : null}
              <img src={product.img1} alt={product.productName} className="product-img" />
              <h2 className="product-name">{product.productName}</h2>
              {product.salePrice ? (
                <div className="price-wrapper">
                  <p className="product-price sale-price">{product.salePrice.toFixed(2)} DT</p>
                  <p className="product-price original-price">{product.regularPrice.toFixed(2)} DT</p>
                </div>
              ) : (
                <p className="product-price">{product.regularPrice.toFixed(2)} DT</p>
              )}
              <p className="product-description">{product.description}</p>
            </Link>
            {product.stockQuantity > 0 ? (
              <button
                className="buy-button"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product._id);
                }}>
                Acheter {getCartItemCount(product._id) > 0 && `(${getCartItemCount(product._id)})`}
              </button>
            ) : (
              <div className="out-of-stock-banner">Rupture de stock</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
