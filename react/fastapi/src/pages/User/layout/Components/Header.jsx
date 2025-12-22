import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaCartShopping } from "react-icons/fa6";

function Header({ toggleSidebar, onLogout }) {
  const navigate = useNavigate();

  const logout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('auth');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole')
      onLogout();
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        icon: "success",
        title: "Logout Successfully",
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
      navigate('/login');
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data || error.message,
      });
    }
  };

  return (
    <header className="main-header">
      <div className="container">
        <div className='header-wrapper'>
          <div className='header-title'>
            <Link to={'/user'}>
              <h1>
                Products
              </h1>
            </Link>
          </div>

          <div className='user-buttons'>
            <div className='profile'>
              <Link to={'/user/profile'}>
                <button >
                  User Profile
                </button>
              </Link>
            </div>

            <div className='logout'>
              <button onClick={logout}>
                logout
              </button>
            </div>
            <div className='add-to-cart'>
              <Link to={'addtocart'}>
                <button>
                  <FaCartShopping />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;
