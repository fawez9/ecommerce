// pages/OrderPage.tsx
import { useCart } from "../../context/cartContext";
import { useGetProducts } from "../../hooks/useGetProducts";
import { Link } from "react-router-dom";
import "./style.css"; // Import the CSS

export const OrderPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { products } = useGetProducts(); // Fetch products

  const cartItemsArray = Object.entries(cartItems);

  // Create a map of product details for easy access
  const productMap = new Map(products.map((product) => [product._id, product]));

  return (
    <div className="order-page">
      <h1>Order Summary</h1>
      <div className="cart-items">
        {cartItemsArray.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          cartItemsArray.map(([itemId, quantity]) => {
            const product = productMap.get(itemId);
            if (!product) return null;
            return (
              <div key={itemId} className="cart-item">
                <img src={product.img1} alt={product.productName} className="product-img" />
                <div className="item-details">
                  <h2>{product.productName}</h2>
                  <p>Quantity: {quantity}</p>
                  <p>Price: ${product.salePrice ? product.salePrice.toFixed(2) : product.regularPrice.toFixed(2)}</p>
                  <button onClick={() => removeFromCart(itemId)}>Remove</button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {cartItemsArray.length > 0 && (
        <div className="order-actions">
          <button onClick={clearCart}>Clear Cart</button>
          <Link to="/checkout">
            <button>Proceed to Checkout</button>
          </Link>
        </div>
      )}
    </div>
  );
};
