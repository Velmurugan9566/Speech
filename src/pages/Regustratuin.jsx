import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    phoneNumber: '',
    address: '',
    pin: '',
    age: '',
    gender: ''
  });
  const [currentField, setCurrentField] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }
    speak("Welcome to the registration page. Please enter your user ID.");
    setCurrentField('userId');
  }, []);

  useEffect(() => {
    if (transcript && currentField) {
      const timer = setTimeout(() => {
        handleVoiceInput(transcript.trim().toLowerCase());
        resetTranscript();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [transcript, currentField]);

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

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

  const handleVoiceInput = (input) => {
    if (!currentField) return;

    if (currentField === 'userId' && validateInput(input, 'userId')) {
      setFormData({ ...formData, userId: input });
      speak("User ID received. Please enter your name.");
      setCurrentField('name');
    } else if (currentField === 'name' && validateInput(input, 'name')) {
      setFormData({ ...formData, name: input });
      speak("Name received. Please enter your phone number.");
      setCurrentField('phoneNumber');
    } else if (currentField === 'phoneNumber' && validateInput(input, 'phoneNumber')) {
      setFormData({ ...formData, phoneNumber: input });
      speak("Phone number received. Please enter your address.");
      setCurrentField('address');
    } else if (currentField === 'address' && validateInput(input, 'address')) {
      setFormData({ ...formData, address: input });
      speak("Address received. Please enter your pin.");
      setCurrentField('pin');
    } else if (currentField === 'pin' && validateInput(input, 'pin')) {
      setFormData({ ...formData, pin: input });
      speak("Pin received. Please enter your age.");
      setCurrentField('age');
    } else if (currentField === 'age' && validateInput(input, 'age')) {
      setFormData({ ...formData, age: input });
      speak("Age received. Please select your gender.");
      setCurrentField('gender');
    } else if (currentField === 'gender' && validateInput(input, 'gender')) {
      setFormData({ ...formData, gender: input });
      speak("Gender received. Registration complete. Thank you.");
      setCurrentField(null);
      handleSubmit();
    } else {
      speak(`Invalid ${currentField}. Please try again.`);
    }
  };

  const validateInput = (input, field) => {
    if (field === 'userId') return input.length > 0;
    if (field === 'name') return /^[a-zA-Z ]+$/.test(input);
    if (field === 'phoneNumber') return /^\d{10}$/.test(input);
    if (field === 'address') return input.length > 0;
    if (field === 'pin') return /^\d{6}$/.test(input);
    if (field === 'age') return /^\d+$/.test(input) && parseInt(input) > 0;
    if (field === 'gender') return ['male', 'female', 'other'].includes(input.toLowerCase());
    return false;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      // Post the data to your server
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, formData);
      alert(response.data.message);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="registration-container">
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <label>User ID: 
          <input 
            type="text" 
            name="userId" 
            value={formData.userId} 
            onChange={handleChange} 
            onClick={() => setCurrentField('userId')}
          />
        </label><br />
        <label>Name: 
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            onClick={() => setCurrentField('name')}
          />
        </label><br />
        <label>Phone Number: 
          <input 
            type="text" 
            name="phoneNumber" 
            value={formData.phoneNumber} 
            onChange={handleChange} 
            onClick={() => setCurrentField('phoneNumber')}
          />
        </label><br />
        <label>Address: 
          <input 
            type="text" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            onClick={() => setCurrentField('address')}
          />
        </label><br />
        <label>Pin: 
          <input 
            type="text" 
            name="pin" 
            value={formData.pin} 
            onChange={handleChange} 
            onClick={() => setCurrentField('pin')}
          />
        </label><br />
        <label>Age: 
          <input 
            type="number" 
            name="age" 
            value={formData.age} 
            onChange={handleChange} 
            onClick={() => setCurrentField('age')}
          />
        </label><br />
        <label>Gender: 
          <select 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange} 
            onClick={() => setCurrentField('gender')}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label><br />
        <button type="submit">Submit</button>
      </form>

      <div>
        <button onClick={isListening ? stopListening : startListening}>
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>
        <p>Transcript: {transcript}</p>
      </div>
    </div>
  );
}

export default RegistrationForm;
