import React from 'react';
import './App.css'; // Import your styles
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from './Navbar'; // Import the Navbar component (we'll create it next)

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Welcome to TattooShop</h1>
            <p>Explore our exclusive tattoo designs and accessories!</p>
          </div>
        </section>
        <section id="about">
          <h2>About Us</h2>
          <p>Learn more about our story and mission.</p>
        </section>
        <section id="shop">
          <h2>Shop</h2>
          <p>Browse our collection of tattoo designs.</p>
        </section>
        <section id="contact">
          <h2>Contact</h2>
          <p>Get in touch with us.</p>
        </section>
      </main>
    </div>
  );
}

export default App;