import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import "./style.css";
import { Dashboard } from "../../components/dashboard";
import { ProductsAdmin } from "../../components/productsAdmin";

export const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="grid-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="main-content">
        <Routes>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductsAdmin />} />
          {/* Add more routes as needed */}
        </Routes>
        <Outlet />
      </main>
    </div>
  );
};
