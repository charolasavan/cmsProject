import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
import '../../App.css'
import { FaSearch } from "react-icons/fa";
import { HiMiniArrowsUpDown } from "react-icons/hi2";

function OrderList() {

  const [order, setOrder] = useState([])
  const [filterData, setFilterData] = useState([])

  const fetchOrder = async () => {
    try {
      const response = await api.get('/orders/')
      setOrder(response.data)
      setFilterData(response.data)
    }
    catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops..",
        text: error?.response?.data?.detail || error.message || "Faild To Fetch Order Data"
      });
    }


  }

  useEffect(() => {
    fetchOrder()
  }, [])
  return (
    <>
      <h3>Orders</h3>
      <div className="mt-3">
        {/* <Button
          className='mb-3'
          variant='primary'
        // onClick={() => navigate('/products/add')}
        >
          Add Order
        </Button> */}

        <Table striped bordered hover className='text-center' responsive>
          <thead>
            <tr>
              <th>
                Order id
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>
              <th>
                Product id
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>
              <th>
                Products
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>
              <th>
                Quantity
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                Price
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                Order Date
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                User Name
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                Address
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                Email Id
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                Mobile number
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                Payment Type
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                Product Taxes
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                Order Status
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                Billing Address
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                Discount Code
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                Total Discount
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                Payment Status
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                Used Coupon
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>

              <th>
                Estimate Delivery Date
                <span className='ps-2'>
                  <Button>
                    <HiMiniArrowsUpDown />
                  </Button>
                </span>
              </th>


              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterData.map((data, index) => {
              return (
                <tr key={`${index}`}>
                  <td>{data.order_id}</td>
                  <td>{data.product_id}</td>
                  <td>{data.products}</td>
                  <td>{data.product_quantity}</td>
                  <td>{data.product_price}</td>
                  <td>{data.order_date}</td>
                  <td>{data.user_name}</td>
                  <td>{data.user_address}</td>
                  <td>{data.user_email_id}</td>
                  <td>{data.mobile_number}</td>
                  <td>{data.payment_type}</td>
                  <td>{data.product_taxes}</td>
                  <td>{data.order_status}</td>
                  <td>{data.billing_address}</td>
                  <td>{data.discount_code}</td>
                  <td>{data.total_discount_price}</td>
                  <td>{data.payment_status}</td>
                  <td>{data.coupon_use}</td>
                  <td>{data.estimate_delivery_date}</td>

                  <td>
                    <Link to={`/EditProduct/${data.id}`}>
                      <Button>Edit</Button>
                    </Link>
                  </td>
                  <td>
                    <Button variant="danger" >Delete</Button>

                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>



    </>
  )
}

export default OrderList