import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBars, faTimes, faChevronDown, faUser } from "@fortawesome/free-solid-svg-icons";

interface NavbarProps {
  onLogout: () => void;
  isAuth: boolean;
  userName?: string; // Username for authenticated user
}

export const Navbar = ({ onLogout, isAuth, userName }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
          <Link to="/">
            <h1>Tattoo Shop</h1>
          </Link>
        </div>
        <div className="links">
          <Link to="/">Accueil</Link>
          <Link to="/order">
            <FontAwesomeIcon icon={faShoppingCart} />
          </Link>

          {isAuth ? (
            <div className="user-dropdown" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
              <button className="user-button">
                {userName || "Account"} <FontAwesomeIcon icon={faChevronDown} />
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile">Your profile</Link>
                  <div onClick={handleLogout} className="logout-button">
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth">
              {/* Show login/signup icon only when not authenticated */}
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
