import React from 'react';
import { Link } from 'react-router-dom';

const Aside = () => {
  return (
    <aside className="ap-sidebar">
      <ul>
        <li>Home</li>
        <li><Link to='/DashBoard/AddProduct'>Add Products</Link></li>
        <li><Link to='/DashBoard/ViewProduct'>View Products</Link></li>
        <li><Link to='/DashBoard/ViewTransaction'>Manage Transaction</Link></li>
        <li>View Customer</li>
      </ul>
    </aside>
  );
};

export default Aside;
