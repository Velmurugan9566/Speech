import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './AdminHead';
import Aside from './AdminAside'
import '../style/ViewTransaction.css';

function ViewTransaction() {
    const [orders, setOrders] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [month, setMonth] = useState('');
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [frequentItems, setFrequentItems] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
const [isAsideOpen, setIsAsideOpen] = useState(window.innerWidth > 768); 


const handleResize = () => {
  const isNowMobile = window.innerWidth <= 768;
  setIsMobile(isNowMobile);
  setIsAsideOpen(!isNowMobile);
};
useEffect(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
const toggleAside = () => {
  setIsAsideOpen((prev) => !prev);
};
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, dateRangeRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/FetchOrders`),
                    axios.get(`${import.meta.env.VITE_API_URL}/FetchOrders`),
                ]);
                setOrders(ordersRes.data);
                setMinDate(dateRangeRes.data.minDate);
                setMaxDate(dateRangeRes.data.maxDate);
                setLoading(false); 
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Error fetching transaction data.");
            }
        };
        fetchData();
        getFrequentItems(); 
    }, []);


    const getFrequentItems = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/FrequentItems`);
            setFrequentItems(response.data);
        } catch (error) {
            console.error("Error fetching frequent items:", error);
            toast.error("Error fetching frequent items.");
        }
    };

    const handleFilter = async () => {
        if (!startDate || !endDate) {
            toast.warn("Please select both start and end dates.");
            return;
        }
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/FilterOrder`, {
                params: { startDate, endDate }
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Error filtering orders:", error);
            toast.error("Error filtering orders.");
        }
    };

    const handleMonthChange = async (e) => {
        setMonth(e.target.value);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/RevenueOrder`, { 
                params: { month: e.target.value } 
            });
            const data = response.data;
    
            if (Array.isArray(data)) {
                setMonthlyRevenue(data);
                console.log(monthlyRevenue)
            } else {
                setMonthlyRevenue([]);
                console.error("Expected an array for monthly revenue, but got:", data);
            }
        } catch (error) {
            console.error("Error fetching monthly revenue:", error);
            setMonthlyRevenue([]); 
        }
    };
     
    const revenueData = {
        labels: Array.isArray(monthlyRevenue) ? monthlyRevenue.map(data => data.date) : [],
        datasets: [{
            label: 'Total Revenue',
            data: Array.isArray(monthlyRevenue) ? monthlyRevenue.map(data => data.totalRevenue) : [],
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
        }],
    };
    
    const barData = {
        labels: Array.isArray(monthlyRevenue) ? monthlyRevenue.map(data => data.date) : [],
        datasets: [{
            label: 'Total Revenue',
            data: Array.isArray(monthlyRevenue) ? monthlyRevenue.map(data => data.totalRevenue) : [],
            backgroundColor: 'rgba(75,192,192,0.4)',
        }],
    };
    const colorGen=()=>{
      var count= frequentItems.length;
      var colors=[];
      for(let j=1;j<=count;j++){
        const letters = '0123456789ABCDEFabcdef';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        if(color in colors){
            j--;
        }else{
            colors.push(color);
        }
      }
      return colors; 
    }
    //console.log(colorGen())
    const barFrequent ={
        labels:frequentItems.map(i=>i.proname),
        datasets:[{
            label:'Low quantity Products',
            data:frequentItems.map(item=>item.quantity),
            backgroundColor: colorGen()
        }]
    }

    const donutData = {
        labels: frequentItems.map(item => item.proname),
        datasets: [{
            data: frequentItems.map(item => item.quantity),
            backgroundColor: colorGen(),
        }],
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ToastContainer />

            <div className="tra-dashboard">
            {isMobile && !isAsideOpen && <Header toggleAside={toggleAside}/>}
                 {!isMobile && isAsideOpen &&<aside className="tra-sidebar">
                         <Aside />
                    </aside>}

                <div className="tra-main-content">
                {!isMobile && isAsideOpen &&  <header className="tra-header">View Transactions</header>}
                   
                    <section className="tra-filter-section">
                        <label>Start Date: </label>
                        <input type="date" value={startDate} min={minDate} max={maxDate} onChange={(e) => setStartDate(e.target.value)} />
                        <label>End Date: </label>
                        <input type="date" value={endDate} min={minDate} max={maxDate} onChange={(e) => setEndDate(e.target.value)} />
                        <button onClick={handleFilter}>Filter</button>
                    </section>

                    <section className="tra-orders-section">
                        <h3>Order Details</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>User ID</th>
                                    <th>Date</th>
                                    <th>Total Amount</th>
                                    <th>Payment Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? orders.map((order, index) => (
                                    <tr key={index}>
                                        <td>{order._id}</td>
                                        <td>{order.userId}</td>
                                        <td>{new Date(order.dateTime).toLocaleDateString()}</td>
                                        <td>{order.totalAmount}</td>
                                        <td>{order.paymentStatus}</td>
                                    </tr>
                                )) : <tr><td colSpan="5">No orders found</td></tr>}
                            </tbody>
                        </table>
                    </section>

                    <section className="tra-chart-section">
                        <h3>Frequently Purchased Items</h3>
                        <Doughnut data={donutData} />
                        <Bar data={barFrequent}/>


                        <h3>Daily Revenue for Selected Month</h3>
                        <select onChange={handleMonthChange}>
                            <option value="">Select Month</option>
                            {[...Array(12).keys()].map(month => (
                                <option key={month} value={month + 1}>{new Date(0, month).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </select>
                        <Line data={revenueData} />
                        <Bar data={barData} />
                    </section>
                </div>
            </div>
        </>
    );
}

export default ViewTransaction;
