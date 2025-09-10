import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
// import Form from 'react-bootstrap/Form';
import api from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

function ProductList() {
  const [productData, setProductData] = useState([])
  const navigate = useNavigate();
  // FetchAll product 
  const fetchProduct = async () => {
    try {
      const response = await api.get('/products/')
      setProductData(response.data);
      console.log(response)
    }
    catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops..",
        text: error?.response?.data?.detail || error.message || "Faild To Fetch Iteams"
      });
    }
  };

  // fetch category

  // const fetchCategory = async () => {
  //   try {
  //     const response = await api.get('/products/')
  //     setCategory(response.data)

  //   }
  //   catch (error) {
  //     console.error("Error fetching items:", error);
  //   }
  // }

  // Handle Delete product 

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    })

    if (result.isConfirmed) {
      try {

        await api.delete(`/products/${id}`);
        setProductData(productData.filter(productData => productData.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "Your Product has been deleted.",
          icon: "success"
        });

      }
      catch (error) {
        // console.log("Error is", error.data)
        Swal.fire({
          icon: "error",
          title: "Faild",
          text: error?.response?.data?.detail || error.message || "Faild To Delete Iteam"
        });
      }
    }

  };

  // Call Api useing useEffect hook

  useEffect(() => {
    fetchProduct();
    // fetchCategory();
    // fetchImage()
  }, []);


  // handle category
  // const handleCategory = (e) => {
  //   e.preventDefault()
  //   // console.log(select.current)
  //   // console.log(category)

  // }


  return (
    <div>
      <h3>Products</h3>

      <div className='mt-3'>
        <Button className='mb-3' variant='primary' onClick={() => navigate('/products/add')}>
          Add
        </Button>
        <Table striped bordered hover className='text-center'>
          <thead>
            <tr>
              <th>id</th>
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Product Brand</th>
              <th>Product Company</th>
              <th>Product Category</th>
              <th>Thumbnail Images</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {productData.map((data) => {
              return (
                <tr key={`${data.id}-${data.product_name}`}>
                  <td>{data.id}</td>
                  <td>{data.product_name}</td>
                  <td>{data.product_price}</td>
                  <td>{data.product_brand}</td>
                  <td>{data.product_company}</td>
                  <td>{data.category_id}</td>
                  <td>
                    <img
                      className='thumbnail_img'
                      src={`http://localhost:8000${data.thumbnail_image}`}
                      alt='productImage'
                    />
                  </td>
                  <td>
                    <Link to={`/EditProduct/${data.id}`}>
                      <Button>Edit</Button>
                    </Link>
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => {
                      handleDelete(data.id)
                    }}>Delete</Button>

                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>

    </div >
  );
}



export default ProductList;
