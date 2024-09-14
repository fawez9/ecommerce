import { useState } from "react";
import { useGetProducts } from "../../hooks/useGetProducts";
import { useCart } from "../../context/cartContext";
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

  const getCartItemCount = (itemId: string): number => {
    return cartItems[itemId] || 0;
  };

  return (
    <div className="home">
      {/* TODO: Add image here <<------------------------------------------- */}
      <h1 className="home-title">Collection 2024</h1>
      <div className="products">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            {product.salePrice ? <div className="sale-banner">On Sale!</div> : null}
            <img src={product.img1} alt={product.productName} className="product-img" />
            <h2 className="product-name">{product.productName}</h2>
            {product.salePrice ? (
              <div className="price-wrapper">
                <p className="product-price sale-price">${product.salePrice.toFixed(2)}</p>
                <p className="product-price original-price">${product.regularPrice.toFixed(2)}</p>
              </div>
            ) : (
              <p className="product-price">${product.regularPrice.toFixed(2)}</p>
            )}
            <p className="product-description">{product.description}</p>
            {product.stockQuantity > 0 ? (
              <button className="buy-button" onClick={() => addToCart(product._id)}>
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
