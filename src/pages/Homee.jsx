import React, { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import Header from './UserHeader.jsx'
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";


function App() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);
  const [isListening, setIsListening] = useState(false);


  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    speak("Select the Choice Exploring or Purchasing");
    setIsListening(true)
  }

  const stopListening = () => {SpeechRecognition.stopListening(); setIsListening(false)};
  
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!transcript) return;
    const timer = setTimeout(() => {
      handleModeSelection(transcript.trim().toLowerCase());
      resetTranscript();
    }, 5000);
    return () => clearTimeout(timer);
  }, [transcript]);

  useEffect(() => {
    // Stop speaking when the component unmounts (e.g., navigating to a new page)
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const speak = (text) => {
    // Stop any ongoing speech before starting a new one
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleModeSelection = (input) => {
    if (input.includes("explore") || input.includes("exploring")) {
      setMode("exploring");
      speak("Navigating to Exploring Page");
      navigate("/product");
    } else if (input.includes("purchase") || input.includes("purchasing")) {
      setMode("purchasing");
      speak("Navigating to Purchasing Page");
      navigate("/cart");
    } else {
      speak("Command not recognized. Please say 'Explore' or 'Purchase'.");
      resetTranscript();
    }
  };

  const nav = (e) => {
    if (e === 'explore') {
      navigate("/product");
    }
    if (e === 'order') {
      navigate("/cart");
    }
  };

  return (
    <div className="app-container">
     <Header
        isListening={isListening}
        startListening={startListening}
        stopListening={stopListening}
      />
      <main className="main-content">
        <p>{transcript}</p>
        <button className="btn explore-btn" onClick={() => nav("explore")}>Explore</button>
        <button onClick={startListening} className="btn btn-success">Start</button>
        <button onClick={stopListening} className="btn btn-success">Stop</button>
        <button className="btn order-btn" onClick={() => nav("order")}>Order</button>
      </main>

      <footer className="footer">
        <p>Address:</p>
      </footer>
    </div>
  );
}

export default App;
