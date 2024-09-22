// components/Navbar.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBars, faTimes, faChevronDown, faUser, faTrash } from "@fortawesome/free-solid-svg-icons";

import { useCart } from "../context/cartContext";
import { useGetProducts } from "../hooks/useGetProducts";

interface NavbarProps {
  onLogout: () => void;
  isAuth: boolean;
  userName?: string;
  isAdmin?: boolean;
  showFooter: boolean;
  setShowFooter: (show: boolean) => void; // Add this prop
}

export const Navbar = ({ onLogout, isAuth, userName, isAdmin, showFooter, setShowFooter }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItems, clearCart, updateCartQuantity, removeFromCart } = useCart();
  const { products } = useGetProducts(); // Fetch products

  useEffect(() => {
    setShowFooter(!isCartOpen);
  }, [isCartOpen, setShowFooter]);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const toggleCart = () => {
    setIsCartOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const cartItemCount = Object.values(cartItems).reduce((acc, count) => acc + count, 0);

  // Create a map of product details for easy access
  const productMap = new Map(products.map((product) => [product._id, product]));
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
    <>
      <div className="navbar">
        <div className="title">
          <Link to="/">
            <h1>Tattoo Shop</h1>
          </Link>
        </div>
        <div className="links">
          <Link to="/">Accueil</Link>
          {!isAdmin && (
            <div className="cart-icon" onClick={toggleCart}>
              <FontAwesomeIcon icon={faShoppingCart} />
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </div>
          )}
          {isAuth ? (
            <div className="user-dropdown" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
              <button className="user-button">
                {userName || "Account"} <FontAwesomeIcon icon={faChevronDown} />
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile">Your profile</Link>
                  {isAdmin && <Link to="/admin">Admin</Link>}
                  <div onClick={handleLogout} className="logout-button">
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth">
              <FontAwesomeIcon icon={faUser} />
            </Link>
          )}
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>

      {/* Side Cart Drawer */}
      <div className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="cart-drawer-header">
          <h2>Votre Panier</h2>
          <FontAwesomeIcon icon={faTimes} onClick={toggleCart} className="close-icon" />
        </div>
        <div className="cart-content">
          {Object.keys(cartItems).length === 0 ? (
            <p>Your cart is empty!</p>
          ) : (
            Object.entries(cartItems).map(([itemId, quantity]) => {
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
                    <p>Price: {((product.salePrice ? product.salePrice : product.regularPrice) * quantity).toFixed(2)} DT</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="cart-summary">
          <button
            className="checkout-button"
            onClick={() => {
              navigate("/order");
              setIsCartOpen(false);
            }}>
            Voir →
          </button>
          <button className="checkout-button clear-cart" onClick={clearCart}>
            Vider <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div className={`backdrop ${isCartOpen ? "show" : ""}`} onClick={toggleCart}></div>

      <div className={`sideMenu ${isOpen ? "show" : ""}`}>
        <div className="closeIcon" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <Link to="/" onClick={() => setIsOpen(false)}>
          Accueil
        </Link>
        {!isAdmin && (
          <Link to="/order" onClick={() => setIsOpen(false)}>
            Order
          </Link>
        )}
        {isAuth ? (
          <>
            <Link to="/profile" onClick={() => setIsOpen(false)}>
              Profile
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsOpen(false)}>
                Admin
              </Link>
            )}
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" onClick={() => setIsOpen(false)}>
            Login
          </Link>
        )}
      </div>
    </>
  );
};
