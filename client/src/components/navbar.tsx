import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="navbar">
        <div className="title">
          <h1>Tattoo Shop</h1>
        </div>
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/product">Products</Link>
          <Link to="/order">
            <FontAwesomeIcon icon={faShoppingCart} />
          </Link>
          <Link to="/auth">
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>

      <div className={`sideMenu ${isOpen ? "show" : ""}`}>
        <div className="closeIcon" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <Link to="/" onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <Link to="/product" onClick={() => setIsOpen(false)}>
          Products
        </Link>
        <Link to="/order" onClick={() => setIsOpen(false)}>
          Cart
        </Link>
        <Link to="/auth" onClick={() => setIsOpen(false)}>
          Login
        </Link>
      </div>
    </>
  );
};
