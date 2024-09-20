import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { HomePage } from "./pages/home";
import { OrderPage } from "./pages/order";
import { ProfilePage } from "./pages/profile";
import { AdminPage } from "./pages/admin";
import { AuthPage } from "./pages/auth";
import "./App.css";
import NotFound from "./components/notfound";
import { Footer } from "./components/footer";
import { CheckoutPage } from "./pages/checkout";

const RoutesWrapper = ({ isAuth, isAdmin, showFooter, setShowFooter }) => {
  const location = useLocation();

  const checkFooterVisibility = () => {
    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      const contentHeight = document.body.scrollHeight;
      const viewportHeight = window.innerHeight;
      setShowFooter(contentHeight <= viewportHeight);
    });
  };

  useEffect(() => {
    const handleResize = () => {
      checkFooterVisibility();
    };

    const handleScroll = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 10; // 10px threshold
      setShowFooter(isAtBottom);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Initial check
    checkFooterVisibility();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Reset footer visibility on route change
  useEffect(() => {
    // Short delay to allow for DOM updates
    const timer = setTimeout(() => {
      checkFooterVisibility();
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/profile" element={isAuth ? <ProfilePage isAdmin={isAdmin} /> : <Navigate to="/auth" />} />
        <Route path="/admin" element={isAdmin ? <AdminPage /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <AuthPage />} />
        <Route path="/checkout" element={<CheckoutPage isAuth={isAuth} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && showFooter && <Footer />}
    </>
  );
};

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUsername] = useState("");
  const [cookies, _, removeCookie] = useCookies(["access_token"]);
  const [loading, setLoading] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  useEffect(() => {
    const token = cookies.access_token;
    if (token) {
      try {
        const decodedToken = jwtDecode<{ isAdmin: boolean; userName: string }>(token);
        setIsAuth(true);
        setIsAdmin(decodedToken.isAdmin);
        setUsername(decodedToken.userName);
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("isAdmin", decodedToken.isAdmin ? "true" : "false");
      } catch (error) {
        console.error("Failed to decode token:", error);
        setIsAuth(false);
        setIsAdmin(false);
      }
    } else {
      setIsAuth(false);
      setIsAdmin(false);
    }
    setLoading(false);
  }, [cookies.access_token]);

  const handleLogout = () => {
    removeCookie("access_token");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("isAdmin");
    setIsAuth(false);
    setIsAdmin(false);
    setUsername("");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Router>
        <Navbar isAuth={isAuth} onLogout={handleLogout} userName={userName} isAdmin={isAdmin} showFooter={showFooter} setShowFooter={setShowFooter} />
        <RoutesWrapper isAuth={isAuth} isAdmin={isAdmin} showFooter={showFooter} setShowFooter={setShowFooter} />
      </Router>
    </div>
  );
}

export default App;
