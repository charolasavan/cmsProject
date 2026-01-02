import React, { useState, useEffect } from 'react';
import api from 'api/apiClient';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { Button, Table, Form, Row, Col, Card } from 'react-bootstrap';

function AddToCart() {
    const userData = JSON.parse(window.localStorage.getItem('user'));
    const user_id = userData.id;
    const [cartData, setCartData] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [cartSummary, setCartSummary] = useState({ sub_total_price: 0, discount: 0, total_price: 0 });
    const navigate = useNavigate();
    // Fetch cart details
    const fetchCartDetail = async () => {
        try {
            const response = await api.get(`/addtocart/${user_id}`);
            if (response.data) {
                const items = response.data.cart_items || response.data;
                setCartData(items);
                // setCouponCode(response.data.coupon_code || '');
                // calculateCartSummary(items, response.data.discount || 0);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCartDetail();
    }, []);

    const handleQuantityChange = (e, cart_id) => {
        const value = Number(e.target.value);
        const updatedCart = cartData.map(item =>
            item.cart_id === cart_id ? { ...item, product_quantity: value } : item
        );
        setCartData(updatedCart);
    };



    // Handle delete
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/addtocart/${id}`);
                Swal.fire({
                    title: "Deleted!",
                    text: "Your cart item has been deleted.",
                    icon: "success"
                });
                fetchCartDetail();
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text: error?.response?.data?.detail || error.message || "Failed to delete cart"
                });
            }
        }
    };

    // Handle Update button
    const handleUpdateCart = async () => {
        try {

            const response = await api.put(`/addtocart/update/`, cartData);
            if (response.data) {
                setCartSummary({
                    sub_total_price: response.data.sub_total_price
                })
                fetchCartDetail()
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error?.response?.data?.detail || error.message || "Failed to update cart"
            });
        }
    };

    const handleCoupon = async () => {
        try {
            // const code = new FormData()
            // code.append('code', couponCode)
            const code = {
                items: cartData,
                coupon_code : couponCode
            }          
            console.log(code)
            const response = await api.put(`/addtocart/applycoupon`, code);
            // const response = await api.put(`/addtocart/update`, code);
            if (response.data) {
                console.log(response.data)
            }
        }
        catch (error) {
            console.error(error)
        }
    }
    return (
        <section className='add-to-cart-main-section'>
            <div className="container">
                <div className='back-to-page mb-3'>
                    <Button variant="secondary" onClick={() => navigate(-1)}>Back to page</Button>
                </div>

                <Table striped bordered hover className='mt-3 text-center' responsive>
                    <thead>
                        <tr>
                            <th>Product Image</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartData.length > 0 ? cartData.map(item => {
                            // const price = item.selling_price || item.regular_price;
                            return (
                                <tr key={item.cart_id}>
                                    <td>
                                        {item.product_cart.thumbnail_image && (
                                            <img
                                                className='thumbnail_img'
                                                src={`http://localhost:8000${item.product_cart.thumbnail_image}`}
                                                alt='thumbnail'
                                                style={{ width: '50px' }}
                                            />
                                        )}
                                    </td>
                                    <td>{item.product_cart.product_name}</td>
                                    <td>₹{item.regular_price}</td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            min={1}
                                            max={100}
                                            value={item.product_quantity}
                                            onChange={(e) => handleQuantityChange(e, item.cart_id)}
                                        />
                                    </td>

                                    <td>₹{(item.selling_price).toFixed(2)}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleDelete(item.cart_id)}>Delete</Button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={6}>Your cart is empty</td>
                            </tr>
                        )}

                        {/* Coupon row */}
                        <tr>
                            <td colSpan={4}>
                                <div className='d-flex gap-2'>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Coupon Code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <Button onClick={handleCoupon}>Apply</Button>
                                </div>
                            </td>
                            <td colSpan={2}>
                                <Button variant="primary" onClick={handleUpdateCart}>Update Cart</Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>

                {/* Cart Summary */}
                <Row className="justify-content-end mt-3">
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <h5>Cart Summary</h5>
                                <p>Subtotal: ₹{cartSummary.sub_total_price}</p>
                                <p>Discount: ₹{cartSummary.discount}</p>
                                <hr />
                                <h5>Total: ₹{cartSummary.total_price}</h5>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </section>
    );
}

export default AddToCart;
