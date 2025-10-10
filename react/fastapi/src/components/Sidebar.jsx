import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaBoxOpen } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";

function Sidebar({ isOpen, toggleSidebar }) {
  const handleClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      <nav className={`sidebar ${isOpen ? '' : 'hidden'}`}>
        <NavLink to="/" end onClick={handleClick} className={({ isActive }) => isActive ? 'active' : ''}> <div className='d-flex align-items-center'> <FaHome /> <span className='ms-2'>Home</span></div></NavLink>
        <NavLink to="/users" onClick={handleClick} className={({ isActive }) => isActive ? 'active' : ''}><div className='d-flex align-items-center'> <FaUser /> <span className='ms-2'>Users</span></div></NavLink>
        <NavLink to="/categories" onClick={handleClick} className={({ isActive }) => isActive ? 'active' : ''}><div className='d-flex align-items-center'> <BiSolidCategoryAlt /> <span className='ms-2'>Categories</span></div></NavLink>
        <NavLink to="/products" onClick={handleClick} className={({ isActive }) => isActive ? 'active' : ''}><div className='d-flex align-items-center'> <FaBoxOpen /> <span className='ms-2'>Products</span></div></NavLink>
        <NavLink to="/orders" onClick={handleClick} className={({ isActive }) => isActive ? 'active' : ''}><div className='d-flex align-items-center'> <FaShoppingCart /> <span className='ms-2'>Orders</span></div></NavLink>
      </nav>

    </>
  );
}

export default Sidebar;
