import React, { useEffect, useState } from 'react';
import '../style/PopupStyle.css';

const Popup = ({ showPopup }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  

  useEffect(() => {
    if (showPopup) {
      // Show confetti when popup appears
      setShowConfetti(true);
      showPopup=false;
      // Remove confetti after 3 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
        showPopup=false;
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <>
      {showPopup && ( 
        <div className="ch-popup">
          <h2 className="ch-popup-title">Order Placed Successfully!</h2>
          <p>Your order will be processed shortly.</p>
        </div>
     )}

      {showConfetti && <Confetti />}
    </>
  );
};

const Confetti = () => {
  const confettiCount = 250;
  const confettiElements = [];

  for (let i = 0; i < confettiCount; i++) {
    const size = Math.random() * 10 + 5; // Random size for confetti
    const left = Math.random() * 100; // Random position
    const animationDelay = Math.random() * 2; // Random delay for falling confetti
    const duration = Math.random() * 2 + 2; // Random duration for falling

    const randomColor = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random HSL color

    confettiElements.push(
      <div
        key={i}
        className="ch-confetti"
        style={{
          width: size + 'px',
          height: size + 'px',
          left: left + '%',
          backgroundColor: randomColor,
          animationDelay: animationDelay + 's',
          animationDuration: duration + 's',
        }}
      ></div>
    );
  }

  return <div className="ch-confetti-container">{confettiElements}</div>;
};

export default Popup;
