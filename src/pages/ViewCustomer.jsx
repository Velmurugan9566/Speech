import React, { useState, useEffect } from 'react';
import { Line,Bar } from 'react-chartjs-2'; // Assuming you use react-chartjs-2 for the line chart
import '../style/ViewCustomer.css';
import Header from './AdminHead';
import Aside from './AdminAside';

const ViewCustomerDetails = () => {
  const [customers, setCustomers] = useState([]); // Customers data from the database
  const [selectedCustomer, setSelectedCustomer] = useState(null); // For order details
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isAsideOpen, setIsAsideOpen] = useState(true);

  useEffect(() => {
    // Fetch customer details from the database
    fetchCustomers();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    setIsAsideOpen(window.innerWidth > 768);
  };
  const toggleAside = () => {
    setIsAsideOpen((prev) => !prev);
  };
  
  const fetchCustomers = async () => {
    // Fetch customer data (mockup)
    const customerData = await fetch(`${import.meta.env.VITE_API_URL}/customersWithOrder`).then(res => res.json());
    
    setCustomers(customerData);
    customers.map(i=>console.log(i.user.name))
  };

  const toggleOrderDetails = (customerId) => {
    setSelectedCustomer(selectedCustomer === customerId ? null : customerId);
  };

  // Line chart data showing number of orders for each customer
  const orderChartData = {
    labels: customers.map(customer => customer.user.name),
    datasets: [
      {
        label: 'Number of Orders',
        data: customers.map(customer => (customer.orders).length),
        fill: false,
        borderColor: '#007bff',
        tension: 0.1
      }
    ]
  };

  return (
    <div className={`vus-container`}>
       {/* Aside */}
       {isMobile && !isAsideOpen && <Header toggleAside={toggleAside}/>}
                 {!isMobile && isAsideOpen &&<aside className='vus-aside vus-open'>
                         <Aside />
                    </aside>}
  
                <div className="tra-main-content">
                {!isMobile && isAsideOpen &&  <header className="vus-header">Customer Info</header>}
    
      <div className="vus-content">
        <h2 className="vus-title">View Customer Details</h2>

        {/* Customer Details Table */}
        <table className="vus-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <React.Fragment key={customer.user.email}>
                <tr>
                  <td>{customer.user.name}</td>
                  <td>{customer.user.email}</td>
                  <td>{customer.user.phone}</td>
                  <td>{(customer.orders).length}</td>
                  <td>
                    <button
                      className="vus-show-orders-btn"
                      onClick={() => toggleOrderDetails(customer.user.email)}
                    >
                      {selectedCustomer === customer.user.email ? 'Hide Orders' : 'Show Orders'}
                    </button>
                  </td>
                </tr>

                {/* Order Details (slide down under the row) */}
                {selectedCustomer === customer.user.email && (
                  <tr>
                    <td colSpan="5">
                      <div className="vus-order-details">
                        <h4>Order History for {customer.user.name}</h4>
                        <table>
                          <tr>
                            <td>S.No</td><td>Order ID</td><td>Date Time</td><td>Total Amount</td>
                          </tr>
                          {customer.orders.map((order,index) => (
                            <tr key={order._id}>
                              <td>{index+1} :</td><td>{order._id} </td><td>{order.dateTime}</td><td> Rs.{order.totalAmount}</td>                            </tr>
                          ))}
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Line Chart to show the number of orders */}
        <div className="vus-chart-container">
          <h3>Order Chart</h3>
          <Line data={orderChartData} />
          <Bar data={orderChartData}/>
        </div>
      </div>
      </div>

         </div>
  );
};

export default ViewCustomerDetails;
