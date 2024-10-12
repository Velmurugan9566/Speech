import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2'; // Import Bar and Pie charts from react-chartjs-2
import 'chart.js/auto'; // Import the auto-configuration for chart.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import '../style/AdminDash.css';
import Header from './AdminHead'
import Aside from './AdminAside'

function Dashboard() {
  const [lowQuantityData, setLowQuantityData] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
const [isAsideOpen, setIsAsideOpen] = useState(window.innerWidth > 768); // Initially set based on screen size

// Detect window resize and toggle between mobile and desktop views
const handleResize = () => {
  const isNowMobile = window.innerWidth <= 768;
  setIsMobile(isNowMobile);
  
  // Automatically set aside state based on the current window size
  setIsAsideOpen(!isNowMobile); // Show aside if it's not mobile
};

useEffect(() => {
  // Run on component mount to check initial screen size
  handleResize();

  // Add resize listener
  window.addEventListener('resize', handleResize);

  // Cleanup listener on component unmount
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

const toggleAside = () => {
  setIsAsideOpen((prev) => !prev);
};
// Fetch low quantity products
  useEffect(() => {
    axios.get('http://localhost:3001/products_low_quantity')
      .then((response) => setLowQuantityData(response.data))
      .catch((error) => console.log(error));

    // Fetch today's transaction data
    axios.get('http://localhost:3001/transactions/today')
      .then((response) => setTransactionList(response.data))
      .catch((error) => console.log(error));
  }, []);
  console.log(transactionList)
  const transactionData = {
    completed: transactionList.filter(item => item.paymentStatus === 'Completed').length,
    pending: transactionList.filter(item => item.paymentStatus === 'Pending').length
  };
  console.log(transactionData)
  // Bar chart for low quantity products
  const barData = {
    labels: lowQuantityData.map(item => item.proname),
    datasets: [
      {
        label: 'Quantity',
        data: lowQuantityData.map(item => item.quantity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Pie chart for today's transactions
  const pieData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [transactionData.completed, transactionData.pending],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        hoverBackgroundColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
      },
    ],
  };

  return (
    <> 
    {isMobile && !isAsideOpen && <Header toggleAside={toggleAside}/>}
    <div className="ap-dashboard">
{!isMobile && isAsideOpen && <Aside />}

<div className={`ap-main-content`}>
  {!isMobile && isAsideOpen && <header className="tra-header">Admin Panel</header>}
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

      <section className="ap-chart-section">
        <h3>Low Quantity Products</h3>
        <div className="ap-chart-container">
          <Bar data={barData} />
        </div>
      </section>

      <section className="ap-chart-section">
        <h3>Today's Transactions</h3>
        <div className="ap-chart-container">
          <Pie data={pieData} />
          {transactionData ? (
            <>
              <h4>Total Completed: {transactionData.completed}</h4>
              <h4>Total Pending: {transactionData.pending}</h4>
            </>
          ) : (
            <h4>No Data</h4>
          )}
        </div>
      </section>
    </div>
  </div>
    </>
  );
}

export default Dashboard;
