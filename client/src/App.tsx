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

function App() {
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem("isAuth") === "true");
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("isAdmin") === "true");
  const [userName, setUsername] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);

  const checkAuth = () => {
    const token = cookies.access_token;
    setIsAuth(!!token);
    if (token) {
      const decodedToken = jwtDecode<{ isAdmin: boolean; userName: string }>(token);
      setIsAdmin(decodedToken.isAdmin);
      setUsername(decodedToken.userName);
      setCookie("access_token", token);
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("isAdmin", decodedToken.isAdmin === false ? "false" : "true");
    }
  };

  useEffect(() => {
    checkAuth();
  }, [cookies.access_token]);

  const handleLogout = () => {
    removeCookie("access_token");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userID");
    setIsAuth(false);
    setIsAdmin(false);
    setUsername("");
  };
  // console.log(isAuth, isAdmin);

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
          <Route path="*" element={<NotFound />} />
        </Routes>
        {isAdmin ? null : <Footer />}
      </Router>
    </div>
  );
}

export default App;
