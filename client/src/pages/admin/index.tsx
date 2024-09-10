import React, { useState } from "react";
import { BsHouseFill, BsBagFill, BsPeopleFill, BsList, BsX } from "react-icons/bs";
import "./style.css";
import { Dashboard } from "../../components/dashboard";
import { Users } from "../../components/users";
import { ProductsAdmin } from "../../components/productsAdmin";

export const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <ProductsAdmin />;
      case "users":
        return <Users />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <div className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`} onClick={() => setActiveSection("dashboard")}>
            <BsHouseFill />
            <span>Dashboard</span>
          </div>
          <div className={`nav-item ${activeSection === "products" ? "active" : ""}`} onClick={() => setActiveSection("products")}>
            <BsBagFill />
            <span>Products</span>
          </div>
          <div className={`nav-item ${activeSection === "users" ? "active" : ""}`} onClick={() => setActiveSection("users")}>
            <BsPeopleFill />
            <span>Users</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`main-content ${collapsed ? "with-sidebar" : ""}`}>
        {/* Sidebar Toggle Button */}
        {!collapsed && (
          <button onClick={toggleSidebar} className="sidebar-toggle">
            <BsList />
          </button>
        )}

        {/* Content */}
        <main className="content">
          <h1>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
          <div className="dashboard-content">{renderContent()}</div>
        </main>
      </div>

      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <button onClick={toggleSidebar} className="sidebar-close-btn">
          <BsX />
        </button>
        <div className="sidebar-header">
          <h2>Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <div className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`} onClick={() => setActiveSection("dashboard")}>
            <BsHouseFill />
            <span>Dashboard</span>
          </div>
          <div className={`nav-item ${activeSection === "products" ? "active" : ""}`} onClick={() => setActiveSection("products")}>
            <BsBagFill />
            <span>Products</span>
          </div>
          <div className={`nav-item ${activeSection === "users" ? "active" : ""}`} onClick={() => setActiveSection("users")}>
            <BsPeopleFill />
            <span>Users</span>
          </div>
        </nav>
      </div>
    </div>
  );
};
