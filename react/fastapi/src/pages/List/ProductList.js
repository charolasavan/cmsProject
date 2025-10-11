import React, { useState, useEffect } from 'react';
// import Table from 'react-bootstrap/Table';
// import 'swiper/css';
import api from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
// import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button, Table } from 'react-bootstrap';
import '../../App.css'

function ProductList() {
  const [productData, setProductData] = useState([])
  // const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate();

  // FetchAll product 
  const fetchProduct = async () => {
    try {
      const response = await api.get('/products/')
      setProductData(response.data);
    }
    catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops..",
        text: error?.response?.data?.detail || error.message || "Faild To Fetch Iteams"
      });
    }
  };
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
  }, []);
  const settings = {
    dots: true,
    lazyLoad: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 2
  };

  return (
    <div>
      <h3>Products</h3>

      <div className='mt-3'>
        <Button className='mb-3' variant='primary' onClick={() => navigate('/products/add')}>
          Add Product
        </Button>
        <Table striped bordered hover className='text-center' responsive>
          <thead>
            <tr>
              <th>id</th>
              <th>Product Name</th>
              <th>Quantity / Units</th>
              <th>Regular price</th>
              <th>Selling price</th>
              <th>Product Brand</th>
              <th>Product Company</th>
              <th>Product Status</th>
              <th>Product Category</th>
              <th>Thumbnail Images</th>
              {/* <th>Images</th> */}
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
                  <td>{data.product_quantity}</td>
                  <td>{data.regular_price}</td>
                  <td>{data.selling_price}</td>
                  <td>{data.product_brand}</td>
                  <td>{data.product_company}</td>
                  <td>
                    {
                      data.product_status == "Active" ?
                        (
                          <p className='active'>
                            Active
                          </p>
                        ) :
                        (
                          <p className='deactive'>
                            DeActive
                          </p>
                        )
                    }
                  </td>
                  <td>{data.category.category_name}</td>
                  <td>
                    <img
                      className='thumbnail_img'
                      src={`http://localhost:8000${data.thumbnail_image}`}
                      alt='productImage'
                    />
                  </td>
                  {/* <td>
                    <Button variant='success'
                      onClick={() => { setIsOpen(!isOpen) }}
                    >View</Button>
                    {isOpen && (
                      <>
                        <div className='product_image_viewer'>
                          <div className='d-flex justify-content-end'>
                            <Button
                              onClick={() => { setIsOpen(!isOpen) }}>
                              Close
                            </Button>
                          </div>
                          <div>
                            <div className="slider-container">
                              <Slider {...settings}>

                                {data.images.map((name, index) => {
                                  return (
                                    <div key={index} className='d-flex justify-content-center' >
                                      <img
                                        className='product_image'
                                        src={`http://localhost:8000${name.image_name}`}
                                        alt='productImage'
                                      />
                                    </div>
                                  )

                                })}
                              </Slider>
                            </div>
                          </div>

                        </div>
                      </>

                    )}
                  </td> */}
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
