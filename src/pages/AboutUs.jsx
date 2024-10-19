import React, { useEffect, useState } from 'react';
import '../style/AboutUsStyle.css'; // Import CSS with 'ab' prefix

import Header from './UserHeader.jsx'
const AboutUs = () => {
  const [visibleSections, setVisibleSections] = useState({
    section1: false,
    section2: false,
    section3: false,
  });

  // Function to handle scroll and check when the sections come into view
  useEffect(() => {
    const handleScroll = () => {
      const triggerHeight = window.innerHeight * 0.8; // Trigger point

      const section1 = document.getElementById('section1').getBoundingClientRect().top;
      const section2 = document.getElementById('section2').getBoundingClientRect().top;
      const section3 = document.getElementById('section3').getBoundingClientRect().top;

      if (section1 < triggerHeight) {
        setVisibleSections((prevState) => ({ ...prevState, section1: true }));
      }
      if (section2 < triggerHeight) {
        setVisibleSections((prevState) => ({ ...prevState, section2: true }));
      }
      if (section3 < triggerHeight) {
        setVisibleSections((prevState) => ({ ...prevState, section3: true }));
      }
    };

    // Attach event listener for scroll
    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
 <Header
        
        />
    <div className="ab-container">
      <h1 className="ab-title">About Us</h1>

      {/* Section 1 */}
      <div id="section1" className={`ab-section ${visibleSections.section1 ? 'ab-visible' : ''}`}>
        <h2>Section 1: Introduction to Voice Commands</h2>
        <p>Navigate the app using voice commands such as "home", "back", or "stop listening".</p>
      </div>

      {/* Section 2 */}
      <div id="section2" className={`ab-section ${visibleSections.section2 ? 'ab-visible' : ''}`}>
        <h2>Section 2: Placing an Order Using Voice Commands</h2>
        <p>To confirm your cart, say "Place Order", or say "Payment" to select a payment method.</p>
      </div>

      {/* Section 3 */}
      <div id="section3" className={`ab-section ${visibleSections.section3 ? 'ab-visible' : ''}`}>
        <h2>Section 3: Getting Help</h2>
        <p>If you're stuck, say "Help" for guidance at any time.</p>
      </div>
    </div>
    </>
  );
};

export default AboutUs;
