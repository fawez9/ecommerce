import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/navbar";
import { AuthPage } from "./pages/auth";
import { OrderPage } from "./pages/order";
import { HomePage } from "./pages/home";
import { ProfilePage } from "./pages/profile";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);

  const checkAuth = () => {
    const token = cookies.access_token;
    setIsAuth(!!token);
  };

  useEffect(() => {
    checkAuth();
  }, [cookies.access_token]);

  const handleLogout = () => {
    removeCookie("access_token");
    setIsAuth(false);
  };

  return (
    <div className="App">
      <Router>
        <Navbar isAuth={isAuth} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderPage />} />
          {isAuth ? (
            <>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/auth" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<Navigate to="/auth" />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
