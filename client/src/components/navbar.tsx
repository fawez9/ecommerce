import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

interface NavbarProps {
  onLogout: () => void;
  isAuth: boolean;
}

export const Navbar = ({ onLogout, isAuth }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    onLogout(); // Call the callback function to update the isAuth state in the App component
    navigate("/auth");
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
          {isAuth ? (
            <div>
              <Link to="/profile">
                <FontAwesomeIcon icon={faUser} />
              </Link>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
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
