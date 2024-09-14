import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
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

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUsername] = useState("");
  const [cookies, _, removeCookie] = useCookies(["access_token"]);
  const [loading, setLoading] = useState(true); // Loading state to handle initial render

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
    setLoading(false); // Set loading to false once the check is complete
  }, [cookies.access_token]);

  const handleLogout = () => {
    removeCookie("access_token");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("isAdmin");
    setIsAuth(false);
    setIsAdmin(false);
    setUsername("");
  };

  // console.log("isAuth:", isAuth, "isAdmin:", isAdmin);

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator or spinner
  }

  return (
    <div className="App">
      <Router>
        <Navbar isAuth={isAuth} onLogout={handleLogout} userName={userName} isAdmin={isAdmin} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/profile" element={isAuth ? <ProfilePage isAdmin={isAdmin} /> : <Navigate to="/auth" />} />
          <Route path="/admin" element={isAdmin ? <AdminPage /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <AuthPage />} />
          <Route path="/checkout" element={<CheckoutPage isAuth={isAuth} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {isAdmin ? null : <Footer />}
      </Router>
    </div>
  );
}

export default App;
