import React,{useState,useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard(){

    return(
        <>
        <h2>Admin DashBorad</h2>
        <Link to='/DashBoard/Addproduct' >Add Product</Link>
        </>
    )
}

export default Dashboard;