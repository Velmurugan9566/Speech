import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Header from './UserHeader';

function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [bgGradient, setBgGradient] = useState('');
  const navigate = useNavigate();
  const isListening = false;

  useEffect(() => {
    const generateRandomColor = () => {
      const letters = '0123456789ABCDEFabcdef';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const updateGradient = () => {
      const color1 = generateRandomColor();
      const color2 = generateRandomColor();
      setBgGradient(`linear-gradient(to right, ${color1}, ${color2})`);
    };

    const intervalId = setInterval(updateGradient, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.length !== 0) {
      if (password.length !== 0) {
        setLoading(true);
        axios.get('http://localhost:3001/Alogin', {
          params: { u: email, pass: password }
        })
          .then(res => {
            setLoading(false);
            const status = res.data.status;
            if (status === 1) {
              alert('Login Successfully');
              navigate('/Dashboard');
            } else if (status === 2) {
              toast.error('User Id not found..');
            } else if (status === 3) {
              toast.error('Password Mismatch..');
            }
          })
          .catch(err => { 
            setLoading(false);
            toast.error('Please connect internet..');
            console.log(err);
          });
      } else {
        alert('Password field is empty');
      }
    } else {
      alert('Email field is empty');
    }
  };

  return (
    <>
      <ToastContainer />
      <Header isListening={isListening} />
      <div style={{ background: bgGradient, height: '100vh' }} className="d-flex justify-content-center align-items-center">
        <div className="bg-white p-4 rounded" style={{ width: '300px', boxShadow: '0px 0px 15px rgba(0,0,0,0.2)' }}>
          <h2 className="text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <strong>User Id</strong>
              <input
                type="text"
                placeholder="Enter Email Address"
                autoComplete="off"
                name="email"
                className="form-control rounded-2"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <strong>Password</strong>
              <input
                type="password"
                placeholder="Enter Password"
                autoComplete="off"
                name="password"
                className="form-control rounded-2"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {loading ? (
              <button className="btn btn-success w-100 rounded-2">
                <Spinner animation="border" variant="light" />
              </button>
            ) : (
              <button type="submit" className="btn btn-success w-100 rounded-2">
                Login
              </button>
            )}
            <Link to="/forgetps"><p className="text-center mt-2">Forget Password</p></Link>
            <p className="text-center">Don't have an account?</p>
            <Link to="/" className="btn btn-default border w-100 bg-light">SignUp</Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default Admin;
