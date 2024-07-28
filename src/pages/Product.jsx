import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [listeningForCategory, setListeningForCategory] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [currentStep, setCurrentStep] = useState("category"); // category, product, quantity
  const [similarMatches, setSimilarMatches] = useState([]);
  const [awaitingSelection, setAwaitingSelection] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/categories');
        setCategories(response.data);
        speakCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        speak("Error fetching categories. Please try again later.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async (category) => {
    try {
      const response = await axios.get(`http://localhost:3001/products/${category}`);
      setProducts(response.data);
      speakProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      speak("Error fetching products. Please try again later.");
    }
  };

  const addToCart = (product, quantity) => {
    const cartItem = { ...product, quantity };
    setCart([...cart, cartItem]);
    speak(`${quantity} of ${product.proname} has been added to your cart.`);
  };

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!transcript) return;

    const processTranscript = () => {
      const lowerTranscript = transcript.trim().toLowerCase();

      if (awaitingSelection && similarMatches.length > 0) {
        const foundMatch = similarMatches.find(match => lowerTranscript.includes(match.toLowerCase()));
        if (foundMatch) {
          if (currentStep === "category") {
            setSelectedCategory(foundMatch);
            fetchProducts(foundMatch);
            setCurrentStep("product");
          } else if (currentStep === "product") {
            const foundProduct = products.find(product => product.proname.toLowerCase() === foundMatch.toLowerCase());
            speak(`How many ${foundProduct.proname} would you like to add to your cart?`);
            setCurrentStep("quantity");
          }
          setSimilarMatches([]);
          setAwaitingSelection(false);
          resetTranscript();
          return;
        } else {
          speak("No exact match found among the options. Please try again.");
          resetTranscript();
          speakOptions(similarMatches);
          return;
        }
      }

      if (currentStep === "category") {
        const matchedCategories = categories.filter(category => new RegExp(category.toLowerCase()).test(lowerTranscript));
        if (matchedCategories.length === 1) {
          setSelectedCategory(matchedCategories[0]);
          fetchProducts(matchedCategories[0]);
          setCurrentStep("product");
          resetTranscript();
        } else if (matchedCategories.length > 1) {
          setSimilarMatches(matchedCategories);
          setAwaitingSelection(true);
          speakOptions(matchedCategories);
          resetTranscript();
        } else {
          speak("Category not matched. Please try again.");
          resetTranscript();
          speakCategories(categories);
        }
      } else if (currentStep === "product") {
        const matchedProducts = products.filter(product => new RegExp(product.proname.toLowerCase()).test(lowerTranscript));
        if (matchedProducts.length === 1) {
          const foundProduct = matchedProducts[0];
          speak(`How many ${foundProduct.proname} would you like to add to your cart?`);
          setCurrentStep("quantity");
          resetTranscript();
        } else if (matchedProducts.length > 1) {
          setSimilarMatches(matchedProducts.map(product => product.proname));
          setAwaitingSelection(true);
          speakOptions(matchedProducts.map(product => product.proname));
          resetTranscript();
        } else {
          speak("Product not matched. Please try again.");
          resetTranscript();
          speakProducts(products);
        }
      } else if (currentStep === "quantity") {
        const quantityMatch = lowerTranscript.match(/\d+/);
        if (quantityMatch) {
          const quantity = parseInt(quantityMatch[0], 10);
          if (quantity > 0) {
            const foundProduct = products.find(product => lowerTranscript.includes(product.proname.toLowerCase()));
            if (foundProduct) {
              if (quantity <= foundProduct.quantity) {
                addToCart(foundProduct, quantity);
                setCurrentStep("product");
                speak("You can now add another product or say 'back' to choose a different category.");
              } else {
                speak(`Only ${foundProduct.quantity} units available. Please specify a quantity up to ${foundProduct.quantity}.`);
              }
              resetTranscript();
            }
          }
        }
      }

      if (lowerTranscript.includes("repeat products")) {
        speakProducts(products);
      }

      if (lowerTranscript.includes("back")) {
        setSelectedCategory("");
        setCurrentStep("category");
        speakCategories(categories);
        resetTranscript();
      }

      if (lowerTranscript.includes("stop")) {
        stopListening();
      }
    };

    const timeoutId = setTimeout(processTranscript, 3000); // 3 seconds delay

    return () => clearTimeout(timeoutId);
  }, [transcript, categories, products, currentStep, similarMatches, awaitingSelection]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const startListening = () => {
    resetTranscript();
    setListeningForCategory(true);
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    speak("Voice command started. Please say a category name.");
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    speak("Voice command stopped.");
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const speakCategories = (categories) => {
    const categoriesText = categories.map(category => category).join(", ");
    speak(`Available categories are: ${categoriesText}. Please select one.`);
  };

  const speakProducts = (products) => {
    const productsText = products.map(product => `${product.proname} at ${product.price} rupees`).join(", ");
    speak(`Available products are: ${productsText}. Please select one.`);
  };

  const speakOptions = (options) => {
    const optionsText = options.join(", ");
    speak(`Multiple matches found: ${optionsText}. Please select one.`);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Supermarket</h1>
        <button onClick={isListening ? stopListening : startListening}>
          {isListening ? 'Stop Voice Command' : 'Start Voice Command'}
        </button>
      </header>
      <main>
        <div className="transcript-box">
          <p>{transcript}</p>
        </div>
        {selectedCategory ? (
          <>
            <h2>Products in {selectedCategory}</h2>
            <ul>
              {products.map(product => (
                <li key={product._id}>
                  {product.proname} - ${product.price}
                  <button onClick={() => speak(`How many ${product.proname} would you like to add to your cart?`)}>Add to Cart</button>
                </li>
              ))}
            </ul>
            <button onClick={() => {
              setSelectedCategory("");
              setListeningForCategory(true);
              setCurrentStep("category");
              resetTranscript();
              speakCategories(categories);
            }}>Back to Categories</button>
          </>
        ) : (
          <>
            <h2>Categories</h2>
            <ul type='circle'>
              {categories.map((category, index) => (
                <li key={index}>
                  {category}
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
      <footer>
        <h2>Shopping Cart</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>{item.proname} - ${item.price} - Quantity: {item.quantity}</li>
          ))}
        </ul>
      </footer>
    </div>
  );
}

export default App;
