import { useState } from 'react'
import './App.css'
import axios from 'axios'
import { BrowserRouter,Route,Routes} from 'react-router-dom';
import Product from "./pages/Product";
import Home from "./pages/Homee.jsx";
import Cart from "./pages/Cart.jsx";
import Admin from "./pages/Admin.jsx";
import AdminDash from "./pages/AdminDash.jsx";
import Addproduct from "./pages/Addproduct.jsx";
import ViewProducts from "./pages/ViewProduct.jsx"
import 'regenerator-runtime/runtime';
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/product' element={<Product />} ></Route>
         <Route path='/cart' element={<Cart/>}></Route>
         <Route path='/' element={<Home/>} ></Route>
         <Route path='/Admin' element={<Admin/>} ></Route>
         <Route path='/DashBoard' element={<AdminDash/>}></Route>
         <Route path='/DashBoard/Addproduct' element={<Addproduct/>}></Route>
         <Route path='/DashBoard/ViewProduct' element={<ViewProducts/>}></Route>
      </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
