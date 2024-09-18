import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaProductHunt, FaShoppingCart, FaUser, FaInfoCircle, FaHome, FaArrowLeft, FaArrowRight, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import '../style/UserHeader.css'; 

const Header = ({ isListening, startListening, stopListening }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = React.useState([]);

  const handleBack = () => {
    if (history.length > 0) {
      const lastPage = history[history.length - 1];
      setHistory(history.slice(0, -1));
      navigate(lastPage);
    }
  };

  const handleForward = (path) => {
    setHistory([...history, location.pathname]);
    navigate(path);
  };

  return (
    <header className="h-header">
      <div className="h-top-row">
        <div className="h-profile">
          <FaUser className="h-icon"/>
         <Link to="/Profile" className='profilelink' onClick={() => handleForward('/Profile')}> Profile</Link>
          <div className="h-submenu">
            <Link to="/Admin" onClick={() => handleForward('/Admin')}>Admin</Link>
          </div>
        </div>
        <h1 className="h-title">Vel'z Supermarket</h1>
      </div>
      <nav className="h-menu">
      <Link to="/" onClick={() => handleForward('/')}>
          <FaHome className="h-icon" />
          Home
        </Link>
        <Link to="/product" onClick={() => handleForward('/product')}>
          <FaProductHunt className="h-icon" />
          Product
        </Link>
        <Link to="/cart" onClick={() => handleForward('/cart')}>
          <FaShoppingCart className="h-icon" />
          Cart
        </Link>
        <Link to="/about" onClick={() => handleForward('/about')}>
          <FaInfoCircle className="h-icon" />
          About
        </Link>
        <Link to="/contact" onClick={() => handleForward('/contact')}>
          <FaInfoCircle className="h-icon" />
          Contact
        </Link>
       
      </nav>
      <div className="h-bottom-row">
        <button className="h-voice-btn" onClick={isListening ? stopListening : startListening}>
          {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
        <div className="h-navigation-arrows">
          <button onClick={handleBack} disabled={history.length === 0}>
            <FaArrowLeft />
          </button>
          <button onClick={() => navigate(1)} disabled={true}>
            <FaArrowRight />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
