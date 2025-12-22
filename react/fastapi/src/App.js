import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';

import AdminLayout from './pages/Admin/layout/mainLayout/adminLayout';
import Dashboard from './pages/Admin/layout/AdminDashboard/Dashboard';
import AdminProfile from './pages/Admin/layout/AdminProfile/AdminProfile';

// Users
import Users from './pages/Admin/layout/Users/List';
import AddUser from 'pages/Admin/layout/Users/Add';
import UpdateUsers from 'pages/Admin/layout/Users/Update';


// Category
import Category from 'pages/Admin/layout/Category/List';
import UpdateCategory from 'pages/Admin/layout/Category/Update';

//products
import ProductList from 'pages/Admin/layout/Products/List';
import UpdateProducts from 'pages/Admin/layout/Products/Update'
import AddProduct from 'pages/Admin/layout/Products/Add';

//orders
import OrderList from 'pages/Admin/layout/Orders/List';


//CouponsCode
import CouponList from 'pages/Admin/layout/Coupons/List';
import AddCoupon from 'pages/Admin/layout/Coupons/Add';
import EditCoupon from 'pages/Admin/layout/Coupons/Update';


// ProductTax
import ProductTaxList from 'pages/Admin/layout/ProductTax/List';
import AddTax from 'pages/Admin/layout/ProductTax/Add';

// User File Define 
import UserLayout from 'pages/User/layout/MainLayout/UserLayout';
import UserDashboard from 'pages/User/layout/UserDashboard/UserDashboard';



// Products
import UserProductList from 'pages/User/layout/products/List';
import ProductDetail from 'pages/User/layout/ProductDetail/ProductDetail';


// Order
import UserOrderList from 'pages/User/layout/Orders/List';


// Create Account 
import CreateAccount from 'pages/User/layout/AccountCreate/CreateAccount';



// User Profile 
import UserProfile from 'pages/User/layout/UserProfile/UserProfile';
import UpdateProfile from 'pages/User/layout/UserProfile/UpdateProfile';

// Add to Cart 
import AddToCart from 'pages/User/layout/AddToCart/AddToCart';


function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN PAGE */}
        <Route path="/login" element={<LoginPage />} />
        <Route path='/create-account' element={<CreateAccount />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRole="admin">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<AdminProfile />} />

          {/* User Routes */}
          <Route path="users" element={<Users />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/update/:id" element={<UpdateUsers />} />

          {/* Category Routes */}
          <Route path="category" element={<Category />} />
          <Route path="category/update/:id" element={<UpdateCategory />} />

          {/* Products */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/update/:id" element={<UpdateProducts />} />

          {/* Product Tax */}
          <Route path="tax" element={<ProductTaxList />} />
          <Route path="tax/add" element={<AddTax />} />

          {/* Orders */}
          <Route path="orders" element={<OrderList />} />
          {/* <Route path="orders/add" element={<AddProduct />} />
          <Route path="orders/update/:id" element={<UpdateProducts />} /> */}


          {/* Coupons */}
          <Route path="coupons" element={<CouponList />} />
          <Route path="coupons/add" element={<AddCoupon />} />
          <Route path="coupons/update/:id" element={<EditCoupon />} />

        </Route>



        {/* User ROUTES */}
        <Route
          path="/user"
          element={
            <PrivateRoute allowedRole="user">
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          {/* <Route index  element={<UserProductList   />} /> */}


          {/* Category  */}
          {/* <Route path="categories" element={<UserCategoryList />} /> */}

          {/* Products  */}
          <Route path="products" element={<UserProductList />} />
          <Route path="products/:id" element={<ProductDetail />} />

          {/* Orders  */}
          <Route path="orders" element={<UserOrderList />} />

          {/* categories */}  
          <Route path="profile" element={<UserProfile />} />
          <Route path="profile/update/:id" element={<UpdateProfile />} />

          {/* Add To Cart */}
          <Route path="addtocart" element={<AddToCart />} />


        </Route>

        {/* DEFAULT REDIRECT */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;






































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

// import OrderList from './pages/List/OrderList';
// import PrivateRoute from './components/PrivateRoute';

// import CouponList from './pages/List/CouponList';
// import AddCoupon from './pages/Add/AddCoupon';
// import EditCoupon from './pages/Update/EditCoupon';


// function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
//   const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
//   const userRole = window.localStorage.getItem("userRole")
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
//     localStorage.removeItem('token');  // clear JWT token
//     setIsLoggedIn(false);
//   };

//   // console.log(userRole)
//   return (
//     <Router>
//       {!isLoggedIn ? (
//         <Routes>
//           <Route path="/" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       ) : (

//         <div className="app-container">
//           <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} />
//           <div className="main-content">
//             <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//             <div className="content-area">
//               <Routes>

//                 {userRole == 'user' &&
//                   (
//                     <>
//                       {/* <Route path='/' element={<LoginPage />} /> */}
//                       <Route path="/dashboard" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <Home />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/products" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <ProductList />
//                         </PrivateRoute>
//                       } />

//                     </>
//                   )
//                 }
//                 {userRole == "admin" &&
//                   (
//                     <>
//                       <Route path="/dashboard" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <Home />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/profile" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <UserProfile />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/products" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <ProductList />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/products/add" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <AddProduct />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/editproduct/:id" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <EditProduct />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/users" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <UserList />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/users/add" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <AddUser />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/edituser/:id" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <EditUser />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/categories" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <CategoryList />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/editcategory/:id" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <EditCategory />
//                         </PrivateRoute>
//                       } />


//                       <Route path="/orders" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <OrderList />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/coupon" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <CouponList />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/coupon/add" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <AddCoupon />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/editcoupon/:id" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <EditCoupon />
//                         </PrivateRoute>
//                       } />
//                     </>
//                   )

//                 }



//                 <Route path="*" element={<Navigate to="/dashboard" />} />
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







// user
//                 layout
//                   hader
//                   footer
//                   sidebar

//                   layouts
//               admin
//                 layout
//                   hader
//                   footer
//                   sidebar

//                   layouts


//                   APP.JS


//                   user
//                     layout

//                   admin
//                     layout





















// {userRole == 'admin' && (
//             <>
//               <div className="app-container">
//                 <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} />
//                 <div className="main-content">
//                   <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//                   <div className="content-area">
//                     <Routes>

//                       <Route path="/dashboard" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <Home />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/profile" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <UserProfile />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/products" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <ProductList />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/products/add" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <AddProduct />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/editproduct/:id" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <EditProduct />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/users" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <UserList />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/users/add" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <AddUser />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/edituser/:id" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <EditUser />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/categories" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <CategoryList />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/editcategory/:id" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <EditCategory />
//                         </PrivateRoute>
//                       } />


//                       <Route path="/orders" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <OrderList />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/coupon" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <CouponList />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/coupon/add" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <AddCoupon />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/editcoupon/:id" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <EditCoupon />
//                         </PrivateRoute>
//                       } />


//                       <Route path="*" element={<Navigate to="/dashboard" />} />
//                       <Route path="*" element={<Navigate to="/dashboard" />} />

//                     </Routes>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}




//           {userRole == 'user' && (
//             <>
//               <div className="app-container">
//                 <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} />
//                 <div className="main-content">
//                   <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
//                   <div className="content-area">
//                     <Routes>

//                       <Route path="/dashboard" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <Home />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/profile" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <UserProfile />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/products" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <ProductList />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/products/add" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <AddProduct />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/editproduct/:id" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <EditProduct />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/users" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <UserList />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/users/add" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <AddUser />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/edituser/:id" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <EditUser />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/categories" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <CategoryList />
//                         </PrivateRoute>
//                       } />
//                       <Route path="/editcategory/:id" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <EditCategory />
//                         </PrivateRoute>
//                       } />


//                       <Route path="/orders" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <OrderList />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/coupon" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <CouponList />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/coupon/add" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <AddCoupon />
//                         </PrivateRoute>
//                       } />

//                       <Route path="/editcoupon/:id" element={
//                         <PrivateRoute isLoggedIn={isLoggedIn}>
//                           <EditCoupon />
//                         </PrivateRoute>
//                       } />


//                       <Route path="*" element={<Navigate to="/dashboard" />} />
//                       <Route path="*" element={<Navigate to="/dashboard" />} />

//                     </Routes>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}




//           {userRole == 'admin' && (
//             <>
//               <Route element={<Sidebar />}>
//                 <Route path='/dashboard' element={<Home />} />
//               </Route>
//             </>
//           )}
