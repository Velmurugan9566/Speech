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
import { IoCloudDownloadOutline } from "react-icons/io5";
import { TiMicrophoneOutline } from "react-icons/ti";
import { IoStopCircleOutline } from "react-icons/io5";
import { MdLockReset } from "react-icons/md";
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import { jsPDF } from "jspdf";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [listeningForProduct, setListeningForProduct] = useState(true);
  const [currentProduct, setCurrentProduct] = useState("");
  const [waitingForQuantity, setWaitingForQuantity] = useState(false);
  const [waitingForProductName, setWaitingForProductName] = useState(false);
  const [products, setProducts] = useState([]);
  const [command, setCommand] = useState("");

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    speak("Please say the product name.");
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    speak("Stopped listening.");
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

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'transcript.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const reset = () => {
    resetTranscript();
    setCart([]);
    speak('cart is empty..');
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
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

  const addToCart = async (productName, quantity) => {
    try {
      const response = await axios.get(`http://localhost:3001/product/${productName}`);
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

      setCart((prevCart) => [...prevCart, { name: product.proname, quantity: parsedQuantity, price: product.price * parsedQuantity }]);
      speak(`Added ${parsedQuantity} of ${product.proname} to cart. Please say the next product name.`);
    } catch (error) {
      speak("Error adding product to cart. Please try again.");
      console.error("Error adding product to cart:", error);
    }
  };

  const handleRemoveProduct = async (input) => {
    const productName = input.trim().toLowerCase();
    const matchedProducts = cart.filter(p => p.name.toLowerCase().includes(productName));

    if (matchedProducts.length === 1) {
      const updatedCart = cart.filter(item => item.name.toLowerCase() !== matchedProducts[0].name.toLowerCase());
      setCart(updatedCart);
      speak(`Removed ${matchedProducts[0].name} from the cart.`);
      setCommand("");
      setWaitingForProductName(false);
      resetTranscript();
    } else if (matchedProducts.length > 1) {
      speak(`Multiple products found in cart: ${matchedProducts.map(p => p.name).join(", ")}. Please say the full product name.`);
      resetTranscript();
    } else {
      speak("Product not found in the cart. Please say the product name again.");
      resetTranscript();
    }
  };

  const updateCartQuantity = async (input, quantity) => {
    const productName = input.trim().toLowerCase();
    const matchedProducts = cart.filter(p => p.name.toLowerCase().includes(productName));

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
        if (item.name.toLowerCase() === matchedProducts[0].name.toLowerCase()) {
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
      speak(`Multiple products found in cart: ${matchedProducts.map(p => p.name).join(", ")}. Please say the full product name.`);
      resetTranscript();
    } else {
      speak("Product not found in the cart. Please say the product name again.");
      resetTranscript();
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Shopping Cart", 20, 10);
    let y = 20;
    let totalPrice = 0;

    cart.forEach(item => {
      doc.text(`Product: ${item.name}`, 20, y);
      doc.text(`Price: ${item.price / item.quantity}`, 20, y + 10);
      doc.text(`Quantity: ${item.quantity}`, 20, y + 20);
      doc.text(`Total: ${item.price}`, 20, y + 30);
      y += 40;
      totalPrice += item.price;
    });

    doc.text(`Total Price: ${totalPrice}`, 20, y);

    doc.save("shopping_cart.pdf");
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
        <button onClick={generatePDF} area-label="generate PDF">
          Generate PDF
        </button>
      </div>
      <h2>Shopping Cart</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.name} - {item.quantity} @ {item.price / item.quantity} = {item.price}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Cart;
