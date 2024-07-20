import { useState } from 'react'
import './App.css'
import axios from 'axios'
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from "./pages/Homee.jsx";
import Cart from "./pages/Cart.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
         <Route path='/cart' element={<Cart/>}></Route>
         <Route path='/' element={<Home/>} ></Route>
         
      </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
