/*import React, { useState, useEffect } from "react";
//import "./App.css";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { TiMicrophoneOutline } from "react-icons/ti";
import { IoStopCircleOutline } from "react-icons/io5";
import { MdLockReset } from "react-icons/md";
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const predefinedProducts = ["apple 500g","apple 600g", "banana 250g", "orange 250g", "milk", "bread jam", "chocolate", "toothpaste colcate", "shampoo"];

function Cart() {
  const [cart, setCart] = useState([]);
  const [listeningForProduct, setListeningForProduct] = useState(true);
  const [currentProduct, setCurrentProduct] = useState("");
  const [waitingForQuantity, setWaitingForQuantity] = useState(false);

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    speak("Please say the product name.");
  }

  const stopListening = () => {
    SpeechRecognition.stopListening();
    speak("Stopped listening.");
  }

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!transcript) return;

    if (transcript.trim().toLowerCase() === "stop") {
      stopListening();
      return;
    }
    if (transcript.trim().toLowerCase() === "reset") {
       resetTranscript()
      setCart([]);
      speak('cart is empty..');
      return;
    }


    if (waitingForQuantity) {
      const timer = setTimeout(() => {
        addToCart(currentProduct, transcript);
        setCurrentProduct("");
        setListeningForProduct(true);
        setWaitingForQuantity(false);
        resetTranscript();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        handleProductInput(transcript);
        resetTranscript();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'transcript.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
  function reset(){
    resetTranscript();
    setCart([]);
    speak('cart is empty..');
  }
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleProductInput = (input) => {
    const product = input.trim().toLowerCase();
    const matchedProducts = predefinedProducts.filter(p => p.includes(product));

    if (matchedProducts.length === 1) {
      setCurrentProduct(matchedProducts[0]);
      setListeningForProduct(false);
      setWaitingForQuantity(true);
      speak(`You said ${matchedProducts[0]}. Please specify the quantity.`);
      resetTranscript();
    } else if (matchedProducts.length > 1) {
      speak(`Multiple products found: ${matchedProducts.join(", ")}. Please say the full product name.`);
      resetTranscript();
    } else {
      speak("Product not available. Please say the product name again.");
      resetTranscript();
    }
  };

  const addToCart = (product, quantity) => {
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      speak("Invalid quantity. Please try again.");
      return;
    }

    setCart((prevCart) => [...prevCart, { product, quantity: parsedQuantity }]);
    speak(`Added ${parsedQuantity} of ${product} to cart. Please say the next product name.`);
  };

  return (
    <>
      <h1 className="heading">Voice Shopping Cart</h1>
      <div className="input_box">
        <p className="input_box--text">{transcript}</p>
      </div>
      <div className="card">
        <button onClick={startListening} area-label="start Listening">
          <TiMicrophoneOutline size="20px" />
        </button>
        <button onClick={stopListening} area-label="stop listening">
          <IoStopCircleOutline size="20px" />
        </button>
        <button onClick={downloadTranscript} area-label="download transcript">
          <IoCloudDownloadOutline size="20px" />
        </button>
        <button onClick={reset} area-label="reset transcript">
          <MdLockReset size="20px" />
        </button>
      </div>
      <h2>Shopping Cart</h2>
       
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.product} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Cart;
*/
import React, { useState, useEffect } from "react";
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import "../style/CartStyle.css"
import Header from './UserHeader'
import { FaUser, FaShoppingCart,FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import generatePDF from './Printpage';

const Cart = () => {
  //const [cart, setCart] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(sessionStorage.getItem('cart')) || []);
  const [listeningForProduct, setListeningForProduct] = useState(true);
  const [currentProduct, setCurrentProduct] = useState("");
  const [waitingForQuantity, setWaitingForQuantity] = useState(false);
  const [waitingForProductName, setWaitingForProductName] = useState(false);
  const [products, setProducts] = useState([]);
  const [command, setCommand] = useState("");
  const [isListening, setIsListening] = useState(false);
  const user = sessionStorage.getItem('userid') || ''; 
  const [shouldUpdateCart,setShouldUpdateCart] = useState(false);
  const navigate = useNavigate();
  const [addQuan,setAddQuan] = useState(0)
  const [lowStock,setLowStock] = useState(false);

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
  const fetchCart = async () => {
    if(user){
    try { 
      console.log("fetch");
      const response = await axios.get(`http://localhost:3001/fetchCart/${user}`);
      console.log(response.data);
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching Cart Products:", error);
      speak("Error fetching cart Products. Please try again later.");
    }
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
 
    fetchCart();
  }, []);
  useEffect(() => {
    if (!transcript) return;
    const lowerTranscript = transcript.trim().toLowerCase();
  
    // Handling core commands
    const handleCoreCommands = (transcript) => {
      if (/stop/.test(lowerTranscript)) {
        stopListening();
        return true;
      }
      if (/reset/.test(lowerTranscript)) {
        resetTranscript();
        setCart([]);
        speak('Cart is now empty.');
        return true;
      }
      if (/explore/.test(lowerTranscript)) {
        resetTranscript();
        speak("Navigating to Exploring Page");
        navigate("/product");
        return true;
      }
      if (/print bill/.test(lowerTranscript)) {
        resetTranscript();
        if(cart.length >0){
          generatePDF(cart);
          speak('Your bill is ready to download..')
        }else{
          speak('Cart is now empty. you CANNOT Print Bill..');
        }
        return true;
      }
      if (/checkout/.test(lowerTranscript)) {
        resetTranscript();
        checkOut()
        return true;
      }
      if (/preview cart/.test(lowerTranscript)) {
        resetTranscript();
        previewCart()
      }
      return false;
    };
  
    // Check for core commands first
    if (handleCoreCommands(transcript)) return;
  
    // Back command to go back to the previous step
    if (/back/.test(lowerTranscript)) {
      if (waitingForQuantity) {
        speak('Going back to product selection.');
        setWaitingForQuantity(false);
        setListeningForProduct(true);
      } else if (waitingForProductName) {
        speak('Going back to main command.');
        setWaitingForProductName(false);
        setListeningForProduct(true);
      } else {
        speak('Already in main command.');
      }
      resetTranscript();
      return;
    }
  
    if (lowerTranscript === "remove") {
      setCommand("remove");
      speak("Please say the product name to remove.");
      setWaitingForProductName(true);
      resetTranscript();
      return;
    }
  
    if (lowerTranscript === "add quantity") {
      setCommand("addQuantity");
      speak("Please say the product name to add quantity.");
      setAddQuan(1);
      setWaitingForProductName(true);
      resetTranscript();
      return;
    }
  
    // Handle product name input with fuzzy matching
    const handleProductInput = (productName) => {
      //console.log("from fun",productName)

      const matchingProducts = findSimilarProducts(productName,addQuan);
      if (matchingProducts.length === 0) {
        speak("Product not available. Please say the product name again.");
      } else if (matchingProducts.length === 1) {
        const foundProduct = matchingProducts[0];
        setCurrentProduct(foundProduct)
        speak(`You have selected ${foundProduct.proname}. How many would you like to add?`);
        setWaitingForQuantity(true);
        setListeningForProduct(false);
      } else {
        speakOptions(matchingProducts.map(product => product.proname));
        //speak(`We found multiple matches for ${productName}: ${matchingProducts.join(", ")}. Please repeat the product name.`);
      }
      resetTranscript();
    };
  
    // Handle quantity input, validate, and add to cart
    const handleQuantityInput = (quantity) => {
      const parsedQuantity = parseInt(quantity);
  
      if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        speak('Invalid quantity. Please say the quantity again.');
        resetTranscript();
        return;
      }
      const flag = addToCart(currentProduct, parsedQuantity);
      if(flag != 1){
        speak(`${parsedQuantity} items of ${currentProduct.proname} added to your cart.`);
        setCurrentProduct('');
        setWaitingForQuantity(false);
        setListeningForProduct(true);
        resetTranscript();
      }else{
        speak(' Please say the quantity again., or say "back" for Product Selection..');
        resetTranscript();
        return;
      }
      
    };
   const handleRemoveItem =(tran)=>{
    const lowerTranscript = tran.trim().toLowerCase();
    if(/yes/.test(lowerTranscript)){
      setLowStock(false)
      resetTranscript();
      speak("Item removed from your cart. now checkout")
      return;
      
    }else {
      setLowStock(false)
      resetTranscript();
      speak("Item removed from your cart. now checkout")
      return;
    }
   }
    // Waiting for the product name to add or remove items
    if (waitingForProductName) {
      const timer = setTimeout(() => {
        if (command === "remove") {
          const matchingProducts = findSimilarProducts(transcript);
          if (matchingProducts.length === 0) {
            speak("Product not found. Please try again.");
          } else if (matchingProducts.length === 1) {
            handleRemoveProduct(matchingProducts[0]);
            speak(`${matchingProducts[0]} removed from your cart.`);
          } else {
            speak(`We found multiple matches: ${matchingProducts.join(", ")}. Please select one.`);
          }
        } else {
          handleProductInput(transcript);
        }
        resetTranscript();
      }, 3000);
  
      return () => clearTimeout(timer);
    }
    if(lowStock){
      const timer = setTimeout(() => {
        handleRemoveItem(transcript);
      }, 3000);
      return () => clearTimeout(timer);
    }
    // Waiting for the quantity to add to cart
    if (waitingForQuantity) {
      const timer = setTimeout(() => {
        handleQuantityInput(transcript);
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  
    // General product input if no special commands are issued
    const timer = setTimeout(() => {
      handleProductInput(transcript);
    }, 3000);
  
    return () => clearTimeout(timer);
  
  }, [transcript,lowStock]);
  
  // Helper function to find similar products
  const findSimilarProducts = (productName,q=0) => {
    const lowerProductName = productName.trim().toLowerCase();
    //console.log(lowerProductName)
    if(q==1){
      return cart.filter(p => p.proname.toLowerCase().includes(lowerProductName))
    }
    return products.filter(p => p.proname.toLowerCase().includes(lowerProductName))
     
  };
  const speakOptions = (options) => {
    const optionsList = options.join(", ");
    speak(`There are multiple products available: ${optionsList}. Please select one.`);
  };
  

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
 

  const reset = () => {
    resetTranscript();
    setCart([]);
    speak('cart is empty..');
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
    //speechSynthesis.cancel();
  };

// Voice command handling for removing product
const handleRemoveProduct = async (input) => {
  const productName = input.trim().toLowerCase();
  
  // Filter only the products with a valid 'name' property
  const matchedProducts = cart.filter(p => p.proname && p.proname.toLowerCase().includes(productName));

  if (matchedProducts.length === 1) {
    // Remove the matched product from the cart
    // const updatedCart = cart.filter(item => item.proname && item.proname.toLowerCase() !== matchedProducts[0].proname.toLowerCase());
    // setCart(updatedCart);
    removeItemFromCart(matchedProducts[0].proname);
    //speak(`Removed ${matchedProducts[0].proname} from the cart.`);
    resetTranscript();
    setWaitingForProductName(false); // Go back to product listening
  } else if (matchedProducts.length > 1) {
    speak(`Multiple products found in the cart: ${matchedProducts.map(p => p.proname).join(", ")}. Please say the full product name.`);
    resetTranscript();
  } else {
    speak("Product not found in the cart. Please say the product name again.");
    resetTranscript();
  }
};


  const updateCartQuantity = async (input, quantity) => {
    const productName = input.trim().toLowerCase();
    const matchedProducts = cart.filter(p => p.proname.toLowerCase().includes(productName));

    if (matchedProducts.length === 1) {
      const response = await axios.get(`http://localhost:3001/product/${matchedProducts[0]._id}`);
      const product = response.data;
      const parsedQuantity = parseInt(quantity);

      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        speak("Invalid quantity. Please try again.");
        return;
      }

      if (parsedQuantity > product.quantity) {
        speak(`Only ${product.quantity} of ${product.proname} available. Please try again.`);
        return;
      }

      const updatedCart = cart.map(item => {
        if (item.proname.toLowerCase() === matchedProducts[0].proname.toLowerCase()) {
          return { ...item, quantity: parsedQuantity, price: product.price * parsedQuantity };
        }
        return item;
      });

      setCart(updatedCart);
      speak(`Updated quantity of ${product.proname} to ${parsedQuantity}.`);
      setCommand("");
      setWaitingForProductName(false);
      resetTranscript();
    } else if (matchedProducts.length > 1) {
      speak(`Multiple products found in cart: ${matchedProducts.map(p => p.proname).join(", ")}. Please say the full product name.`);
      resetTranscript();
    } else {
      speak("Product not found in the cart. Please say the product name again.");
      resetTranscript();
    }
  };

useEffect(()=>{
  if(shouldUpdateCart){
    UpdateCartItem();
    setShouldUpdateCart(false);
  }
},[shouldUpdateCart])
function UpdateCartItem(){
  //console.log("cart",cart);
  //console.log("jsonStrigify",JSON.stringify(cart))
  if(user){
    const email =user;
    const status =2;
    console.log("before send",cart)
    axios.put('http://localhost:3001/updateCart',{cart,email,status})
    .then(msg =>console.log(msg))
    .catch(err=>console.log(err))
  }else{
   sessionStorage.setItem('cart', JSON.stringify(cart));
   console.log("session Cart",JSON.parse(sessionStorage.getItem('cart')))
  }    
};

    
  const addToCart = (product, quantity) => {
  const discountedPrice = product.price * (1 - product.discount / 100);
  const additionalPrice = discountedPrice * quantity;
  const existingProductIndex = cart.findIndex(item => item.proname === product.proname);
  if(product.quantity < quantity){
    toast.info('Product out of stock')
    speak('Product out of stock');
    return 1;
  }
  if (existingProductIndex >= 0) {
    const updatedCart = [...cart];
    const existingProduct = updatedCart[existingProductIndex];
    if(existingProduct.quantity +quantity > product.quantity){
      toast.info('Product out of stock')
      speak('Product out of stock');
      return 1;
    }
    existingProduct.quantity += quantity;
    existingProduct.totalPrice = (parseFloat(existingProduct.totalPrice) + additionalPrice).toFixed(2);
    updatedCart[existingProductIndex] = existingProduct;
    
    setCart(updatedCart);
    console.log("Cart first update",cart);
    setShouldUpdateCart(true);
    setCommand("");
    setWaitingForProductName(false);
    resetTranscript();
    toast.success(`${quantity} more of ${product.proname} has been added to your cart. Total quantity is now ${existingProduct.quantity}.`)
    speak(`${quantity} more of ${product.proname} has been added to your cart. Total quantity is now ${existingProduct.quantity}.`);
  } else {
    // Product not in the cart, add as new entry
    const cartItem = { 
      ...product, 
      quantity, 
      totalPrice: additionalPrice.toFixed(2) 
    };
    
    setCart([...cart, cartItem]);
    console.log("Cart",cart);
    setShouldUpdateCart(true);
      setCommand("");
      setWaitingForProductName(false);
      resetTranscript();
    //UpdateCartItem();
    toast(`${quantity} of ${product.proname} has been added to your cart with a total price of Rs.${cartItem.totalPrice}.`)
    speak(`${quantity} of ${product.proname} has been added to your cart with a total price of Rupees.${cartItem.totalPrice}.`);
  }
    // //const response = axios.get(`http://localhost:3001/product/${productName}`);
    // const matchedProducts = products.filter(item => item.proname === productitem.proname);
    //   // const quantityMatch = quantity.match(/\d+/);
    //   // console.log(quantityMatch +"quantitymatch")
    //   // const quan = parseInt(quantityMatch[0], 10);
    //   // console.log("quantity"+quan)
    //   // const quantity = parseInt(quan);
    //   // console.log(quan);
    //   // if (isNaN(quantity) || parsedQuantity <= 0) {
    //   //   speak("Invalid quantity. Please try again.");
    //   //   return;
    //   // }
    //   console.log("matched Prod",matchedProducts)
    //   if (quantity > matchedProducts.quantity) {
    //     speak(`Only ${matchedProducts.quantity} of ${matchedProducts.proname} available. Please try again.`);
    //     return;
    //   }

    // const discountedPrice = matchedProducts.price * (1 - matchedProducts.discount / 100); // Apply discount
    // const additionalPrice = discountedPrice * quantity;
    // const existingProductIndex = cart.findIndex(item => item._id === matchedProducts._id); // Check if product already exists in cart
  
    // if (existingProductIndex >= 0) {
    //   const updatedCart = [...cart];
    //   const existingProduct = updatedCart[existingProductIndex];
  
    //   // Check if adding more exceeds available quantity
    //   if (existingProduct.quantity + quantity > matchedProducts.quantity) {
    //     speak('Product out of stock');
    //     return;
    //   }
  
    //   // Update quantity and total price
    //   existingProduct.quantity += quantity;
    //   existingProduct.totalPrice = (parseFloat(existingProduct.totalPrice) + additionalPrice).toFixed(2);
  
    //   updatedCart[existingProductIndex] = existingProduct;
  
    //   setCart(updatedCart);
    //   setShouldUpdateCart(true);
    //   setCommand("");
    //   setWaitingForProductName(false);
    //   resetTranscript();
    //   speak(`${quantity} more of ${matchedProducts.proname} has been added to your cart. Total quantity is now ${existingProduct.quantity}.`);
    // } else {
    //   // Add product to cart if not already in
    //   const cartItem = { 
    //     ...matchedProducts, 
    //     quantity, 
    //     totalPrice: additionalPrice.toFixed(2) 
    //   };
    //   console.log("cart Item",cartItem);
    //   setCart([...cart, cartItem]);
    //   setShouldUpdateCart(true);
    //   setCommand("");
    //   setWaitingForProductName(false);
    //   resetTranscript();
    //   speak(`${quantity} of ${matchedProducts.proname} has been added to your cart with a total price of $${cartItem.totalPrice}.`);
    // }
  };
 
  // Function to handle quantity changes
  const handleQuantityChange = (productId,change) => {
    const product = products.filter(p => p.proname === productId)
    const discountedPrice =product[0].price * (1 - product[0].discount / 100);
    const additionalPrice = discountedPrice * change;
    const existingProductIndex = cart.findIndex(item => item.proname === productId);
  if (existingProductIndex >= 0) {
    const updatedCart = [...cart];
    const existingProduct = updatedCart[existingProductIndex];
    if(existingProduct.quantity +change > product[0].quantity){
      toast.info('Product out of stock')
      speak('Product out of stock');
      return;
    }if(existingProduct.quantity+change < 1){
      toast.info("Minimum value is 1");
      return 1;
    }
    existingProduct.quantity += change;
    console.log((parseFloat(existingProduct.totalPrice) + additionalPrice).toFixed(2))
    existingProduct.totalPrice = (parseFloat(existingProduct.totalPrice) + additionalPrice).toFixed(2);
    updatedCart[existingProductIndex] = existingProduct;
    console.log(existingProduct)
    setCart(updatedCart);
    setShouldUpdateCart(true);
     }
    }

const removeItemFromCart=(n)=>{
    console.log("before",cart);
    if(user){
      const email =user;
      const status =2;
      console.log("before send",cart)
      axios.delete('http://localhost:3001/deleteCart', { 
        params: {
            email: email,
            n: n
        }
      })
      .then(response => {
        fetchCart();
        toast.success("Product deleted Successfully");
        speak("Prodcut deleted Successfully")
      })
      .catch(err => {toast.warning(err);speak(err);console.error(err)});
    
    }else{
      var temp = JSON.parse(sessionStorage.getItem('cart'))
      sessionStorage.setItem('cart', JSON.stringify(temp.filter(item => item.proname !== n)));
      setCart(JSON.parse(sessionStorage.getItem('cart')));
      toast.success("Product Deleted Successfully");
      speak(`Removed ${n} from your Cart..`);
    }
  }
  function checkOut(){
       if(user){
        const flag = hasLowStock
        console.log(flag)
        if(flag){
          speak("Some products has out of stock. so please remove first.")
          setLowStock(true);
        }else{
           speak("Navigating to CheckOut page..")
         navigate('/Checkout')
        }
       }else{
        speak("user not login please login to checkout");
        navigate('/Login')
       }
  }
  function previewCart(){
      if(cart.length>0){
        speak(`Total products in your cart is ${cart.length}`);
        for(item in cart){
           speak(`${item.quantity} item of ${item.proname} Total price is ${item.totalPrice}.`)
        }
        speak(`And the total amount of these items is Rupees. ${cart.reduce((acc, item) => acc + parseFloat(item.totalPrice), 0).toFixed(2)}`)
      }else{
        speak("Your Cart is Empty.")
      }
      return true
  }
  const hasLowStock = cart.some(item => {
    const productInStock = products.find(prod => prod.proname === item.proname);
    console.log("pro",productInStock);
    return productInStock && item.quantity > productInStock.quantity;
  });

  return (
    <>
  <Header
    isListening={isListening}
    startListening={startListening}
    stopListening={stopListening}
  />
  <ToastContainer/>
  <div className="pro-main-container">
  <div className="container">
  <div className="hp-textbox"> <input type='text' className='textp' placeholder='Transcript.....' value={transcript} readOnly></input><div className='svg'><FaMicrophone /></div> </div>
    
    <div>
      <h2>Shopping Cart</h2>
      <table cellPadding={10} className="pro-cart-table">
        <thead>
          <tr>
            <td>S.No.</td>
            <td>Product Name</td>
            <td>Quantity</td>
            <td>Discount</td>
            <td>Per Price</td>
            <td>Total Price</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (

            <tr key={index} style={products.filter(i=>i.proname== item.proname)[0].quantity < item.quantity ? { backgroundColor: 'red' } : {}}>
              <td>{index + 1}</td>
              <td>{item.proname}</td>
              <td className="pro-quantity-control">
              <button onClick={() => handleQuantityChange(item.proname,-1)}>-</button>
                          <input
                            type="text"
                            value={item.quantity|| 1}
                            readOnly
                            className="pro-quantity-box" />
                          <button onClick={() => handleQuantityChange(item.proname,1)}>+</button>
              </td>
              <td>{item.discount}%</td>
              <td>{item.price}</td>
              <td>{item.totalPrice}</td>
              <td>
                <button className="pro-remove-btn" onClick={() => removeItemFromCart(item.proname)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total-amount pro-total-amount">
        <h3>Total Amount: Rs. {cart.reduce((acc, item) => acc + parseFloat(item.totalPrice), 0).toFixed(2)}</h3>
        <button className="pro-print-btn" onClick={()=>{generatePDF(cart)}} aria-label="generate PDF">
          Print Bill
        </button>
        <button className="pro-print-btn" onClick={()=>{checkOut()}} aria-label="generate PDF">
         CheckOut
        </button>
      </div>
    </div>
  </div>
</div>
</>
  )  
};
export default Cart;
