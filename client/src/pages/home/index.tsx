import React, { useContext, useState } from "react";
import { useGetProducts } from "../../hooks/useGetProducts";
import "./style.css";
import { IProduct } from "../../models/interfaces";

export const HomePage = () => {
  const { products, isLoading, error } = useGetProducts();

  const [cartItems, setCartItems] = useState<{ string: number } | {}>({});

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="no-products">No products available</div>;
  }
  const addToCart = (itemId: string) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };
  const getCartItemCount = (itemId: string): number => {
    if (itemId in cartItems) {
      return cartItems[itemId];
    }
    return 0;
  };

  const handleBuyClick = (product: IProduct) => {
    // Handle the click event (e.g., redirect to product page, open a modal, etc.) for now we just alert for dev
    alert(`Product ${product.productName} added to cart!`);
  };

  return (
    <div className="home">
      <h1 className="home-title">Collection 2024</h1>
      <div className="products">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            {product.salePrice ? <div className="sale-banner">On Sale!</div> : null}
            <img src={product.img1} alt={product.productName} className="product-img" />
            <h2 className="product-name">{product.productName}</h2>
            {product.salePrice ? (
              <div className="price-wrapper">
                <p className="product-price original-price">${product.regularPrice.toFixed(2)}</p>
                <p className="product-price sale-price">
                  ${product.salePrice.toFixed(2)}
                  <span className="discount-percent">{(((product.regularPrice - product.salePrice) / product.regularPrice) * 100).toFixed(0)}% Off</span>
                </p>
              </div>
            ) : (
              <p className="product-price">${product.regularPrice.toFixed(2)}</p>
            )}
            <p className="product-description">{product.description}</p>
            <button className="buy-button" onClick={() => addToCart(product._id)}>
              Acheter {getCartItemCount(product._id) > 0 && <p>({getCartItemCount(product._id)})</p>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
