// import React from 'react';
// import { Button, NavbarCollapse} from 'react-bootstrap';
// import { HiOutlineMenu } from "react-icons/hi";
// import { Link, useNavigate } from 'react-router-dom';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import '../App.css'
// import Swal from 'sweetalert2';
// import { IoIosNotifications } from "react-icons/io";
// import { IoLogOut } from "react-icons/io5";
// import { CgProfile } from "react-icons/cg";
// import { AiFillDashboard } from "react-icons/ai";
// import { NavLink } from 'react-router-dom';


// function Header({ toggleSidebar, onLogout }) {
//   const navigate = useNavigate()
//   const logout = (e) => {
//     e.preventDefault();

//     try {
//       localStorage.removeItem('user');
//       localStorage.removeItem('auth');
//       onLogout();
//       const Toast = Swal.mixin({
//         toast: true,
//         position: "top-end",
//         showConfirmButton: false,
//         timer:1000,
//         timerProgressBar: true,
//         didOpen: (toast) => {
//           toast.onmouseenter = Swal.stopTimer;
//           toast.onmouseleave = Swal.resumeTimer;
//         }
//       });
//       Toast.fire({
//         icon: "success",
//         title: "LogOut Successfully"
//       });
//       navigate('/');
//     }
//     catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: error.response ? error.response.data : error.message,
//       });
//     }
//   };


//   return (
//     <header className="header">
//       <Button
//         variant="link"
//         className="menu-button d-md-none"
//         onClick={toggleSidebar}
//         aria-label="Toggle sidebar"
//       >
//         {/* &#9776; */}
//         <HiOutlineMenu />
//       </Button>
//       <Link to={'/'} > <h5 className="mb-0">
//         <span className='d-flex align-items-center gap-2'>
//           <AiFillDashboard /> Admin Dashboard
//         </span>

//       </h5>
//       </Link>

//       <div className='d-flex align-items-center '>
//         <DropdownButton
//           as={ButtonGroup}
//           id='dropdown-variants-dark'
//           variant="dark"
//           title="Dashboard"
//         >

//           <Dropdown.Item
//             as={NavLink}
//             to="/profile"
//             className='text-dark'
//           >
//             <span className='pe-2'>Profile</span> <CgProfile />
//           </Dropdown.Item>



//           <Dropdown.Item className='text-dark' eventKey="2">
//             <span className='pe-2'>
//               Notification
//             </span>
//             <IoIosNotifications />
//           </Dropdown.Item>

//           <Dropdown.Divider />
//           <Dropdown.Item className='text-dark' eventKey="4" onClick={logout}>
//             <span className='pe-2'>
//               Logout
//             </span>

//             <IoLogOut />
//           </Dropdown.Item>
//         </DropdownButton>
//       </div>
//     </header >
//   );
// }

// export default Header;


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
import '../App.css';

function Header({ toggleSidebar, onLogout }) {
  const navigate = useNavigate();

  const logout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('auth');
      localStorage.removeItem('token');
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
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data || error.message,
      });
    }
  };

  return (
    <header className="header">
      <Button
        variant="link"
        className="menu-button d-md-none"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <HiOutlineMenu />
      </Button>

      <Link to={'/'}>
        <h5 className="mb-0">
          <span className='d-flex align-items-center gap-2'>
            <AiFillDashboard /> Admin Dashboard
          </span>
        </h5>
      </Link>

      <div className='d-flex align-items-center'>
        <DropdownButton
          as={ButtonGroup}
          id='dropdown-variants-dark'
          variant="dark"
          title="Dashboard"
        >
          <Dropdown.Item
            as={NavLink}
            to="/profile"
            className='text-dark'
          >
            <span className='pe-2'>Profile</span> <CgProfile />
          </Dropdown.Item>

          <Dropdown.Item className='text-dark' eventKey="2">
            <span className='pe-2'>Notification</span> <IoIosNotifications />
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Item className='text-dark' eventKey="4" onClick={logout}>
            <span className='pe-2'>Logout</span> <IoLogOut />
          </Dropdown.Item>
        </DropdownButton>
      </div>
    </header>
  );
}

export default Header;
