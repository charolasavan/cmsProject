import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from 'api/apiClient'
import Swal from 'sweetalert2';
// import Dropdown from 'react-bootstrap/Dropdown';

function AddTax() {
    const [tax, setTax] = useState({
        tax_name: '',
        tax_value: '',
        tax_active: '',
    });
    const [formError, setFormError] = useState([])
    const navigate = useNavigate();


    const handleChange = async (e) => {
        setTax((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validation = {}

        if (!tax.tax_name?.trim()) {
            validation.tax_name = "Tax Name is required"
        }

        if (!tax.tax_value) {
            validation.tax_value = "Insert Text Amount"
        }

        if (!tax.tax_active) {
            validation.tax_active = "Select Please"
        }

        setFormError(validation)


        if (Object.keys(validation).length === 0) {
            const addTax = new FormData();

            addTax.append('tax_name', tax.tax_name.trim());
            addTax.append('tax_value', parseInt(tax.tax_value));
            addTax.append('tax_active', parseInt(tax.tax_active));

            // addTax.forEach((e) => { console.log(e) })
            try {
                await api.post('/tax/', addTax);

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
                    title: "Tax Added successfully"
                });
                navigate('/admin/tax');
            }
            catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.response?.data?.detail || "Failed to Add Coupon.",
                });
            }
        }
    }
    return (
        <div className="m-3">
            <h3>Add Tax</h3>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group className='mb-3'>
                            <Form.Label>Tax Name</Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Tax Name"
                                name="tax_name"
                                value={tax.tax_name}
                                onChange={handleChange}
                            />
                            {formError.tax_name && <span className='validationError'>{formError.tax_name}</span>}
                        </Form.Group>

                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Tax Amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Tax Amount"
                                name="tax_value"
                                value={tax.tax_value}
                                onChange={handleChange}
                            />
                            {formError.tax_value && <span className='validationError'>{formError.tax_value}</span>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className='mb-3'>
                            <Form.Label>Tax Status</Form.Label>
                            <Form.Select
                                name="tax_active"
                                value={tax.tax_active}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Select</option>
                                <option value={0}>Active</option>
                                <option value={1}>DeActive</option>
                            </Form.Select>
                            {formError.tax_active && <span className='validationError'>{formError.tax_active}</span>}
                        </Form.Group>
                    </Col>
                </Row>
                <div className="d-flex">
                    <Button className="me-2" variant="primary" type="submit">
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/admin/tax')}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default AddTax;