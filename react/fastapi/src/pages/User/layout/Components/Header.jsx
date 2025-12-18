import React from 'react';
import { Button } from 'react-bootstrap';
import { HiOutlineMenu } from "react-icons/hi";
import { Link, useNavigate, NavLink } from 'react-router-dom';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Swal from 'sweetalert2';
import { IoIosNotifications } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { AiFillDashboard } from "react-icons/ai";
import { DialogContent } from '@mui/material';

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
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;
