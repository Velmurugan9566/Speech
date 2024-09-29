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
   if(user){
    const [isListening, setIsListening] = useState(false);
    const [userDetail,setUser] = useState({});
    const [cart, setCart] = useState([]); // Mock cart data
      const [grandTotal, setGrandTotal] = useState(0);
      const [paymentMethod, setPaymentMethod] = useState('');
      const [orderPlaced, setOrderPlaced] = useState(false);
      const [orderMethod,setOrderMethod] = useState('')
      const[waitingOrderMethod,setWaitingOrderMethod]=useState(true);
      const [waitingPaymentMethod,setWaitingPaymentMethod] =useState(false);
      const navigate = useNavigate();
   
    const startListening = () => {
        resetTranscript();
        setIsListening(true)
        SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
        speak('Welcome to checkout page. choose the options..');
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
      useEffect(() => {
        if (!transcript) return;
        const lowerTranscript = transcript.trim().toLowerCase();
      
        // Handling core commands
        const handleCoreCommands = (transcript) => {
          if (/stop/.test(lowerTranscript)) {
            stopListening();
            return true;
          }
          if (/home/.test(lowerTranscript)) {
            resetTranscript();
            speak("Navigating to Exploring Page");
            navigate("/home");
            return true;
          }
          if (/explore/.test(lowerTranscript)) {
            resetTranscript();
            speak("Navigating to Exploring Page");
            navigate("/product");
            return true;
          }
          if (/back/.test(lowerTranscript)) {
            resetTranscript();
            speak("Navigating to cart Page");
            navigate(-1);
            return true;
          }
          return false;
        };
        if (handleCoreCommands(transcript)) return;
    // Handle product name input with fuzzy matching
    const handleOrderInput = (method) => {
      //console.log("from fun",productName)

      if (/home delivery/.test(method)) {
        resetTranscript();
        speak("you are selecting home delivery method");
        setOrderMethod("Home Delivery")
        setWaitingOrderMethod(false);
        setWaitingPaymentMethod(true);
        return
      }else if(/pickup shop/.test(method)){
        resetTranscript();
        speak("you are selecting pickup at shop method");
        setOrderMethod("Pickup at Shop")
        setWaitingOrderMethod(false);
        setWaitingPaymentMethod(true);
        return
      }else{
        resetTranscript();
        speak("please repeat the method");
      }
      return
    };
  
    // Handle quantity input, validate, and add to cart
    const handlePaymentInput = (mode) => {
      if (/cashon delivery/.test(mode)) {
        resetTranscript();
        setPaymentMethod("Cash on Delivery")
        speak("you are selecting cash on delivery method");
        setWaitingPaymentMethod(false);
        return
      }else if(/online/.test(mode)){
        resetTranscript();
        setPaymentMethod("Pay Online")
        speak("you are selecting online payment method");
        setWaitingPaymentMethod(false);
        return
      }else{
        resetTranscript();
        speak("Please repeat the payment method..");
        return
      }
      
    };
  
    // Waiting for the product name to add or remove items
    if (waitingOrderMethod) {
      const timer = setTimeout(() => {
          speak("Select the order Method . Home Delivery or Pickup from Shop..")
          handleOrderInput(lowerTranscript);
        resetTranscript();
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  
    // Waiting for the quantity to add to cart
    if (waitingPaymentMethod) {
        speak("Select the Payment the Method.. Online or cash on delivery..")
        const timer = setTimeout(() => {
        handlePaymentInput(lowerTranscript);
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  
    // General product input if no special commands are issued
    const timer = setTimeout(() => {
       
    }, 3000);
  
    return () => clearTimeout(timer);
  
  }, [transcript]);
    
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
          .then(response =>{
            console.log("user",response.data);
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
      useEffect(() => {
        // Calculate the grand total
        const total = cart.reduce((acc, item) => acc + item.totalPrice, 0);
        setGrandTotal(total.toFixed(2));
      }, [cart]);
    
      const handlePlaceOrder = () => {
        if (!paymentMethod && !orderMethod) {
          toast.warning("Please Select the order Method and Delivery Method")
          speak("Please Select the order Method and Delivery Method")
          return;
        }else{
          console.log(paymentMethod,orderMethod)
          placeOrder();
          //toast.success("order Placed successfully")
        }
        //setOrderPlaced(true);
      };
    
      const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
      };
      const handleDeliveryChange=(e)=>{
        setOrderMethod(e.target.value);
      }
// Function to place an order
const placeOrder = async () => {
  try {
    const response = await axios.post('http://localhost:3001/placeOrder', {
      user,
      cart,
      paymentMethod,
      orderMethod,
      grandTotal
    });
    if (response.status === 200) {
      toast.success("Order placed successfully")
    } else {
      toast.warning('Failed to place the order')
    }
  } catch (error) {
    console.error('There was an error placing the order', error);
  }
};

    return(
        <>
        {user ? (
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
              <th>S.No</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{item.proname}</td>
                <td>{item.quantity}</td>
                <td>Rs.{item.price}</td>
                <td>Rs.{item.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ch-grand-total">
          <strong>Grand Total: Rs.{grandTotal}</strong>
        </div>
      </div>

      <div className="ch-user-details">
        <h3>User Details</h3>
        <p>Name: {userDetail.name}</p>
        <p>Email: {userDetail.email}</p>
      </div>

      {!orderPlaced ? (
        <div className="ch-order-form">
          <h3>Select Delivery Method</h3>
          <select name='deliveryMode' onChange={handleDeliveryChange}>
            <option disabled>Select Method</option>
            <option value='Pickup at Shop'>Pickup at Shop</option>
            <option value='Home Delivery'>Home Delivery</option>
          </select>
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
            <button className="ch-back-button"><Link to='/cart' id='link'>Back to Cart</Link></button>
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
    </> ) : (
      <h2>User Not login Please <Link to='/login'>Login</Link> first</h2>
    )}
        </>
    )
   }else{
    return(
      <h2 className='loginerror'>User Not login Please <Link to='/login'>Login</Link> first</h2>
    )
   }
}

export default Checkout;
