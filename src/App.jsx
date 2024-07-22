import { useState } from 'react'
import './App.css'
import axios from 'axios'
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Product from "./pages/Product";
import Home from "./pages/Homee.jsx";
import Cart from "./pages/Cart.jsx";

import 'regenerator-runtime/runtime';
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/product' element={<Product />} ></Route>
         <Route path='/cart' element={<Cart/>}></Route>
         <Route path='/' element={<Home/>} ></Route>
         
        
      </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
