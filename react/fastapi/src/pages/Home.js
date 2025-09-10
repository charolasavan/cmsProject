import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import api from '../api'
import Swal from 'sweetalert2';
function Home() {
  const [countUser, setCountUser] = useState(0)
  const [countProducts, setCountProducts] = useState(0)
  const fetchUserCount = async () => {
    try {
      const user = await api.get('/users/')
      const countUser = user.data.length
      setCountUser(countUser)
    }
    catch (error) {
      Swal.fire({
        icon: "error",
        title: "Invalid Detail",
        text: error?.response?.data?.detail || error.message || "Unknown error"
      });
    }
  }
  const fetchProductCount = async () => {
    try {
      const product = await api.get('/products/')
      const countProduct = product.data.length
      setCountProducts(countProduct)
    }
    catch (error) {
      // alert(error)
      // console.error(error)
      Swal.fire({
        icon: "error",
        title: "Faild !!!",
        text: error?.response?.data?.detail || error.message || "Faild To Fetch Data"


      });
    }

  }
  useEffect(() => {
    fetchUserCount()
    fetchProductCount()
  }, [])
  return (
    <Container>
      <h2>Welcome to the Admin Dashboard</h2>
      <p>Manage All Product And Category </p>


      <div className="container mt-4">
        <div className="row justify-content-center g-4">
          {/* User Card */}
          <div className="col-md-4">
            <div className="card text-white bg-primary shadow h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Total Users</h5>
                <p className="card-text display-5 fw-bold">{countUser}</p>
              </div>
            </div>
          </div>

          {/* Product Card */}
          <div className="col-md-4">
            <div className="card text-white bg-success shadow h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Total Products</h5>
                <p className="card-text display-5 fw-bold">{countProducts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Home;
