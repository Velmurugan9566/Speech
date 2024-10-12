import React from 'react';
import { Link } from 'react-router-dom';

const Aside = () => {
  return (
    <aside className="ap-sidebar">
                    <ul>
                        <li><Link to='/DashBoard' id='link'>Home</Link></li>
                        <li><Link to='/DashBoard/AddProduct' id='link'>Add Products</Link></li>
                        <li><Link to='/DashBoard/ViewProduct' id='link'>View Products</Link></li>
                        <li><Link to='/DashBoard/ViewTransaction' id='link'>View Transaction</Link></li>
                        <li><Link to='/DashBoard/ViewCustomer' id='link' >View Customer</Link></li>
                    </ul>
                </aside>
  );
};

export default Aside;
