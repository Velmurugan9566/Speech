import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Header from './AdminHead';
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';


function Dashboard(){

    return(
        <>
        <ToastContainer />
        <Header/>
        </>
    )
}

export default Dashboard;