import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer,toast } from 'react-toastify';
//import toast,{Toaster} from 'react-hot-toast';
import "react-toastify/dist/ReactToastify.css";
//import './App.css'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'


function Admin() {
  const [email, setemail] = useState('')
  const navigate = useNavigate()
  const [password, setps] = useState('')
  const [load,setload] =useState(false)

  var status = 0
  function handle(e) {
    e.preventDefault()
    if (email.length != 0) {
      if (password.length != 0) {
        setload(true)
        console.log(email)
        axios.get('http://localhost:3001/Alogin', {
          params: { u: email, pass: password }
        })
          .then(res => {
            setload(false)
            status = res.data.status
            console.log(res)
            if (status == 1) {
              alert('Login Successfully')
              navigate('/Dashboard')
            }
            if (status == 2) {
              toast.error('User Id not found..')
            }
            if (status == 3) {
              toast.error('Password Mismatch..')
            }
          }
          )
          .catch(err =>{ 
            setload(false)
            toast.error('Please connect internet..')
            console.log(err)})
      }
      else {
        alert('password field is empty')
      }
    }
    else {
      alert('email field is empty')
    }
  }

  return (
    <>
    <ToastContainer/>
      <div className='d-flex justify-content-center align-items-center bg-primary vh-100 w-300'>
        <div className='bg-white p-3 rounded w-250'>
          <h2>Login</h2>
          <form onSubmit={handle}>
            <div className="mb-3">
              <strong>User Id</strong>
              <input type='text' placeholder='Enter Email Address' autoComplete='off' name='email' className='form-control rounded-2' onChange={(e) => setemail(e.target.value)}></input>
            </div>
            <div className="mb-3">
              <strong>Password</strong>
              <input type='password' placeholder='Enter Password' autoComplete='off' name='password' className='form-control rounded-2' onChange={(e) => setps(e.target.value)} ></input>
            </div>
            {
              load ?
                <button className='btn btn-success w-100 rounded-2'>
                  <Spinner animation='border' variant='light'>
                  </Spinner>
                </button>
                :
                <button type='submit' className='btn btn-success w-100 rounded-2'>
                  Login
                </button>
            }
            <Link to='/forgetps' ><p className='forgetps' >Forget Passward</p></Link>
            <p>Don't have an account</p>
            <Link to='/' className='btn btn-default border w-100 bg-light'>SignUp</Link>
          </form>
        </div>

      </div>
    </>
  )
}

export default Admin
