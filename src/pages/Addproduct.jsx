import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Header from './AdminHead';
import Aside from './AdminAside';
import { ToastContainer, toast } from 'react-toastify';
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
        .then(msg => {
              if(msg.data.status == 1){
                toast.success("Product Added Successfully")
              }
              else if(msg.data.status == 2){
                toast.info("Product Already Exist")
              }else{
                toast.warning(msg.data)
              }
              })
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
    console.log(file)
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const isValid = jsonData.every(item => {
        
        return typeof item['quantity'] === 'number' && typeof item['price'] === 'number';
      });

      if (!isValid) {
        alert('Invalid data in Excel file.');
        return;
      }else{
        axios.post('http://localhost:3001/AddBulkPro',{jsonData})
        .then(msg=>{
             if(msg.data.status==1){
              toast.success("All products are inserted Successfully.")
             }else if(msg.data.status==2){
              toast.warning("duplicate data are there..")
              console.log(msg.data.data)
             }else if(msg.data.status==3){
                toast.warning("Data has invalid format")
                console.log(msg.data.err)
              toast.warning(msg.data)
             }
              
        })
       .catch(err=>console.log(err))
      }
      console.log(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      {isMobile && !isAsideOpen && <Header toggleAside={toggleAside}/>}
   
     
      <ToastContainer />
      <main>
      {!isMobile && isAsideOpen && <header className="tra-header">Admin Panel</header>}
      {!isMobile && isAsideOpen && <Aside />}
      
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
        <button onClick={handleExcelUpload} className='add-pro-btn'>Add</button>
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
</main>
      {/* <footer className="footer">
        <p>© 2024 Admin Panel. All rights reserved.</p>
      </footer> */}

    </div>
  );
};

export default AdminProductForm;
