import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css'; // We'll add styles next

function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const cartRef = useRef(null);
  const profileRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsMenuOpen(false);
    setIsCartOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartRef.current && !cartRef.current.contains(event.target) &&
        profileRef.current && !profileRef.current.contains(event.target)
      ) {
        setIsCartOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log('Menu is now', !isMenuOpen ? 'open' : 'closed');
  };

  const removeFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };
  return (
    <header>
      <nav>
        <div className="logo">TattooShop</div>
        <div className="hamburger" onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </div>
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#shop">Shop</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="cart-profile">
          <a href="#cart" onClick={toggleCart}>
            <i className="fas fa-shopping-cart"></i>
            <span>{cartItems.length}</span>
          </a>
          <a href="#profile" onClick={toggleProfile}>
            <i className="fas fa-user"></i>
          </a>
        </div>
      </nav>
      {/* Rolling menu for the cart */}
      <div ref={cartRef} className={`cart-menu ${isCartOpen ? 'open' : ''}`}>
        <h3>Your Cart</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.name} - {item.quantity}
                <button onClick={() => removeFromCart(index)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Dropdown menu for the profile */}
      <div ref={profileRef} className={`profile-menu ${isProfileOpen ? 'open' : ''}`}>
      <ul>
          {isLoggedIn ? (
            <>
              <li><a href="#account">Account</a></li>
              <li><a href="#settings">Settings</a></li>
              <li><a href="#logout">Logout</a></li>
            </>
          ) : (
            <>
              <li><a href="#signin">Sign In</a></li>
              <li><a href="#signup">Sign Up</a></li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Navbar;