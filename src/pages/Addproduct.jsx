/*import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const AdminProductForm = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productQuantity: '',
    productPrice: '',
    Subcategory: '',
    category: '',
    discount:'',
    supp_id:''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let validationErrors = {};
    
    

    if (!formData.productName) validationErrors.productName = 'Product Name is required';
    // else{
    //     axios.get(`http://localhost:3001/product/${formData.productName}`)
    //     .then(msg =>console.log(msg))
    //     .catch(err=>console.log(err))
    // }
    if (!formData.productQuantity || isNaN(formData.productQuantity)|| formData.productQuantity < 0 ) {
      validationErrors.productQuantity = 'Product Quantity is required and must be a possitive number';
    }
    if (!formData.productPrice || isNaN(formData.productPrice) || formData.productPrice <0) {
      validationErrors.productPrice = 'Product Price is required and must be a possitive number';
    }
   
    if (!formData.category) validationErrors.category = 'Category is required';
    if (!formData.Subcategory) validationErrors.Subcategory = ' Sub_Category is required';
    if (!formData.supp_id) validationErrors.supp_id= 'Supplier Id is required';
     if (!formData.discount|| isNaN(formData.discount)|| formData.discount < 0) {
           validationErrors.discount = 'Discount is required';}
    

    return validationErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log(formData);
      axios.post('http://localhost:3001/AddPro',{formData})
      .then(msg => console.log(msg))
      .catch(err => console.log(err))
      // Handle form submission (e.g., send data to backend)
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate the data
      const isValid = jsonData.every(item => {
        return typeof item['product quantity'] === 'number' && typeof item['product price'] === 'number';
      });

      if (!isValid) {
        alert('Invalid data in Excel file.');
        return;
      }

      console.log(jsonData);
      // Handle bulk insertion (e.g., send data to backend)
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h2>Insert Product Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input name="productName" value={formData.productName} onChange={handleChange} />
          {errors.productName && <span>{errors.productName}</span>}
        </div>
        <div>
          <label>Product Quantity:</label>
          <input name="productQuantity" type="number" value={formData.productQuantity} onChange={handleChange} />
          {errors.productQuantity && <span>{errors.productQuantity}</span>}
        </div>
        <div>
          <label>Product Price:</label>
          <input name="productPrice" type="number" value={formData.productPrice} onChange={handleChange} />
          {errors.productPrice && <span>{errors.productPrice}</span>}
        </div>
        <div>
          <label>Category:</label>
          <input name="category" value={formData.category} onChange={handleChange} />
          {errors.category && <span>{errors.category}</span>}
        </div>
       
        <div>
          <label>Sub Category:</label>
          <input name="Subcategory" value={formData.Subcategory} onChange={handleChange} />
          {errors.Subcategory && <span>{errors.Subcategory}</span>}
        </div>
        <div>
          <label>Supplier Name/Id:</label>
          <input name="supp_id" value={formData.supp_id} onChange={handleChange} />
          {errors.supp_id && <span>{errors.supp_id}</span>}
        </div>
        <div>
          <label>Discount:</label>
          <input name="discount" value={formData.discount} onChange={handleChange} />
          {errors.discount && <span>{errors.discount}</span>}
        </div>
        <button type="submit">Insert Product</button>
      </form>

      <h2>Bulk Insert Products via Excel</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} />
    </div>
  );
};

export default AdminProductForm;

*/
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import '../style/AddPro.css'; // External CSS file
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

const AdminProductForm = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productQuantity: '',
    productPrice: '',
    Subcategory: '',
    category: '',
    discount: '',
    supp_id: ''
  });
  const [newcate, setnewcate] = useState("");
  const [newcateid, setnewcateid] = useState("");
  const [newSuppid, setnewSuppid] = useState("");
  const [newSupp, setnewSupp] = useState("");
  const [errors, setErrors] = useState({});
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showSupplierPopup, setShowSupplierPopup] = useState(false);
  const [listcategory, setListcategory] = useState([]);
  const [listSupplier, setListSupplier] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setnewcate("");
    setnewSupp("");
    axios.get('http://localhost:3001/getSubcategories')
      .then(res => setSubcategories(res.data))
      .catch(err => toast.error("Error fetching subcategories:", err));
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
  }, []);
  const validate = () => {
    let validationErrors = {};
    if (!formData.productName) validationErrors.productName = 'Product Name is required';
    if (!formData.productQuantity || isNaN(formData.productQuantity) || formData.productQuantity < 0) {
      validationErrors.productQuantity = 'Product Quantity is required and must be a positive number';
    }
    if (!formData.productPrice || isNaN(formData.productPrice) || formData.productPrice < 0) {
      validationErrors.productPrice = 'Product Price is required and must be a positive number';
    }
    if (!formData.category) validationErrors.category = 'Category is required';
    if (!formData.Subcategory) validationErrors.Subcategory = 'Sub Category is required';
    if (!formData.supp_id) validationErrors.supp_id = 'Supplier Id is required';
    if (!formData.discount || isNaN(formData.discount) || formData.discount < 0) {
      validationErrors.discount = 'Discount is required';
    }
    return validationErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    console.log(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log(formData);
      axios.post('http://localhost:3001/AddPro', { formData })
        .then(msg => toast.success("Product Added Successfully"))
        .catch(err => toast.error(err));
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.toLowerCase()
    });
  };
  const handleCate = (e) => {
    e.preventDefault();
    if (!newcateid || isNaN(newcateid) || newcateid < 0) {
      toast.warning("Enter a valid Id")
    } else if (!newcate || !isNaN(newcate)) {
      toast.warning("enter the valid name")
    }
    else {
      axios.post('http://localhost:3001/Addcate', { cate: newcate.toLowerCase(), id: newcateid })
        .then(res => {
          console.log(res)
          if (res.data.status == 1) {
            toast.success("Inserted Successfully..")
          } if (res.data.status == 2) {
            toast.warning("data already exists")
          }
        })
        .catch(err => toast.warning(err))
    }
  }
  const handleSupplier = (e) => {
    e.preventDefault();
    if (!newSuppid) {
      toast.warning("enter the Supplier id")

    } else if (!newSupp || !isNaN(newSupp)) {
      toast.warning("enter the valid name")
    }
    else {
      axios.post('http://localhost:3001/Addsupp', { suppname: newSupp.toLowerCase(), suppid: newSuppid })
        .then(res => {
          console.log(res)
          if (res.data.status == 1) {
            toast.success("Inserted Successfully..")
          } if (res.data.status == 2) {
            toast.warning("data already exists")
          }
        })
        .catch(err => toast.warning(err))
    }
  }

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const isValid = jsonData.every(item => {
        return typeof item['product quantity'] === 'number' && typeof item['product price'] === 'number';
      });

      if (!isValid) {
        alert('Invalid data in Excel file.');
        return;
      }

      console.log(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <ToastContainer />
      <header className="header">
        <h2>Admin Panel</h2>
        <nav>
          <button className="active">Home</button>
          <button>Add Product</button>
          <button>View Transaction</button>
          <button>View Stock</button>
          <button>Add Supplier</button>
          <button>Profile</button>
        </nav>
      </header>

      <div className="container">
        <h2>Insert Product Details</h2>
        <form className="product-form" onSubmit={handleSubmit}>
          <div>
            <label>Product Name:</label>
            <input name="productName" value={formData.productName} onChange={handleChange} />
            {errors.productName && <span className="error">{errors.productName}</span>}
          </div>
          <div>
            <label>Product Quantity:</label>
            <input name="productQuantity" type="number" value={formData.productQuantity} onChange={handleChange} />
            {errors.productQuantity && <span className="error">{errors.productQuantity}</span>}
          </div>
          <div>
            <label>Product Price:</label>
            <input name="productPrice" type="number" value={formData.productPrice} onChange={handleChange} />
            {errors.productPrice && <span className="error">{errors.productPrice}</span>}
          </div>
          <div>
            <label>Category:</label>

            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select Category</option>
              {listcategory.map((val, index) =>
                <option key={index} value={val}>{val}</option>
              )}
            </select>
            <button type="button" onClick={() => setShowCategoryPopup(true)}>Add New Category</button>
            {errors.category && <span className="error">{errors.category}</span>}
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
            <select name="supp_id" value={formData.supp_id} onChange={handleChange}>
              <option value="">Select Supplier</option>

              {listSupplier.map((val, index) =>
                <option key={index} value={val}>{val}</option>
              )}

            </select>
            <button type="button" onClick={() => setShowSupplierPopup(true)}>Add New Supplier</button>
            {errors.supp_id && <span className="error">{errors.supp_id}</span>}
          </div>
          <div>
            <label>Discount:</label>
            <input name="discount" type="number" value={formData.discount} onChange={handleChange} />
            {errors.discount && <span className="error">{errors.discount}</span>}
          </div>
          <button type="submit">Insert Product</button>
        </form>

        <h2>Bulk Insert Products via Excel</h2>
        <input type="file" accept=".xlsx, .xls" onClick={(e) => e.stopPropagation()} onChange={handleExcelUpload} />
      </div>

      {showCategoryPopup && (
        <div className="popup active">
          <h3>Add New Category</h3>
          <form>
            <label>Category ID:</label>
            <input type="number" value={newcateid} onChange={(e) => setnewcateid(e.target.value)} />
            {errors.cateid && <span className="error">{errors.cateid}</span>}
            <label>Category Name:</label>
            <input type="text" value={newcate} onChange={(e) => setnewcate(e.target.value)} />
            {errors.newcate && <span className="error">{errors.newcate}</span>}
            <button type="button" onClick={(e) => { setShowCategoryPopup(false); handleCate(e) }}>Add</button>
          </form>
          <button className="close-popup" onClick={() => setShowCategoryPopup(false)}>Close</button>
        </div>
      )}

      {showSupplierPopup && (
        <div className="popup active">
          <h3>Add New Supplier</h3>
          <form>
            <label>Supplier ID:</label>
            <input type="text" value={newSuppid} onChange={(e) => setnewSuppid(e.target.value)} />
            <label>Supplier Name:</label>
            <input type="text" value={newSupp} onChange={(e) => setnewSupp(e.target.value.toLowerCase())} />
            <button type="button" onClick={(e) => { setShowSupplierPopup(false); handleSupplier(e) }}>Add</button>
          </form>
          <button className="close-popup" onClick={() => setShowSupplierPopup(false)}>Close</button>
        </div>
      )}

      <footer className="footer">
        <p>© 2024 Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminProductForm;