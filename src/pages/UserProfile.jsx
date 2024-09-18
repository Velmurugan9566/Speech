import React, { useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaUser, FaMicrophone } from 'react-icons/fa';
import { Link,useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Header from './UserHeader.jsx';
import "../style/UserProfile.css";


function App() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const user = sessionStorage.getItem('userid') || ''; 
  const [showPopup, setShowPopup] = useState(false);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!user) {
      setShowPopup(true);
      speak("User not logged in. Please log in.");
    } else {
      speak("Welcome to the profile page.");
    }
  }, [user]);

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    setIsListening(true);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
  };

  const speak = (text) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleModeSelection = (input) => {
    if (input.includes("back")) {
      speak("Navigating back.");
      navigate(-1);
    } else if (input.includes("home")) {
      speak("Navigating home.");
      navigate("/home");
    } else if (input.includes("stop")) {
      stopListening();
      speak("Stopped listening.");
    } else {
      speak("Command not recognized, please repeat.");
      resetTranscript();
    }
  };

  useEffect(() => {
    if (!transcript) return;
    const timer = setTimeout(() => {
      handleModeSelection(transcript.trim().toLowerCase());
      resetTranscript();
    }, 5000);
    return () => clearTimeout(timer);
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <>
      <Header isListening={isListening} startListening={startListening} stopListening={stopListening} />
      
      {/* Popup for Non-Logged User */}
      <Popup open={showPopup} closeOnDocumentClick onClose={() => setShowPopup(false)} >
        <div className="pr-popup-content">
          <h2>Not Logged In</h2>
          <p>Please <Link to="/Login">Login</Link> to access your profile.</p>
        </div>
      </Popup>

      <section className="pr-section pr-section1">
        <div className="pr-content">
          <div className="pr-transcript-box">
            <input type='text' className='pr-textbox' placeholder='Tell Explore or Order...' value={transcript} readOnly></input>
            <FaMicrophone className='pr-microphone' />
          </div>
          <FaUser className='pr-icon' />
          {user ? (
            <div className="pr-user-details">
              <table>
                <tr><th>Name</th><td>{user.name}</td><td><button>Edit</button></td></tr>
                <tr><th>Email</th><td>{user.email}</td><td><button>Edit</button></td></tr>
                {/* Add more fields as necessary */}
              </table>
            </div>
          ):(
            <div>
            <h2>Not Logged In</h2>
            <p>Please <Link to="/Login">Login</Link> to access your profile.</p>
            </div>
          )}
        </div>
      </section>

      <footer className="pr-footer">
        <h2>Footer</h2>
      </footer>

    </>
  );
}

export default App;
