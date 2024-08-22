import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './AdminHead';
import '../style/ViewProducts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';

const ViewProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    
    axios.get('http://localhost:3001/categorieswithcount')
      .then(res => setCategories(res.data))
      .catch(err => toast.error("Error fetching categories:", err));
  }, []);
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    axios.get(`http://localhost:3001/products/${category}`)
      .then(res => setProducts(res.data))
      .catch(err => toast.error("Error fetching products:", err));
  };
   console.log(products)
  const handleEditClick = (productId) => {
    // Navigate to edit product page with productId
  };

  return (
    <div>
      <ToastContainer />
      <Header/>

      <div className="container">
        <h2>Available Categories</h2>
        <ul>
          {categories.map((category, index) => (
            <li key={index} onClick={() => handleCategoryClick(category.category)}>
              {category.category} ({category.productCount})
            </li>
          ))}
        </ul>

        {selectedCategory && (
          <div>
            <h3>Products in {selectedCategory}</h3>
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Supplier</th>
                  <th>Discount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id} className={product.quantity <20  ? 'low-stock' : 'low-stock'}>
                    <td>{index + 1}</td>
                    <td>{product.proname}</td>
                    <td>{product.quantity}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.Subcategory}</td>
                    <td>{product.Supp_id}</td>
                    <td>{product.discount}</td>
                    <td>
                      <button onClick={() => handleEditClick(product._id)}>Edit</button>
                      <button>Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>© 2024 Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ViewProducts;
