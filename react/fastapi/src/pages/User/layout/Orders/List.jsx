import React, { useState, useEffect} from 'react';
import api from 'api/apiClient'
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
// import '../../App.css'
import { FaSearch } from "react-icons/fa";
import { HiMiniArrowsUpDown } from "react-icons/hi2";

function UserOrderList() {

    const [order, setOrder] = useState([])
    const [filterData, setFilterData] = useState([])

    const user = JSON.parse(window.localStorage.getItem("user"))
    const userId = user.id

    const fetchOrder = async () => {
        try {
            const response = await api.get(`/orders/${userId}`)
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
                await api.delete(`/orders/${id}`);
                setOrder(order.filter(order => order.order_id !== id));
                Swal.fire({
                    title: "Deleted!",
                    text: "Your Order has been deleted.",
                    icon: "success"
                });
                fetchOrder()

            }
            catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Faild",
                    text: error?.response?.data?.detail || error.message || "Faild To Delete Iteam"
                });
            }
        }

    };

    useEffect(() => {
        fetchOrder()
    }, [])
    return (
        <>
            <h3>Orders</h3>
            <div className="mt-3">

                <Table striped bordered hover className='text-center' responsive>
                    <thead>
                        <tr>
                            <th>
                                Sr No.
                                <span className='ps-2'>
                                    <Button>
                                        <HiMiniArrowsUpDown />
                                    </Button>
                                </span>
                            </th>
                            <th>
                                Customer Name
                                <span className='ps-2'>
                                    <Button>
                                        <HiMiniArrowsUpDown />
                                    </Button>
                                </span>
                            </th>
                            <th>
                                Product
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
                                Order Date
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
                                Coupon Used
                                <span className='ps-2'>
                                    <Button>
                                        <HiMiniArrowsUpDown />
                                    </Button>
                                </span>
                            </th>

                            <th>
                                tax
                                <span className='ps-2'>
                                    <Button>
                                        <HiMiniArrowsUpDown />
                                    </Button>
                                </span>
                            </th>

                            <th>
                                Total Price
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
                                Payment Status
                                <span className='ps-2'>
                                    <Button>
                                        <HiMiniArrowsUpDown />
                                    </Button>
                                </span>
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {filterData.map((data, index) => {
                            return (
                                <tr key={`${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{data.user.user_name}</td>
                                    <td>{data.product.product_name}</td>
                                    <td>{data.product_quantity}</td>
                                    <td>{data.order_date}</td>
                                    <td>{data.order_estimate_delivery}</td>
                                    <td>{data.order_status}</td>
                                    <td>{data.order_billing_address}</td>
                                    <td>
                                        {data.coupon_used ? <span className='active'>Yes</span> : <span className='deactive'>No</span>}
                                    </td>
                                    <td>{data.product_tax} <span>%</span> </td>
                                    <td>{data.product_discount_price}</td>
                                    <td>{data.payment.payment_name}</td>
                                    <td>
                                        {data.payment_status ? <span className='active'> Paid</span> : <span className='deactive'>Unpaid</span>}
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

export default UserOrderList