import React, { useState, useEffect } from 'react';
import './home.css';
import { Link, useNavigate } from 'react-router-dom';

import { FaUser, FaShoppingCart } from 'react-icons/fa';
const Header = () => {
  return (
    <header className="header">
    <h1 className="title">Vel'z Supermarket</h1>
    <div className="icons">
      <FaUser className="icon" id='icon1' />
      <div classname="submenu">
        <Link to="/Admin">Admin</Link>
      </div>
      <Link to="/cart">
        <FaShoppingCart className="icon" />
      </Link>
    </div>
  </header>
  );
};

export default Header;
