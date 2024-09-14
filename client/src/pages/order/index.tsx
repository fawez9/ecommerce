// pages/OrderPage.tsx
import { useCart } from "../../context/cartContext";
import { useGetProducts } from "../../hooks/useGetProducts";
import { Link } from "react-router-dom";
import "./style.css"; // Import the CSS
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const OrderPage = () => {
  const { cartItems, removeFromCart, clearCart, updateCartQuantity } = useCart(); // Added updateCartQuantity
  const { products } = useGetProducts(); // Fetch products

  const cartItemsArray = Object.entries(cartItems);

  // Create a map of product details for easy access
  const productMap = new Map(products.map((product) => [product._id, product]));

  // Handlers to update quantity
  const increaseQuantity = (itemId: string) => {
    updateCartQuantity(itemId, (cartItems[itemId] || 0) + 1);
  };

  const decreaseQuantity = (itemId: string) => {
    const currentQuantity = cartItems[itemId] || 0;
    if (currentQuantity > 1) {
      updateCartQuantity(itemId, currentQuantity - 1);
    } else {
      removeFromCart(itemId);
    }
  };

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
                <div className="remove-item" onClick={() => removeFromCart(itemId)}>
                  <FontAwesomeIcon icon={faTimes} />
                </div>
                <img src={product.img1} alt={product.productName} className="product-img" />
                <div className="item-details">
                  <h2>{product.productName}</h2>
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(itemId)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => increaseQuantity(itemId)}>+</button>
                  </div>
                  <p>Price: ${((product.salePrice ? product.salePrice : product.regularPrice) * quantity).toFixed(2)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      {cartItemsArray.length > 0 && (
        <div className="order-actions">
          <Link to="/checkout">
            <button className="proceed-button">Proceed to Checkout</button>
          </Link>
          <button onClick={clearCart} className="clear-cart-button">
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};
