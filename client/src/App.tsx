import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar.tsx";
import { AuthPage } from "./pages/auth/index.tsx";
import { CheckoutPage } from "./pages/checkout/index.tsx";
import { PurchasedItemsPage } from "./pages/purchased-items/index.tsx";
import { ShopPage } from "./pages/shop/index.tsx";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/purchased-items" element={<PurchasedItemsPage />} />
        </Routes>
      </Router>
    </div>  
  );
}

export default App;