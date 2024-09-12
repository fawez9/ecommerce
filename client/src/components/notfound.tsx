import { Link } from "react-router-dom";
import "./styles/notfound.css"; // Assuming you have a CSS file for styling

const NotFound = () => {
  return (
    <div className="not-found">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__message">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="not-found__link">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
