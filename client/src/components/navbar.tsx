import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBars, faTimes, faChevronDown, faUser } from "@fortawesome/free-solid-svg-icons";

interface NavbarProps {
  onLogout: () => void;
  isAuth: boolean;
  userName?: string;
  isAdmin?: boolean;
}

export const Navbar = ({ onLogout, isAuth, userName, isAdmin }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // State to control cart drawer
  const navigate = useNavigate();


  const handleOrderClick = () => {
    navigate("/order");
  };
  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const toggleCart = () => {
    setIsCartOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/auth");
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
          <p>Votre panier est vide!</p>
          {/* Add your cart items here */}
        </div>
        <div className="cart-summary">
          <button className="checkout-button" onClick={handleOrderClick}>Valider mes achats →</button>
          <button className="checkout-button">Vider mon panier</button>
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
        <Link to="/order" onClick={() => setIsOpen(false)}>
          Cart
        </Link>
        {isAuth ? (
          <>
            <Link to="/profile" onClick={() => setIsOpen(false)}>
              Profile
            </Link>
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
