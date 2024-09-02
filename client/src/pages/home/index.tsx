import React from "react";
import { useGetProducts } from "../../hooks/useGetProducts";
import "./style.css";

export const HomePage: React.FC = () => {
  const { products, isLoading, error } = useGetProducts();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="no-products">No products available</div>;
  }

  const handleBuyClick = (productId: string) => {
    // Handle the click event (e.g., redirect to product page, open a modal, etc.) for now we just alert for dev
    alert(`Product ${productId} added to cart!`);
  };

  return (
    <div className="home">
      <h1 className="home-title">Collection 2024</h1>
      <div className="products">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            {product.salePrice && <div className="sale-banner">On Sale!</div>}
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
            <button className="buy-button" onClick={() => handleBuyClick(product._id)}>
              Acheter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
