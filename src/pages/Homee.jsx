import React, { useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import $ from 'jquery';
import 'slick-carousel';

import { Link, useNavigate } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import Header from './UserHeader.jsx'
import '../style/homee.css';
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
  useEffect(() => {
    $(document).ready(function() {
      $('.hp-carousel').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
      });
    });

    // For slide-down content on scroll
    const revealContent = () => {
      const contentSections = document.querySelectorAll('.hp-slide-down');
      contentSections.forEach(section => {
        const slideInAt = (window.scrollY + window.innerHeight) - section.offsetHeight / 2;
        const isHalfShown = slideInAt > section.offsetTop;
        if (isHalfShown) {
          section.classList.add('hp-active');
        } else {
          section.classList.remove('hp-active');
        }
      });
    };

    window.addEventListener('scroll', revealContent);

    return () => window.removeEventListener('scroll', revealContent);
  }, []);

  return (
    <>
      <div className="hp-app-container">
        <Header
          isListening={isListening}
          startListening={startListening}
          stopListening={stopListening}
        />
      </div>

      <div className="hp-carousel-container">
        <div className="hp-carousel">
          <div><img src="./assets/cartstyle.webps" alt="Item 1" /></div>
          <div><img src="image2.jpg" alt="Item 2" /></div>
          <div><img src="image3.jpg" alt="Item 3" /></div>
        </div>
      </div>

      <main className="hp-main-content">
        <p>{transcript}</p>
        <button className="hp-btn hp-explore-btn" onClick={() => nav("explore")}>Explore</button>
        <button onClick={startListening} className="hp-btn hp-btn-success">Start</button>
        <button onClick={stopListening} className="hp-btn hp-btn-success">Stop</button>
        <button className="hp-btn hp-order-btn" onClick={() => nav("order")}>Order</button>
      </main>

      {/* Content Section that slides down on scroll */}
      <section className="hp-content-section hp-slide-down">
        <h2>About the Project</h2>
        <p>
          The Voice-Based Bill Generation System in Supermarket helps visually impaired users shop independently using voice commands.
        </p>
      </section>

      <section className="hp-content-section hp-slide-down">
        <h2>How to Purchase</h2>
        <p>
          1. Start by registering or logging in using voice commands.<br />
          2. Browse items by speaking the product name.<br />
          3. Add items to your cart using voice instructions.<br />
          4. Once done, proceed to checkout and let the system generate a bill.
        </p>
      </section>

      <section className="hp-content-section hp-slide-down">
        <h2>Voice Commands</h2>
        <p>
          Example voice commands:<br />
          - "Add milk to cart"<br />
          - "Checkout now"<br />
          - "Show my cart"
        </p>
      </section>

      <footer className="hp-footer">
        Address
      </footer>
    </>
  );
};

export default App;