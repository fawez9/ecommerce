import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/navbar";
import { AuthPage } from "./pages/auth";
import { OrderPage } from "./pages/order";
import { HomePage } from "./pages/home";
import { ProfilePage } from "./pages/profile";
import { AdminPage } from "./pages/admin";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUsername] = useState(""); // New state for username
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);

  const checkAuth = () => {
    const token = cookies.access_token;
    setIsAuth(!!token);
    if (token) {
      const decodedToken = jwtDecode<{ isAdmin: boolean; userName: string }>(token);
      setIsAdmin(decodedToken.isAdmin);
      setUsername(decodedToken.userName); // Set username from token
    }
  };

  useEffect(() => {
    checkAuth();
  }, [cookies.access_token]);

  const handleLogout = () => {
    removeCookie("access_token");
    localStorage.removeItem("userID");
    setIsAuth(false);
    setIsAdmin(false);
    setUsername(""); // Clear username on logout
  };

  return (
    <div className="App">
      <Router>
        <Navbar isAuth={isAuth} onLogout={handleLogout} userName={userName} isAdmin={isAdmin} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderPage />} />
          {isAuth ? (
            <>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={isAdmin ? <AdminPage /> : <Navigate to="/" />} />
              <Route path="/auth" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<Navigate to="/auth" />} />
              <Route path="/admin" element={<Navigate to="/auth" />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
