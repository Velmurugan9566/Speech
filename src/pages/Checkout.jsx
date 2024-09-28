import React,{useState,useEffect} from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import "../style/CheckoutStyle.css"; 
import Header from './UserHeader'
import { FaUser, FaShoppingCart,FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';


function Checkout(){
   const user = sessionStorage.getItem('userid') || ''; 
    const [isListening, setIsListening] = useState(false);
    const [userDetail,setUser] = useState({});
    const [cart, setCart] = useState(); // Mock cart data
      //const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' }); // Mock user session data
      const [grandTotal, setGrandTotal] = useState(0);
      const [paymentMethod, setPaymentMethod] = useState('');
      const [orderPlaced, setOrderPlaced] = useState(false);
    console.log(user)
   
    const startListening = () => {
        resetTranscript();
        setIsListening(true)
        SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
        setListeningForProduct(true);
        speak('Welcome to your cart. Please say the product name to start.');
      };
    
      const stopListening = () => {
        setIsListening(false)
        SpeechRecognition.stopListening();
        speak("Stopped listening.");
        speechSynthesis.cancel();
      };
      const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();
      const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
        //speechSynthesis.cancel();
      };
      
    
      const fetchCart = () => {
        if(user){
        try { 
          console.log("fetch");
          axios.get(`http://localhost:3001/fetchCart/${user}`)
          .then(res=>{console.log(res);
            console.log("cart",res.data);
            setCart(res.data);})
         .catch(err=>console.log(err))
          
        } catch (error) {
          console.error("Error fetching Cart Products:", error);
          speak("Error fetching cart Products. Please try again later.");
        }
        }
      };
      const fetchUser = () => {
        if(user){
        try { 
          console.log("fetch User");
          axios.get('http://localhost:3001/getuser',{params: {name:user}})
          .then(response =>{console.log("user",response.data);
            setUser(response.data.detail);})
          
        } catch (error) {
          console.error("Error fetching Cart Products:", error);
          speak("Error fetching cart Products. Please try again later.");
        }
        }
      };
      useEffect(()=>{
        fetchUser();
        fetchCart();
        
      },[])
      fetchUser();
      fetchCart();
     
      useEffect(() => {
        // Calculate the grand total
        const total = cart.reduce((acc, item) => acc + item.totalPrice, 0);
        setGrandTotal(total);
      }, [cart]);
    
      const handlePlaceOrder = () => {
        if (!paymentMethod) {
          alert('Please select a payment method.');
          return;
        }
        setOrderPlaced(true);
      };
    
      const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
      };
    
    return(
        <>
      <Header
    isListening={isListening}
    startListening={startListening}
    stopListening={stopListening}
  />
  <ToastContainer/>
  <div className="ch-container">
      <h2 className="ch-title">Checkout</h2>
      
      <div className="ch-cart-summary">
        <h3>Products in Cart</h3>
        <table className="ch-cart-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ch-grand-total">
          <strong>Grand Total: ${grandTotal}</strong>
        </div>
      </div>

      <div className="ch-user-details">
        <h3>User Details</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>

      {!orderPlaced ? (
        <div className="ch-order-form">
          <h3>Select Payment Method</h3>
          <label>
            <input 
              type="radio" 
              value="Cash on Delivery" 
              checked={paymentMethod === 'Cash on Delivery'} 
              onChange={handlePaymentChange} 
            /> Cash on Delivery
          </label>
          <label>
            <input 
              type="radio" 
              value="Pay Online" 
              checked={paymentMethod === 'Pay Online'} 
              onChange={handlePaymentChange} 
            /> Pay Online
          </label>
          <div className="ch-order-buttons">
            <button className="ch-back-button">Back to Cart</button>
            <button className="ch-place-order-button" onClick={handlePlaceOrder}>Place Order</button>
          </div>
        </div>
      ) : (
        <div className="ch-popup">
          <h2>Order Placed Successfully!</h2>
          <p>Your order will be processed shortly.</p>
        </div>
      )}
    </div>
        </>
    )

}

export default Checkout;
