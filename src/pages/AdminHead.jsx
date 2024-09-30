import { Link } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import '../style/AdminHeader.css'; // Ensure this CSS file is included in your project

function AdminHead() {
  return (
    <header className="admin-header">
      <div className="title-row">
        <h2 className="admin-title">Admin Panel</h2>
        <Link to='/profile' className="profile-link">
          <button className='profile-btn'>Profile</button>
        </Link>
        <div className="admin-menu">
                        <Link to="/profile">Profile Settings</Link>
                        <Link to="/logout">Logout</Link>
                    </div>
      </div>
      <nav className="menu-row">
        <Link to='/DashBoard'>
          <button>Home</button>
        </Link>
        <Link to='/DashBoard/AddProduct'>
          <button>Add Product</button>
        </Link>
        <Link to='/DashBoard/ViewTransaction'><button>View Transaction</button></Link>
        <Link to='/DashBoard/ViewProduct'>
          <button>View Stock</button>
        </Link>
        <button>Add Supplier</button>
      </nav>
    </header>
  );
}

export default AdminHead;
