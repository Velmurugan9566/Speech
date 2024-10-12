import { Link } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import '../style/AdminDash.css'; 
import React, { useState } from 'react';
import { FaUserCircle, FaBars } from 'react-icons/fa';

const Header = ({ toggleAside }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="ap-header">
      <div className="ap-header-content">
        <h1>Admin Dashboard</h1>
        <div className="ap-header-right">
          <FaUserCircle size={30} />
          <button className="ap-logout-button">Logout</button>
          <FaBars size={30} onClick={toggleMenu} />
        </div>
      </div>

      {/* Toggle the menu only when clicked */}
      <ul className={`ap-mobile-menu ${isMenuOpen ? 'open' : 'closed'}`}>
      <li><Link to='/DashBoard'>Home</Link></li>
                        <li><Link to='/DashBoard/AddProduct' >Add Products</Link></li>
                        <li><Link to='/DashBoard/ViewProduct' >View Products</Link></li>
                        <li><Link to='/DashBoard/ViewTransaction'>View Transaction</Link></li>
                        <li>View Customer</li>
      </ul>
    </header>
  );
};

export default Header;
