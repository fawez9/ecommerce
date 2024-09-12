import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import "./styles/footer.css"; // Ensure you have your CSS file for styling

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__links">
          <a href="/about" className="footer__link">
            About Us
          </a>
          <a href="/contact" className="footer__link">
            Contact
          </a>
          <a href="/privacy" className="footer__link">
            Privacy Policy
          </a>
        </div>
        <div className="footer__social-media">
          <a href="https://facebook.com" className="footer__social-link" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebookF} className="footer__social-icon" />
          </a>
          <a href="https://twitter.com" className="footer__social-link" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} className="footer__social-icon" />
          </a>
          <a href="https://instagram.com" className="footer__social-link" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} className="footer__social-icon" />
          </a>
        </div>
        <p className="footer__copyright">© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </div>
    </footer>
  );
};
