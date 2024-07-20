import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import { FaUser, FaShoppingCart } from 'react-icons/fa';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Vel'z Supermarket</h1>
        <div className="icons">
          <FaUser className="icon" />
          <Link to="/cart">
            jjjj<FaShoppingCart className="icon" />
          </Link>
        </div>
      </header>
      <main className="main-content">
        <button className="btn explore-btn">Explore</button>
        <button className="btn order-btn">Order</button>
      </main>
      <footer className="footer">
        <p>Address:</p>
      </footer>
    </div>
  );
}

export default App;
