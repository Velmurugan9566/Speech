import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";


function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState([]);

  
    


  function fetchCategory(){
      axios.get('http://localhost:3001/categories')
      .then(res=> {setCategories(res.data)})
      //console.log(categories);
      .catch(err=> {cosole.log(err)})
  }
  fetchCategory();
  const fetchProducts = async (category) => {
    try {
      const response = await axios.get(`http://localhost:3001/products/${category}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();


  
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  }

  const stopListening = () => SpeechRecognition.stopListening();

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Supermarket</h1>
        <button onClick={startListening}>Start Voice Command</button>
        <button onClick={stopListening}>Stop Voice Command</button>
      </header>
      <main>
        {selectedCategory ? (
          <>
            <h2>Products in {selectedCategory}</h2>
            <ul>
              {products.map(product => (
                <li key={product._id}>
                  {product.name} - ${product.price}
                  <button onClick={() => addToCart(product)}>Add to Cart</button>
                </li>
              ))}
            </ul>
            <button onClick={() => setSelectedCategory("")}>Back to Categories</button>
          </>
        ) : (
          <>
            <h2>Categories</h2>
            <ul>
              {categories.map(category => (
                <li key={category._id}>
                  {category.name}
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
            <li key={index}>{item.name} - ${item.price}</li>
          ))}
        </ul>
      </footer>
    </div>
  );
}

export default App;
