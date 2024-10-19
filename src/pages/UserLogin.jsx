import React, { useState, useEffect } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import 'regenerator-runtime/runtime';
import { FaUser, FaLock } from 'react-icons/fa';
import Header from './UserHeader';
import "../style/LoginPage.css"; // Custom styles
import ReactPopup from 'reactjs-popup'; // Popup for error handling
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [load,setLoad] = useState(false);
  
  const [cart, setCart] = useState(() => JSON.parse(sessionStorage.getItem('cart')) || []);
  const { transcript, resetTranscript } = useSpeechRecognition();
   console.log("login page",cart);
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    setIsListening(true);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
  };

  useEffect(() => {
    if (!transcript) return;
    const timer = setTimeout(() => {
      handleVoiceInput(transcript.trim().toLowerCase());
      resetTranscript();
    }, 5000);
    return () => clearTimeout(timer);
  }, [transcript]);

  const handleVoiceInput = (input) => {
    if (input.includes("email")) {
      const userPart = input.replace("email", "").trim();
      const emailValue = `${userPart}@gmail.com`;
      setEmail(emailValue);
    } else if (input.includes("password")) {
      const passwordInput = input.replace("password", "").trim();
      setPassword(passwordInput);
    } else if (input.includes("login")) {
      handleSubmit(); // Trigger login on "login" command
    } else {
      setError("Command not recognized. Please provide 'email' and 'password'.");
      resetTranscript();
    }
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setError(''); // Reset error
    setLoad(true);
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
        const data = res.data;
        setLoad(false)
        if (data.status == 1) {
            sessionStorage.setItem('userid', email); // Store session variable
            toast.success("Login successful! Redirecting...");

            if (cart && cart.length > 0) {
                const status = 1;
                const result = await axios.put(`${import.meta.env.VITE_API_URL}/updateCart`, { cart, email, status });
                console.log("Cart updated:", result.data);
                sessionStorage.setItem('cart', JSON.stringify([])); // Clear cart in session storage
            }
           
            console.log("updated..");
            navigate(-1); // Navigate back to the previous page
        } else if (data.status == 2) {
            toast.error("Email ID does not exist.");
        } else if (data.status == 3) {
            toast.error("Incorrect password. Please try again.");
        }  
    } catch (err) {
      setLoad(false)
        toast.error("Error logging in. Please try again.");
        console.error(err);
    }
};


  return (
    <>
      <Header 
        isListening={isListening}
        startListening={startListening}
        stopListening={stopListening}
      />
            <ToastContainer />
      <div className='login-main'>
      <div className="login-container">
        <FaUser className="login-icon" />
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {
              load ?
                <button className='btn btn-success w-100 rounded-2'>
                  <Spinner animation='border' variant='light'>
                  </Spinner>
                </button>
                :
                <button type='submit' className='btn btn-success w-100 rounded-2'>
                  Login
                </button>
            }
        </form>
        <div className="login-links">
          <Link to="/forgot-password">Forgot Password?</Link><br/>
          <Link to="/UserRegistration">Don't have an account?</Link>
        </div>
        {error && <ReactPopup open={true} closeOnDocumentClick>
          <div className="popup-content">
            <span>{error}</span>
          </div>
        </ReactPopup>}
      </div>
      </div>
    </>
  );
}

export default LoginPage;
