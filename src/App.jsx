import React, { useState, useEffect } from "react";
import "./App.css";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { TiMicrophoneOutline } from "react-icons/ti";
import { IoStopCircleOutline } from "react-icons/io5";
import { MdLockReset } from "react-icons/md";
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const predefinedProducts = ["apple 500g","apple 600g", "banana 250g", "orange 250g", "milk", "bread jam", "chocolate", "toothpaste colcate", "shampoo"];

function App() {
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

export default App;
