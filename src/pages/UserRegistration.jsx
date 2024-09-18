import React, { useState } from 'react';
import '../style/UserRegister.css'; // Ensure you have the CSS for styling
import Header from './UserHeader.jsx';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';

const RegistrationForm = () => {
  const [isListening, setIsListening] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '', // Adding confirm password
  });

  const [errors, setErrors] = useState({}); // To hold validation errors
  const [errorMessage, setErrorMessage] = useState('');

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    speak("Welcome to the registration Page..");
    setIsListening(true);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
  };

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Perform validation on each field when it's changed
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let fieldErrors = { ...errors };

    switch (fieldName) {
      case 'name':
        fieldErrors.name = value.trim() === '' ? 'Name cannot be empty' : '';
        break;
      case 'age':
        fieldErrors.age = value <= 0 ? 'Age must be a positive number' : '';
        break;
      case 'phone':
        fieldErrors.phone = value.length !== 10 ? 'Phone number must be 10 digits' : '';
        break;
      case 'email':
        fieldErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email format';
        break;
      case 'password':
        fieldErrors.password = value.trim() === '' ? 'Password cannot be empty' : '';
        break;
      case 'confirmPassword':
        fieldErrors.confirmPassword = value !== formData.password ? 'Passwords do not match' : '';
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Perform validation before submission
    const valid = validateForm();

    if (valid) {
      const userData = {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      };
    
      
        axios.post('http://localhost:3001/register', userData)
        .then(response=>{

          console.log(response.data)
          if (response.data.status == 3) {
            toast.success("Registration Successful..")
          }else if(response.data.status == 2){
            setErrorMessage(response.data.message);
            toast.warning("Fields Contains Some Mistake");
          }else if(response.data.status==1){
            toast.warning("Email id already Exists..")
          }
        })
        .catch(err=>{
          toast.warning("Server error..")
          setErrorMessage(err.response.data.message); // Display the error message from se
        })
    } else {
      setErrorMessage('Please correct the highlighted errors.');
    }
  };

  const validateForm = () => {
    const fieldErrors = {};
    
    if (!formData.name.trim()) fieldErrors.name = 'Name cannot be empty';
    if (formData.age <= 0) fieldErrors.age = 'Age must be a positive number';
    if (formData.phone.length !== 10) fieldErrors.phone = 'Phone number must be 10 digits';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) fieldErrors.email = 'Invalid email format';
    if (!formData.password.trim()) fieldErrors.password = 'Password cannot be empty';
    if (formData.password !== formData.confirmPassword) fieldErrors.confirmPassword = 'Passwords do not match';

    setErrors(fieldErrors);

    return Object.keys(fieldErrors).length === 0;
  };

  const speak = (text) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <>
      <Header
        isListening={isListening}
        startListening={startListening}
        stopListening={stopListening}
      />
      <ToastContainer />
      <div className="re-main">
        <div className="re-form-container">
          <div className="re-form-box">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                required
              />
              {errors.name && <p className="error-message">{errors.name}</p>}

              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={errors.age ? 'error' : ''}
                required
              />
              {errors.age && <p className="error-message">{errors.age}</p>}

              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
                required
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}

              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                required
              />
              {errors.password && <p className="error-message">{errors.password}</p>}

              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                required
              />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <button type="submit">Register</button>
              Already have an account<Link to='/Login'>Login</Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
