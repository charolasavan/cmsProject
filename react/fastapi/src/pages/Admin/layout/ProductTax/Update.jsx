import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

import api from 'api/apiClient'
import Swal from 'sweetalert2';
import { Button, Col, Form, Row } from 'react-bootstrap';

const EditTax = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [tax, setTex] = useState({
        tax_name: '',
        tax_value: '',
        tax_active: '',
    });

    const [formError, setFormError] = useState([])

    // Fetch product data
    const fetchTax = async () => {

        try {
            const res = await api.get(`/tax/${id}`);
            setTex(res.data)
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops..",
                text: error?.response?.data?.detail || error.message || "Faild To Fetch Iteam"
            });
        }
    };

    // UseEffect to fetch product and categories
    useEffect(() => {

        fetchTax();
    }, [id]);

    const handleChange = (e) => {
        // e.preventDefault();
        setTex((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = {}
        if (!tax.tax_name?.trim()) {
            validation.tax_name = "Tax Name  is required"
        }

        // if (!tax.tax_value?.trim()) {
        //     validation.tax_value = "Tax Value is required"
        // }

        // if (!tax.tax_active) {
        //     validation.tax_active = "Tax  is required"
        // }


        setFormError(validation)
        if (Object.keys(validation).length === 0) {
            const formData = new FormData();
            formData.append('tax_name', tax.tax_name.trim());
            formData.append('tax_values', tax.tax_value);
            formData.append('tax_active', tax.tax_active);

            try {
                await api.put(`/tax/${id}/`, formData);
                await fetchTax();

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Tax updated successfully',
                    timer: 1500,
                    showConfirmButton: false,
                });

                navigate('/admin/tax');
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: error?.response?.data?.detail || error.message || 'Failed to update Tax',
                });
                console.log(error)
            }
            // formData.forEach(element => {
            //     console.log(element)
            // })
        }


    };



    return (
        <>
            <div className='m-3'>
                <h3 >Update Tax</h3>
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
                                {/* {formError.tax_value && <span className='validationError'>{formError.tax_value}</span>} */}
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
                                {/* {formError.tax_active && <span className='validationError'>{formError.tax_active}</span>} */}
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
        </>

    )
}

export default EditTax