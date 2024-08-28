import '../style/AddPro.css'; // External CSS file
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link, useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
function AdminHead(){

    return(
        <header className="header">
        <h2>Admin Panel</h2>
        <nav>
        <Link to='/DashBoard' ><button className="active">Home</button></Link>
        <Link to='/DashBoard/AddProduct' > <button>Add Product</button></Link>
          <button>View Transaction</button>
          <Link to='/DashBoard/ViewProduct'><button>View Stock</button></Link>
          <button>Add Supplier</button>
          <button>Profile</button>
        </nav>
      </header>
    );
};

export default AdminHead;
