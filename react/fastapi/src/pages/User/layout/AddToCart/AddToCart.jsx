import React, { useState, useEffect } from 'react';
import api from 'api/apiClient'
import { data, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { Button, Table, Form, Col, Row } from 'react-bootstrap';

function AddToCart() {
    const userData = JSON.parse(window.localStorage.getItem('user'))
    const user_id = userData.id
    const [cartData, setCartData] = useState([])
    const [quantity, setQuantity] = useState(1)



    const fetchCartDetail = async () => {
        try {
            const response = await api.get(`/addtocart/${user_id}`)
            if (response.data) {
                setCartData(response.data)
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Oops..",
                    text: "Cart Empty"
                });
            }
        }

        catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops..",
                text: error?.response?.data?.detail || error.message || "Faild To Fetch Iteams"
            });
        }
    }

    useEffect(() => {
        fetchCartDetail()
    }, [])

    const handleChange = async (e) => {
        e.preventDefault();
        setQuantity((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
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
                await api.delete(`/addtocart/${id}`);
                fetchCartDetail();
                Swal.fire({
                    title: "Deleted!",
                    text: "Your Cart has been deleted.",
                    icon: "success"
                });
            }
            catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Faild",
                    text: error?.response?.data?.detail || error.message || "Faild To Delete Cart"
                });
            }
        }
    };



    return (
        <section className='add-to-cart-main-section '>
            <div className="container">
                <Table striped bordered hover className='text-center' responsive>
                    <thead>
                        <tr>
                            <th>
                                Product Image
                            </th>
                            <th>
                                Product Name
                            </th>
                            <th>
                                Price
                            </th>
                            <th>
                                Quantity
                            </th>
                            <th>
                                Total Price
                            </th>
                            <th>
                                Remove
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartData && (
                            cartData.map((data, index) => {
                                return (
                                    <tr key={data.cart_id}>
                                        <td>
                                            {data.product_cart.thumbnail_image && (
                                                <img
                                                    className='thumbnail_img'
                                                    src={
                                                        `http://localhost:8000${data.product_cart.thumbnail_image}`
                                                    }
                                                    alt='thumbnail_image'
                                                />
                                            )}

                                        </td>
                                        <td>{data.product_cart.product_name}</td>
                                        <td>{data.regular_price == 0 ? data.selling_price : data.regular_price}</td>
                                        <td>
                                            <Form.Group className="mb-3">
                                                <Form.Control
                                                    type="number"
                                                    placeholder="product quantity"
                                                    name="product_quantity"
                                                    // value={1}
                                                    defaultValue={1}
                                                    min={0}
                                                    max={100}
                                                    onChange={handleChange}
                                                    step={1}
                                                // required
                                                />
                                            </Form.Group>
                                        </td>
                                        <td>{data.selling_price == 0 ? data.regular_price : data.selling_price}</td>
                                        <td>
                                            <Button variant="danger" onClick={() => { handleDelete(data.cart_id) }}>Delete</Button>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </Table>
                {cartData == '' && <>
                    <h1>
                        Your Cart Is  Empty
                    </h1>
                </>}
            </div>
        </section>
    )
}

export default AddToCart