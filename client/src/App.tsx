<<<<<<< HEAD
import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar.tsx";
import { AuthPage } from "./pages/auth/index.tsx";
import { CheckoutPage } from "./pages/checkout/index.tsx";
import { PurchasedItemsPage } from "./pages/purchased-items/index.tsx";
import { ShopPage } from "./pages/shop/index.tsx";
=======
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/navbar";
import { AuthPage } from "./pages/auth";
import { OrderPage } from "./pages/order";
import { HomePage } from "./pages/home";
import { ProductPage } from "./pages/product";
>>>>>>> upstream/master

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
<<<<<<< HEAD
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
=======
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/product" element={<ProductPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
>>>>>>> upstream/master
