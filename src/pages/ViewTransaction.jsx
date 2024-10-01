import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    const [loading, setLoading] = useState(true); // Add a loading state

    // Fetch orders and date range together
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, dateRangeRes] = await Promise.all([
                    axios.get('http://localhost:3001/FetchOrders'),
                    axios.get('http://localhost:3001/FetchOrders'),
                ]);
                setOrders(ordersRes.data);
                setMinDate(dateRangeRes.data.minDate);
                setMaxDate(dateRangeRes.data.maxDate);
                setLoading(false); // Stop loading after data fetch
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Error fetching transaction data.");
            }
        };
        fetchData();
        getFrequentItems(); // Fetch frequent items initially
    }, []);

    // Fetch frequent items
    const getFrequentItems = async () => {
        try {
            const response = await axios.get('http://localhost:3001/FrequentItems');
            setFrequentItems(response.data);
        } catch (error) {
            console.error("Error fetching frequent items:", error);
            toast.error("Error fetching frequent items.");
        }
    };

    // Filter orders by date range
    const handleFilter = async () => {
        if (!startDate || !endDate) {
            toast.warn("Please select both start and end dates.");
            return;
        }
        try {
            const response = await axios.get('http://localhost:3001/FilterOrder', {
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
            const response = await axios.get('http://localhost:3001/RevenueOrder', { 
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
            setMonthlyRevenue([]); // Fallback to empty array if there's an error
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
     // Prepare chart data

    const donutData = {
        labels: frequentItems.map(item => item.proname),
        datasets: [{
            data: frequentItems.map(item => item.quantity),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }],
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ToastContainer />
            <div className="tra-dashboard">
                <aside className="tra-sidebar">
                    <ul>
                        <li>Home</li>
                        <li><Link to='/DashBoard/AddProduct' id='link'>Add Products</Link></li>
                        <li><Link to='/DashBoard/ViewProduct' id='link'>View Products</Link></li>
                        <li><Link to='/DashBoard/ViewTransaction' id='link'>View Transaction</Link></li>
                        <li>View Customer</li>
                    </ul>
                </aside>

                <div className="tra-main-content">
                    <header className="tra-header">View Transactions</header>
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
