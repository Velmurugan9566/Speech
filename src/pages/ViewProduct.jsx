import React, { useEffect, useState,useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './AdminHead';
//import '../style/ViewProducts.css';
import 'primereact/resources/themes/saga-blue/theme.css';  // Choose your preferred theme
//import 'primereact/resources/primereact.min.css';           // Core CSS
import 'primeicons/primeicons.css';    
//import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import {Link} from "react-router-dom"
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

const ViewProducts = () => {
  const { state } = useLocation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(state?.selectedCategory || null);
  const [renameMode, setRenameMode] = useState(null); // Track the category being renamed
  const [newCategoryName, setNewCategoryName] = useState('');
  const [delcat, setdelcat] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/categorieswithcount')
      .then(res => setCategories(res.data))
      .catch(err => toast.error("Error fetching categories:", err));
    if (state?.selectedCategory) {
      handleCategoryClick(state.selectedCategory);
    }
  }, []);

const [selectedProducts, setSelectedProducts] = useState([]);
const handleProductSelect = (productId) => {
  setSelectedProducts(prevSelected =>
    prevSelected.includes(productId)
      ? prevSelected.filter(id => id !== productId)
      : [...prevSelected, productId]
  );
};
const handleRenameCategory = (oldName) => {
  if (newCategoryName.trim() === '') {
    return toast.error('Category name cannot be empty');
  }
  axios.put('http://localhost:3001/renamecategory', {
    oldName,
    newName: newCategoryName,
  })
    .then(() => {
      toast.success('Category renamed successfully');
      setRenameMode(null);
      setNewCategoryName('');
      // Refresh categories list to reflect the new name
      axios.get('http://localhost:3001/categorieswithcount')
        .then(res => setCategories(res.data))
        .catch(err => toast.error("Error fetching categories:", err));
    })
    .catch(err => toast.error('Error renaming category:', err));
};

  
const handleDeleteSelected = () => {
  if (window.confirm("Are you sure you want to delete the selected products?")) {
    axios.delete('http://localhost:3001/deleteProducts', { data: { ids: selectedProducts } })
      .then(() => {
        toast.success("Products deleted successfully");
        handleCategoryClick(selectedCategory); // Refresh products list
        setSelectedProducts([]); // Clear selected products
      })
      .catch(err => toast.error("Error deleting products:", err));
  }
};
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    axios.get(`http://localhost:3001/products/${category}`)
      .then(res => setProducts(res.data))
      .catch(err => toast.error("Error fetching products:", err));
  };
   console.log(products)
  const handleDeleteCate =(catename) =>{
    
  };
  const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const accept = () => {
      console.log(delcat)
      axios.delete('http://localhost:3001/deleteCategory', {data:{category:delcat}})
      .then((msg) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Category and Product Deleted Successfully', life: 3000 });
        axios.get('http://localhost:3001/categorieswithcount')
        .then(res => setCategories(res.data))
        .catch(err =>{ toast.error("Error fetching categories:")});
      })
      .catch(err =>{ toast.error("Error deleting products")});
        
    }
    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }

  return (
    <div>
      <ToastContainer />
      <Header/>

      <div className="container">
        <h2>Available Categories</h2>
        <table>
          { categories.length>0 ?
          categories.map((category, index) => (
            <tbody key={index}>
              {renameMode === category.category ? (
                <tr key={index}>
                  <td><input
                    type="text"
                    placeholder={category.category}
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  /></td>
                 <td><button onClick={() => handleRenameCategory(category.category)}>Rename</button></td>
                 <td> <button onClick={() => setRenameMode(null)}>Cancel</button></td>
                </tr>
              ) : (
                <tr>
                  <td><span onClick={() => handleCategoryClick(category.category)}>
                    {category.category} ({category.productCount})
                  </span></td>
                 <td> <button onClick={() => setRenameMode(category.category)}>Rename</button></td>
                 <td>
            <Toast ref={toast} />
            <ConfirmDialog group="templating"  visible={visible} onHide={() => setVisible(false)} message="Are you sure you want to proceed?" 
                header="Confirmation" icon="pi pi-exclamation-triangle" accept={()=>accept()} reject={reject} />
            <div className="card flex justify-content-center">
                <Button onClick={() => {setVisible(true),setdelcat(category.category)}} icon="pi pi-check" label="Delete" />
                      </div>
                 </td>
                </tr>
              )}
            </tbody>
          )):<tbody><tr><td>No Categories are Available</td></tr></tbody>}
        </table>


      {selectedCategory && (
        <div>
          <h3>Products in {selectedCategory}</h3>
          <button onClick={handleDeleteSelected}>Delete Selected</button>
          <table className="table table-responsive">
            <thead>
              <tr>
                <th>Select</th>
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
                <tr key={product._id} className={product.quantity < 20 ? 'low-stock' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleProductSelect(product._id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{product.proname}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.Subcategory}</td>
                  <td>{product.Supp_id}</td>
                  <td>{product.discount}</td>
                  <td>
                    <Link to={`/DashBoard/UpdateProudct/${product._id}`}><button>Edit</button></Link>
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
}
export default ViewProducts;