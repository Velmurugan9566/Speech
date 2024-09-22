import React, { useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaUser, FaMicrophone } from 'react-icons/fa';
import { Link,useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Header from './UserHeader.jsx';
import "../style/UserProfile.css";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';


function App() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const user = sessionStorage.getItem('userid') || ''; 
  const [showPopup, setShowPopup] = useState(false);
  const [userData,setUserData] =useState({})
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState();
  const [errorMessage, setErrorMessage] = useState({});
  
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!user) {
      setShowPopup(true);
      speak("User not logged in. Please login.");
    } else {
      speak("Welcome to the profile page.");
      fetchUser();
    }
  }, [user]);
function fetchUser(){
  axios.get('http://localhost:3001/getuser',{params: {name:user}})
      .then(res =>{
        if(res.data.status ==1){
          setUserData(res.data.detail)
          console.log("user",userData);
          setFormData({
            name: userData.name,
            email: userData.email,
            age: userData.age,
            gender: userData.gender,
            phone: userData.phone,
            password:userData.password,
          });
          console.log("form",formData);
        }else if(res.data.status ==2){
            toast.info("user details not found..");
        }
      })
      .catch(err=>{
          toast.info("Error Fetcing user details..")
      })
}
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
  const handleEditClick = () => {
    setIsEditing(true); // Enable editing mode
  };

  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case 'name':
        if (!value) {
          errors.name = 'Name is required';
        } else if (/\d/.test(value)) {
          errors.name = 'Name cannot contain numbers';
        }
        break;
      case 'age':
        if (value < 0) {
          errors.age = 'Age cannot be negative';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Invalid email format';
        }
        break;
      case 'phone':
        if (!/^\d{10}$/.test(value)) {
          errors.phone = 'Phone number must be 10 digits';
        }
        break;
      case 'gender':
        if (!value) {
          errors.gender = 'Gender is required';
        }
        break;
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        }
        break;
      default:
        const errors={};
        break;
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const errors = validateField(name, value);

    setErrorMessage({
      ...errorMessage,
      ...errors,
    });

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleUpdate = async () => {
    const formErrors = Object.values(errorMessage).some((error) => error !== '');

    if (!formErrors) {
    try {
      const response = await axios.put(`http://localhost:3001/update-user/${userData._id}`, formData); 
      if (response.data.success) {
        fetchUser();
        toast.success('User updated successfully!');
        setIsEditing(false); // Disable editing mode
      } else {
        toast.info('Error updating user.');
      }
    } catch (error) {
      alert("Error updating user:", error);
    }
  } else {
    setErrorMessage({})
    toast.warning('Please correct the form errors before submitting.');
  }
  };
  const handleCancel=()=>{
    setIsEditing(false);
    setErrorMessage({});
  }
  const logout=()=>{
    sessionStorage.removeItem("userid");
    setUserData({});
    setFormData({})
  }
  return (
    <>
      <Header isListening={isListening} startListening={startListening} stopListening={stopListening} />
      <ToastContainer />
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
        <tbody>
          <tr>
            <th>Name</th>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              ) : (
                userData.name
              )}
            </td>
            <td>{errorMessage.name && <span style={{ color: 'red' }}>{errorMessage.name}</span>}</td>
          </tr>

          <tr>
            <th>Email</th>
            <td>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                />
              ) : (
                userData.email
              )}
            </td>
            <td>{errorMessage.email && <span style={{ color: 'red' }}>{errorMessage.email}</span>}</td>
          </tr>

          <tr>
            <th>Age</th>
            <td>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              ) : (
                userData.age
              )}
            </td>
            <td>{errorMessage.age && <span style={{ color: 'red' }}>{errorMessage.age}</span>}</td>
          </tr>

          <tr>
            <th>Gender</th>
            <td>
              {isEditing ? (
                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                userData.gender
              )}
            </td>
            <td>{errorMessage.gender && <span style={{ color: 'red' }}>{errorMessage.gender}</span>}</td>
          </tr>

          <tr>
            <th>Phone</th>
            <td>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                userData.phone
              )}
            </td>
            <td>{errorMessage.phone && <span style={{ color: 'red' }}>{errorMessage.phone}</span>}</td>
          </tr>

          <tr>
            <th>Password</th>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              ) : (
                userData.password
              )}
            </td>
            <td>{errorMessage.password && <span style={{ color: 'red' }}>{errorMessage.password}</span>}</td>
          </tr>
        </tbody>
      </table>
      {!isEditing ? (
       <div> <button onClick={handleEditClick}>Edit</button>  <button onClick={logout} >Logout</button></div>
      ) : (
        <div><button onClick={handleUpdate}>Update</button>   <button onClick={handleCancel}>Cancel</button></div>
      )}
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
