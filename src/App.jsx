import { useState } from 'react'

import axios from 'axios'

import { BrowserRouter,Route,Routes} from 'react-router-dom';
import Product from "./pages/Product";
import Home from "./pages/Homee.jsx";
import Cart from "./pages/Cart.jsx";
import Admin from "./pages/Admin.jsx";
import AdminDash from "./pages/AdminDash.jsx";
import Addproduct from "./pages/Addproduct.jsx";
import ViewProducts from "./pages/ViewProduct.jsx"
import ViewTransaction from "./pages/ViewTransaction.jsx";
import UpdateProduct from "./pages/UpdateProduct.jsx"
import 'regenerator-runtime/runtime';
import Registration from "./pages/Regustratuin.jsx"
import RegisterLogin from "./pages/UserRegistration.jsx";
import Profile from "./pages/UserProfile.jsx";
import Login from "./pages/UserLogin.jsx"
import Checkout from "./pages/Checkout.jsx"
import BillStatement from './pages/BillDetails.jsx';
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/product' element={<Product />} ></Route>
         <Route path='/cart' element={<Cart/>}></Route>
         <Route path='/' element={<Home/>} ></Route>
         <Route path='/Admin' element={<Admin/>} ></Route>
         <Route path='/Registration'element={<Registration/>}></Route>
         <Route path='/DashBoard' element={<AdminDash/>}></Route>
         <Route path='/DashBoard/Addproduct' element={<Addproduct/>}></Route>
         <Route path='/DashBoard/ViewProduct' element={<ViewProducts/>}></Route>
         <Route path='DashBoard/ViewTransaction' element={<ViewTransaction/>}></Route>
         <Route path='/DashBoard/UpdateProudct/:id' element={<UpdateProduct/>}></Route>
         <Route path='/UserRegistration' element={<RegisterLogin/>} ></Route>
         <Route path='/Profile' element={<Profile/>}></Route>
         <Route path='/Login' element={<Login/>}></Route>
         <Route path='/Checkout' element={<Checkout/>}></Route>
         <Route path='/bill' element={<BillStatement />}></Route>
      </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
