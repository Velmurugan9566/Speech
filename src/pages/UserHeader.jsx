import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaProductHunt, FaShoppingCart, FaUser, FaInfoCircle, FaHome, FaArrowLeft, FaArrowRight, FaMicrophone, FaMicrophoneSlash, FaBars } from 'react-icons/fa';
import '../style/UserHeader.css'; 

const Header = ({ isListening, startListening, stopListening }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);  // Go back using browser history
    }
  };

  const handleForward = () => {
    navigate(1);  // Go forward using browser history
  };

  return (
    <header className="h-header">
      <div className="h-top-row">
        <div className="h-profile">
          <FaUser className="h-icon" />
          <Link to="/Profile" className="profilelink">Profile</Link>
          <div className="h-submenu">
            <Link to="/Admin">Admin</Link>
          </div>
        </div>
        <h1 className="h-title">Vel'z Supermarket</h1>
        <button className="h-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FaBars />
        </button>
      </div>
      
      <nav className={`h-menu ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => navigate('/')}>
          <FaHome className="h-icon" /> Home
        </Link>
        <Link to="/product" onClick={() => navigate('/product')}>
          <FaProductHunt className="h-icon" /> Product
        </Link>
        <Link to="/cart" onClick={() => navigate('/cart')}>
          <FaShoppingCart className="h-icon" /> Cart
        </Link>
        <Link to="/About" onClick={() => navigate('/About')}>
          <FaInfoCircle className="h-icon" /> About
        </Link>
        <Link to="/Contact" onClick={() => navigate('/Contact')}>
          <FaInfoCircle className="h-icon" /> Contact
        </Link>
      </nav>
      
      <div className="h-bottom-row">
        <button className="h-voice-btn" onClick={isListening ? stopListening : startListening}>
          {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
        <div className="h-navigation-arrows">
          <button onClick={handleBack} disabled={window.history.length <= 1}>
            <FaArrowLeft />
          </button>
          <button onClick={handleForward}>
            <FaArrowRight />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
