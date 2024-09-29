import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Header from './AdminHead';
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import '../style/AdminDash.css';


function Dashboard(){

    return(
        <>

        <ToastContainer />
        {/* <Header/> */}
        <div className="ap-dashboard">
  <aside className="ap-sidebar">
    <ul>
      <li>Home</li>
      <li><Link to='/DashBoard/AddProduct' id='link'>Add Products</Link></li>
      <li><Link to='/DashBoard/ViewProduct' id='link'>View Products</Link></li>
      <li>Manage Transaction</li>
      <li>View Customer</li>
    </ul>
  </aside>

  <div className="ap-main-content">
    <header className="ap-header">Admin Dashboard</header>

    <section className="ap-stats-section">
      <div className="ap-stat-box">
        <h3>Total Website Viewers</h3>
        <p>12</p>
      </div>
      <div className="ap-stat-box">
        <h3>Total Orders</h3>
        <p>0</p>
      </div>
    </section>


  </div>
</div>

        </>
    )
}

export default Dashboard;