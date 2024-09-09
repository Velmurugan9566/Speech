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

const Cart = () => {
  //const [cart, setCart] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [listeningForProduct, setListeningForProduct] = useState(true);
  const [currentProduct, setCurrentProduct] = useState("");
  const [waitingForQuantity, setWaitingForQuantity] = useState(false);
  const [waitingForProductName, setWaitingForProductName] = useState(false);
  const [products, setProducts] = useState([]);
  const [command, setCommand] = useState("");
  const [isListening, setIsListening] = useState(false);
  const startListening = () => {
    resetTranscript();
    setIsListening(true)
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    speak("Please say the product name.");
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
  }, []);

  useEffect(() => {
    if (!transcript) return;

    const lowerTranscript = transcript.trim().toLowerCase();

    if (lowerTranscript === "stop") {
      stopListening();
      return;
    }
    if (lowerTranscript === "reset") {
      resetTranscript();
      setCart([]);
      speak('cart is empty..');
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
      setWaitingForProductName(true);
      resetTranscript();
      return;
    }

    if (waitingForQuantity) {
      const timer = setTimeout(() => {
        if (command === "addQuantity") {
          updateCartQuantity(currentProduct, transcript);
        } else {
          addToCart(currentProduct, transcript);
        }
        setCurrentProduct("");
        setListeningForProduct(true);
        setWaitingForQuantity(false);
        resetTranscript();
      }, 5000);

      return () => clearTimeout(timer);
    } else if (waitingForProductName) {
      const timer = setTimeout(() => {
        if (command === "remove") {
          handleRemoveProduct(transcript);
        } else {
          handleProductInput(transcript);
        }
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
  useEffect(() => {
    // Stop speaking when the component unmounts (e.g., navigating to a new page)
    return () => {
      //speechSynthesis.cancel();
    };
  }, []);

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

  const handleProductInput = async (input) => {
    const productName = input.trim().toLowerCase();
    const matchedProducts = products.filter(p => p.proname.includes(productName));

    if (matchedProducts.length === 1) {
      setCurrentProduct(matchedProducts[0]._id);
      setListeningForProduct(false);
      setWaitingForQuantity(true);
      speak(`You said ${matchedProducts[0].proname}. Please specify the quantity.`);
      resetTranscript();
    } else if (matchedProducts.length > 1) {
      speak(`Multiple products found: ${matchedProducts.map(p => p.proname).join(", ")}. Please say the full product name.`);
      resetTranscript();
    } else {
      speak("Product not available. Please say the product name again.");
      resetTranscript();
    }
  };

  // const addToCart = async (productName, quantity) => {
  //   try {
  //     const response = await axios.get(`http://localhost:3001/product/${productName}`);
  //     const product = response.data;
  //     const parsedQuantity = parseInt(quantity);

  //     if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
  //       speak("Invalid quantity. Please try again.");
  //       return;
  //     }

  //     if (parsedQuantity > product.quantity) {
  //       speak(`Only ${product.quantity} of ${product.proname} available. Please try again.`);
  //       return;
  //     }

  //     setCart((prevCart) => [...prevCart, { name: product.proname, quantity: parsedQuantity, price: product.price * parsedQuantity }]);
  //     speak(`Added ${parsedQuantity} of ${product.proname} to cart. Please say the next product name.`);
  //   } catch (error) {
  //     speak("Error adding product to cart. Please try again.");
  //     console.error("Error adding product to cart:", error);
  //   }
  // };
// Voice command handling for removing product
const handleRemoveProduct = async (input) => {
  const productName = input.trim().toLowerCase();
  
  // Filter only the products with a valid 'name' property
  const matchedProducts = cart.filter(p => p.proname && p.proname.toLowerCase().includes(productName));

  if (matchedProducts.length === 1) {
    // Remove the matched product from the cart
    const updatedCart = cart.filter(item => item.proname && item.proname.toLowerCase() !== matchedProducts[0].proname.toLowerCase());
    setCart(updatedCart);
    speak(`Removed ${matchedProducts[0].proname} from the cart.`);
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

 // Import autoTable plugin

const generatePDF = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Shopping Cart Bill", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  // Date and Time
  const currentDate = new Date().toLocaleString();
  doc.setFontSize(12);
  doc.text(`Date: ${currentDate}`, 10, 30); // Left aligned

  // Table headers
  const headers = [["S.No.", "Product Name", "Quantity", "Price", "Total"]];

  // Table body (product details)
  const data = cart.map((item, index) => [
    index + 1,
    item.proname,
    item.quantity,
    parseFloat(item.price).toFixed(2), // Ensure price is a number
    parseFloat(item.totalPrice || 0).toFixed(2) // Ensure totalPrice is a number and fallback to 0 if undefined
  ]);

  // Draw the table
  doc.autoTable({
    head: headers,
    body: data,
    startY: 40, // Start after the Date
    theme: 'grid', // Adds borders around the cells
    styles: {
      halign: 'center', // Center align text
      cellPadding: 3,
    },
    headStyles: { fillColor: [71, 103, 154] }, // Header background color
    bodyStyles: { valign: 'middle' }, // Vertically align text to the middle
    columnStyles: {
      0: { cellWidth: 15 },  // S.No.
      1: { cellWidth: 80 },  // Product Name
      2: { cellWidth: 30 },  // Quantity
      3: { cellWidth: 30 },  // Price
      4: { cellWidth: 30 },  // Total Price
    },
  });

  // Calculate total price
  const totalPrice = cart.reduce((acc, item) => acc + parseFloat(item.totalPrice || 0), 0).toFixed(2);

  // Add total amount at the end of the table
  const finalY = doc.lastAutoTable.finalY + 10; // Position after the table
  doc.setFontSize(14);
  doc.text(`Total Amount: Rs. ${totalPrice}`, 10, finalY);

  // Add footer (thank you message)
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(12);
  doc.text("Thank you for purchasing!", doc.internal.pageSize.getWidth() / 2, pageHeight - 10, { align: 'center' });

  // Save the PDF
  doc.save("shopping-cart-bill.pdf");
};

    
  const addToCart = (productName, quantity) => {
    const response = axios.get(`http://localhost:3001/product/${productName}`);
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

    const discountedPrice = product.price * (1 - product.discount / 100); // Apply discount
    const additionalPrice = discountedPrice * quantity;
    const existingProductIndex = cart.findIndex(item => item._id === product._id); // Check if product already exists in cart
  
    if (existingProductIndex >= 0) {
      const updatedCart = [...cart];
      const existingProduct = updatedCart[existingProductIndex];
  
      // Check if adding more exceeds available quantity
      if (existingProduct.quantity + quantity > product.quantity) {
        speak('Product out of stock');
        return;
      }
  
      // Update quantity and total price
      existingProduct.quantity += quantity;
      existingProduct.totalPrice = (parseFloat(existingProduct.totalPrice) + additionalPrice).toFixed(2);
  
      updatedCart[existingProductIndex] = existingProduct;
  
      setCart(updatedCart);
  
      speak(`${quantity} more of ${product.proname} has been added to your cart. Total quantity is now ${existingProduct.quantity}.`);
    } else {
      // Add product to cart if not already in
      const cartItem = { 
        ...product, 
        quantity, 
        totalPrice: additionalPrice.toFixed(2) 
      };
  
      setCart([...cart, cartItem]);
  
      speak(`${quantity} of ${product.proname} has been added to your cart with a total price of $${cartItem.totalPrice}.`);
    }
  };
  
const [quantities, setQuantities] = useState({});
const handleQuantityChange = (productId, change) => {
  setQuantities((prevQuantities) => {
    const newQuantity = (prevQuantities[productId] || 1) + change;
    const product = products.find(p => p._id === productId);
    
    if (!product) return prevQuantities; // Ensure the product exists

    return {
      ...prevQuantities,
      [productId]: Math.max(1, Math.min(newQuantity, product.quantity)), // Ensure quantity doesn't exceed available stock
    };
  });
};

// Function to calculate the total price per product
const calculateTotalPrice = (price, discount, quantity) => {
  const discountedPrice = price * (1 - discount / 100);
  return (discountedPrice * quantity).toFixed(2);
};


  return (
    <div className="main-container">
      <Header
        isListening={isListening}
        startListening={startListening}
        stopListening={stopListening}
      />
      <div className="container">
        <div className="listening-section">
          <input type="text" value={transcript} readOnly className="transcript-box" />
          <input type="text" placeholder="Search for products..." className="search-box" />
        </div>
        <div className="product-list-section">
          <h2>Products</h2>
          <ul className="product-list">
            {products.map((product,index) => (
              <li key={index}>{product.proname}</li>
            ))}
          </ul>
        </div><div>
  <h2>Shopping Cart</h2>
  <table cellPadding={10}>
    <thead>
      <tr>
        <td>S.No.</td>
        <td>Product Name</td>
        <td>Quantity</td>
        <td>Discount</td>
        <td>Per Price</td>
        <td>Total Price</td>
      </tr>
    </thead>
    <tbody>
      {cart.map((item, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.proname}</td>
          <td>
            <button onClick={() => handleQuantityChange(item._id, -1)}>-</button>
            {quantities[item._id] || item.quantity}
            <button onClick={() => handleQuantityChange(item._id, 1)}>+</button>
          </td>
          <td>{item.discount}%</td>
          <td>{item.price}</td>
          <td>
            {calculateTotalPrice(item.price, item.discount, quantities[item._id] || item.quantity)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <div className="total-amount">
    <h3>Total Amount: Rs. {cart.reduce((acc, item) => acc + parseFloat(item.totalPrice), 0)}</h3>
    <button onClick={generatePDF} area-label="generate PDF">
      Print Bill
    </button>
  </div>
</div>
      </div>
    </div>
  );
};
export default Cart;
