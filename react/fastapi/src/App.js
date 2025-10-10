// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import Sidebar from './components/Sidebar';
// import Header from './components/Header';

// import Home from './pages/Home';

// import ProductList from './pages/List/ProductList';
// import AddProduct from './pages/Add/AddProduct';
// import EditProduct from './pages/Update/EditProduct';

// import UserList from './pages/List/UserList';
// import AddUser from './pages/Add/AddUser';
// import EditUser from './pages/Update/EditUser';

// import CategoryList from './pages/List/CategoryList';
// import EditCategory from './pages/Update/EditCategory';

// import LoginPage from './pages/LoginPage';
// import UserProfile from './pages/UserProfile';

// function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
//   const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('user'));

//   useEffect(() => {
//     const handleResize = () => {
//       setSidebarOpen(window.innerWidth >= 768);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('auth');
//     setIsLoggedIn(false);
//   };

//   return (
//     <Router>
//       {!isLoggedIn ? (
//         <Routes>
//           <Route path="/" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
//         </Routes>
//       ) : (
//         <div className="app-container">
//           <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} />
//           <div className="main-content">
//             <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//             <div className="content-area">
//               <Routes>
//                 <Route path="/dashboard" element={<Home />} />
//                 <Route path="/profile" element={<UserProfile />} />

//                 <Route path="/products" element={<ProductList />} />
//                 <Route path="/products/add" element={<AddProduct />} />
//                 <Route path="/editproduct/:id" element={<EditProduct />} />

//                 <Route path="/users" element={<UserList />} />
//                 <Route path="/users/add" element={<AddUser />} />
//                 <Route path="/edituser/:id" element={<EditUser />} />

//                 <Route path="/categories" element={<CategoryList />} />
//                 <Route path="/editcategory/:id" element={<EditCategory />} />

//                 <Route path="*" element={<Navigate to="/dashboard" />} />
//               </Routes>
//             </div>
//           </div>
//         </div>
//       )}
//     </Router>
//   );
// }

// export default App;




import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Home from './pages/Home';

import ProductList from './pages/List/ProductList';
import AddProduct from './pages/Add/AddProduct';
import EditProduct from './pages/Update/EditProduct';

import UserList from './pages/List/UserList';
import AddUser from './pages/Add/AddUser';
import EditUser from './pages/Update/EditUser';

import CategoryList from './pages/List/CategoryList';
import EditCategory from './pages/Update/EditCategory';

import LoginPage from './pages/LoginPage';
import UserProfile from './pages/UserProfile';

import OrderList from './pages/List/OrderList';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth');
    localStorage.removeItem('token');  // clear JWT token
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <div className="app-container">
          <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} />
          <div className="main-content">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="content-area">
              <Routes>
                <Route path="/dashboard" element={
                  <PrivateRoute isLoggedIn={isLoggedIn}>
                    <Home />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute isLoggedIn={isLoggedIn}>
                    <UserProfile />
                  </PrivateRoute>
                } />

                <Route path="/products" element={
                  <PrivateRoute isLoggedIn={isLoggedIn}>
                    <ProductList />
                  </PrivateRoute>
                } />
                <Route path="/products/add" element={
                  <PrivateRoute isLoggedIn={isLoggedIn}>
                    <AddProduct />
                  </PrivateRoute>
                } />
                <Route path="/editproduct/:id" element={
                  <PrivateRoute isLoggedIn={isLoggedIn}>
                    <EditProduct />
                  </PrivateRoute>
                } />

                <Route path="/users" element={
                  <PrivateRoute isLoggedIn={isLoggedIn}>
                    <UserList />
                  </PrivateRoute>
                } />
                <Route path="/users/add" element={
                  <PrivateRoute isLoggedIn={isLoggedIn}>
                    <AddUser />
                  </PrivateRoute>
                } />
                <Route path="/edituser/:id" element={
                  <PrivateRoute isLoggedIn={isLoggedIn}>
                    <EditUser />
                  </PrivateRoute>
                } />

                <Route path="/categories" element={
                  <PrivateRoute isLoggedIn={isLoggedIn}>
                    <CategoryList />
                  </PrivateRoute>
                } />
                <Route path="/editcategory/:id" element={
                  <PrivateRoute isLoggedIn={isLoggedIn}>
                    <EditCategory />
                  </PrivateRoute>
                } />


                <Route path="/orders" element={
                  <PrivateRoute isLoggedIn={isLoggedIn}>
                    <OrderList />
                  </PrivateRoute>
                } />

                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
