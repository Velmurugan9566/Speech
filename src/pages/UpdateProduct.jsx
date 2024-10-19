import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/AddPro.css'; // External CSS file
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './AdminHead';
import Aside from './AdminAside'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    proname: '',
    quantity: 0,
    price: 0,
    Subcategory: '',
    category: '',
    discount: 0,
    Supp_id: ''
  });
  const [errors, setErrors] = useState({});
  const [listcategory, setListcategory] = useState([]);
  const [listSupplier, setListSupplier] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
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
   console.log(id)
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/getProduct/${id}`)
      .then(res => {
        //console.log(res.data)
        setFormData(res.data);
      })
      .catch(err => toast.error("Error fetching product details:", err));

    // Fetch categories
    axios.get(`${import.meta.env.VITE_API_URL}/getCate`)
      .then(res => {
        const categories = res.data.map(val => val.catename);
        setListcategory(categories);
      })
      .catch(err => toast.error(err));

    // Fetch suppliers
    axios.get(`${import.meta.env.VITE_API_URL}/getSupp`)
      .then(res => {
        const suppliers = res.data.map(val => val.suppname);
        setListSupplier(suppliers);
      })
      .catch(err => toast.error(err));

    // Fetch subcategories
    axios.get(`${import.meta.env.VITE_API_URL}/getSubcategories`)
      .then(res => setSubcategories(res.data))
      .catch(err => toast.error("Error fetching subcategories:", err));

  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const numericFields = ['quantity', 'price', 'discount'];
    
    const newValue = numericFields.includes(name) ? Number(value) : value;
    console.log(`Changing ${name}: `, newValue); // Log the updated value
    
    setFormData({
      ...formData,
      [name]: newValue
    });
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("form",formData);
    axios.put(`${import.meta.env.VITE_API_URL}/updateProduct/${id}`, formData)
      .then(msg => {
        toast.success("Product Updated Successfully");
        navigate('/DashBoard/ViewProduct', { state: { selectedCategory: formData.category } }); // Passing selected category
      })
      .catch(err => {toast.error("Error updating product:", err);console.log(err.data.errors);setErrors(err.data.errors)});
  };
  return (
    <div>
      <ToastContainer />
 {isMobile && !isAsideOpen && <Header toggleAside={toggleAside}/>}
                 {!isMobile && isAsideOpen &&<aside className="tra-sidebar">
                         <Aside />
                    </aside>}

      <div className="app-container">
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
    </div>
  );
};

export default UpdateProduct;
