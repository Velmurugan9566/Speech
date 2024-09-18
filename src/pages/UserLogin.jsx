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

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  
  const { transcript, resetTranscript } = useSpeechRecognition();

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
  try {
    axios.post('http://localhost:3001/login', { 
      email, 
      password 
    })
    .then(res=>{
      const data = res.data;
      if (data.status==1) {
        sessionStorage.setItem('userid',email); // Store session variable
        toast.success("Login successful! Redirecting...");
        navigate(-1); // Navigate back to the previous page
      } else if (data.status == 2) {
        toast.error("Email ID does not exist.");
       // startListening(); // Ask for input again
      } else if (data.status==3) {
        toast.error("Incorrect password. Please try again.");
       // startListening(); // Ask for input again
      }  
    })
.catch(err=>{
  toast.warning(err);
})
      } catch (err) {
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
          <button type="submit" className="login-btn">Login</button>
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
