import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/AddPro.css'; // External CSS file
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './AdminHead'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    proname: '',
    quantity: '',
    price: '',
    Subcategory: '',
    category: '',
    discount: '',
    Supp_id: ''
  });
  const [errors, setErrors] = useState({});
  const [listcategory, setListcategory] = useState([]);
  const [listSupplier, setListSupplier] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
   console.log(id)
  useEffect(() => {
    axios.get(`http://localhost:3001/getProduct/${id}`)
      .then(res => {
        console.log(res.data)
        setFormData(res.data);
      })
      .catch(err => toast.error("Error fetching product details:", err));

    // Fetch categories
    axios.get('http://localhost:3001/getCate')
      .then(res => {
        const categories = res.data.map(val => val.catename);
        setListcategory(categories);
      })
      .catch(err => toast.error(err));

    // Fetch suppliers
    axios.get('http://localhost:3001/getSupp')
      .then(res => {
        const suppliers = res.data.map(val => val.suppname);
        setListSupplier(suppliers);
      })
      .catch(err => toast.error(err));

    // Fetch subcategories
    axios.get('http://localhost:3001/getSubcategories')
      .then(res => setSubcategories(res.data))
      .catch(err => toast.error("Error fetching subcategories:", err));

  }, [id]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.toLowerCase()
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.put(`http://localhost:3001/updateProduct/${id}`, formData)
      .then(msg => {
        toast.success("Product Updated Successfully");
        navigate('/DashBoard/ViewProduct', { state: { selectedCategory: formData.category } }); // Passing selected category
      })
      .catch(err => toast.error("Error updating product:", err));
  };
  return (
    <div>
      <ToastContainer />
      <Header/>

      <div className="container">
        <form className="product-form" onSubmit={handleSubmit}>
          <div>
            <label>Product Name:</label>
            <input name="proname" value={formData.proname} onChange={handleChange} />
            {errors.proname && <span className="error">{errors.proname}</span>}
          </div>
          <div>
            <label>Product Quantity:</label>
            <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} />
            {errors.quantity && <span className="error">{errors.quantity}</span>}
          </div>
          <div>
            <label>Product Price:</label>
            <input name="price" type="number" value={formData.price} onChange={handleChange} />
            {errors.price && <span className="error">{errors.price}</span>}
          </div>
          <div>
            <label>Category:</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {listcategory.map((val, index) =>
                <option key={index} value={val}>{val}</option>
              )}
            </select>
          </div>
          <div>
            <label>Sub Category:</label>
            <input
              name="Subcategory"
              list="subcategory-list"
              value={formData.Subcategory}
              onChange={handleChange}
            />
            <datalist id="subcategory-list">
              {subcategories.map((subcategory, index) => (
                <option key={index} value={subcategory} />
              ))}
            </datalist>
          </div>
          <div>
            <label>Supplier Name/Id:</label>
            <select name="Supp_id" value={formData.Supp_id} onChange={handleChange}>
              <option value="">Select Supplier</option>
              {listSupplier.map((val, index) =>
                <option key={index} value={val}>{val}</option>
              )}
            </select>
          </div>
          <div>
            <label>Discount:</label>
            <input name="discount" type="number" value={formData.discount} onChange={handleChange} />
            {errors.discount && <span className="error">{errors.discount}</span>}
          </div>
          <button type="submit">Update Product</button>
        </form>
      </div>

      <footer className="footer">
        <p>© 2024 Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UpdateProduct;