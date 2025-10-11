import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import Swal from 'sweetalert2'

function EditCoupon() {
    const { id } = useParams()

    const [coupon, setCoupon] = useState({
        code: '',
        discount_price: 0,
        expires_date: '',
        is_active: false,
        usage_limit: 0,
    });

    const [formError, setFormError] = useState([])
    const navigate = useNavigate();




    // Handle input changes
    const handleChange = (e) => {
        e.preventDefault();
        setCoupon((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = {}

        if (!coupon.code?.trim()) {
            validation.code = "Code is Required!!!"
        }
        if (!coupon.discount_price) {
            validation.discount_price = "Discount Price is Required!!!"
        }
        if (!coupon.expires_date) {
            validation.expires_date = "Expire Date is Required!!!"
        }
        if (!coupon.usage_limit) {
            validation.usage_limit = "Usage Limit is Required!!!"
        }

        

        setFormError(validation)


        if (Object.keys(validation).length === 0) {
            const addCoupon = new FormData();
            addCoupon.append('code', coupon.code.trim());
            addCoupon.append('discount_price', coupon.discount_price);
            addCoupon.append('expires_date', coupon.expires_date);
            addCoupon.append('is_active', coupon.is_active);
            addCoupon.append('usage_limit', coupon.usage_limit);

            try {
                await api.put(`/coupons/${id}/`, addCoupon);

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "success",
                    title: "Update Coupons is successfully"
                });
                navigate(-1);

            }
            catch (error) {


                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.response?.data?.detail || "Failed to Edit Coupons.",
                });
            }
        };
    }

    useEffect(() => {
        const fetchCouponDetail = async () => {
            try {
                const res = await api.get(`/coupons/${id}`);
                setCoupon(res.data)

            }
            catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops..",
                    text: error?.response?.data?.detail || error.message || "Faild To Fetch Detail"
                });
            }
        };

        fetchCouponDetail();
    }, [id]);



    return (
        <div className="m-3">
            <h3>Edit Coupons</h3>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>

                        <Form.Group className='mb-3'>
                            <Form.Label>Enter Custome Code</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Code"
                                name="code"
                                value={coupon.code}
                                onChange={handleChange}

                            />
                            {formError.code && <span className='validationError'>{formError.code}</span>}
                        </Form.Group>

                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Discount Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Discount Price"
                                name="discount_price"
                                value={coupon.discount_price}
                                onChange={handleChange}
                            // required
                            />
                            {formError.discount_price && <span className='validationError'>{formError.discount_price}</span>}
                        </Form.Group>
                    </Col>

                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Expire Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={coupon.expires_date}
                                name='expires_date'
                                onChange={handleChange}
                            />
                            {formError.expires_date && <span className='validationError'>{formError.expires_date}</span>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Max Usage Limit</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Usage Limit"
                                name="usage_limit"
                                value={coupon.usage_limit}
                                onChange={handleChange}
                            />
                            {formError.usage_limit && <span className='validationError'>{formError.usage_limit}</span>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className='mb-3'>
                            <Form.Label>Is Active</Form.Label>
                            <Form.Select
                                name="is_active"
                                value={coupon.is_active}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Select</option>
                                <option value={true}>Active</option>
                                <option value={false}>DeActive</option>
                            </Form.Select>
                            {formError.is_active && <span className='validationError'>{formError.is_active}</span>}
                        </Form.Group>
                    </Col>

                </Row>
                <div className="d-flex">
                    <Button className="me-2" variant="primary" type="submit">
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/coupon')}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div >
    );
}

export default EditCoupon;
