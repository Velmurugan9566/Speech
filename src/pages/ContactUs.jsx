import React from 'react';
import '../style/ContactUsStyle.css'; // Use CSS prefix 'co'
import Header from './UserHeader'

const ContactUs = () => {
    
  return (
    <>
     <Header/>
    <div className="co-container">
      <h1 className="co-title">Contact Us</h1>
      <div className="co-details">
        <p>Email: shoppingportalmsu.com</p>
        <p>Phone: +01 9566862480</p>
        <p>Address:40 A North cart street , Tirunelveli Town</p>
      </div>
      <div className="co-form-container">
        <form className="co-form">
          <label className="co-label">Name</label>
          <input type="text" className="co-input" placeholder="Your Name" />
          <label className="co-label">Email</label>
          <input type="email" className="co-input" placeholder="Your Email" />
          <label className="co-label">Message</label>
          <textarea className="co-textarea" placeholder="Your Message"></textarea>
          <button type="submit" className="co-submit">Submit</button>
        </form>
      </div>
    </div>
    </>
  );
};

export default ContactUs;
