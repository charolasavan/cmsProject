
import React, { useState } from 'react';
import { Button, Form, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from 'api/apiClient'
import Swal from 'sweetalert2';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaLock } from "react-icons/fa";

function AddUser() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        user_name: '',
        user_password: '',
        email_id: '',
        phone_number: '',
        dob: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        profile_img: '',
    })
    const [formError, setFormError] = useState([])
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    // Handle input changes
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.name === 'profile_img') {
            setUserData((prev) => ({
                ...prev,
                [e.target.name]: e.target.files[0],
            }));
        } else {
            setUserData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }));
        }

    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = {}

        if (!userData.user_name?.trim()) {
            validation.user_name = "UserName is Required!!!"
        }
        if (!userData.user_password?.trim()) {
            validation.user_password = "Password is Required!!!"
        }
        if (!userData.email_id?.trim()) {
            validation.email_id = "EmailID is Required!!!"
        }
        if (!userData.phone_number?.trim()) {
            validation.phone_number = "PhoneNumber is Required!!!"
        }
        else if (userData.phone_number.length != 10 && userData.phone_number) {
            validation.phone_number = "Please Enter Valid Number!!!"
        }
        if (!userData.dob?.trim()) {
            validation.dob = "DOB is Required!!!"
        }
        if (!userData.gender?.trim()) {
            validation.gender = "Gender is Required!!!"
        }
        if (!userData.address?.trim()) {
            validation.address = "Address is Required!!!"
        }
        if (!userData.city?.trim()) {
            validation.city = "City is Required!!!"
        }
        if (!userData.state?.trim()) {
            validation.state = "State is Required!!!"
        }
        if (!userData.zip_code?.trim()) {
            validation.zip_code = "ZipCode is Required!!!"
        }
        if (!userData.country?.trim()) {
            validation.country = "Country is Required!!!"
        }
        if (!userData.profile_img) {
            validation.profile_img = "ProfileImage is Required!!!"
        }
        setFormError(validation)


        if (Object.keys(validation).length === 0) {
            const addUserData = new FormData();

            addUserData.append('user_name', userData.user_name.trim());
            addUserData.append('user_password', userData.user_password.trim());
            addUserData.append('email_id', userData.email_id.trim());
            addUserData.append('phone_number', userData.phone_number.trim());
            addUserData.append('dob', userData.dob.trim());
            addUserData.append('gender', userData.gender.toString().trim());
            addUserData.append('address', userData.address.trim());
            addUserData.append('city', userData.city.trim());
            addUserData.append('state', userData.state.trim());
            addUserData.append('zip_code', userData.zip_code.trim());
            addUserData.append('country', userData.country.trim());
            addUserData.append('profile_img', userData.profile_img);

            try {
                await api.post('/users/', addUserData);
                // alert('User added successfully!');
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
                    title: "User Create successfully"
                });
                navigate('/admin/users');
            }
            catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.response?.data?.detail || "Failed to add User.",
                });
                // alert('Failed to upload product');
            }
        }




    };
    return (
        <Container className="py-4">
            <h3 className="mb-4">Add New User</h3>
            <Form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <h5 className="mb-3">Personal Information</h5>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" name='user_name' placeholder="Savan Charola" onChange={handleChange} />
                        {formError.user_name && <span className='validationError'>{formError.user_name}</span>}
                    </Col>
                    <Col md={6}>
                        <Form.Label>Password</Form.Label>
                        <div className="position-relative">
                            <Form.Control
                                type={isPasswordShown ? 'text' : 'password'}
                                placeholder="Password"
                                className="form-control ps-5 pe-5"
                                name="user_password"
                                onChange={handleChange}
                            />
                            <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary">
                                <FaLock />
                            </span>
                            <span
                                className="position-absolute top-50 end-0 translate-middle-y pe-3 text-secondary"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsPasswordShown(prev => !prev)}
                            >
                                {isPasswordShown ? <MdVisibility /> : <MdVisibilityOff />}
                            </span>
                        </div>
                        {formError.user_password && <span className='validationError'>{formError.user_password}</span>}
                    </Col>

                </Row>
                <Row className='mb-3'>
                    <Col md={6}>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" name='email_id' placeholder="savan@gmail.com" onChange={handleChange} />
                        {formError.email_id && <span className='validationError'>{formError.email_id}</span>}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="tel" name='phone_number' placeholder="10 Digit Number" onChange={handleChange} max={10} pattern="[0-9]{10}" />
                        {formError.phone_number && <span className='validationError'>{formError.phone_number}</span>}
                    </Col>
                    <Col md={3}>
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" name='dob' onChange={handleChange} />
                        {formError.dob && <span className='validationError'>{formError.dob}</span>}
                    </Col>
                    <Col md={3}>
                        <Form.Label>Gender</Form.Label>
                        <Form.Select name='gender' onChange={handleChange}>
                            <option value="" selected disabled>Select</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </Form.Select>
                        {formError.gender && <span className='validationError'>{formError.gender}</span>}
                    </Col>
                </Row>


                {/* Address */}
                <h5 className="mb-3 mt-4">Address</h5>
                <Row className="mb-3">
                    <Col md={12}>
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control type="text" name='address' placeholder="Kerala Morbi" onChange={handleChange} />
                        {formError.address && <span className='validationError'>{formError.address}</span>}
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" name='city' placeholder="Morbi" onChange={handleChange} />
                        {formError.city && <span className='validationError'>{formError.city}</span>}
                    </Col>
                    <Col md={4}>
                        <Form.Label>State</Form.Label>
                        <Form.Control type="text" name='state' placeholder="Gujrat" onChange={handleChange} />
                        {formError.state && <span className='validationError'>{formError.state}</span>}
                    </Col>
                    <Col md={4}>
                        <Form.Label>Zip Code</Form.Label>
                        <Form.Control type="text" name='zip_code' placeholder="363641" onChange={handleChange} />
                        {formError.zip_code && <span className='validationError'>{formError.zip_code}</span>}
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label>Country</Form.Label>
                        <Form.Control type="text" name='country' placeholder="India" onChange={handleChange} />
                        {formError.country && <span className='validationError'>{formError.country}</span>}
                    </Col>
                </Row>
                {/* Profile Picture */}
                <h5 className="mb-3 mt-4">Profile Picture</h5>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="file"
                        name="profile_img"
                        accept="image/*"
                        onChange={handleChange}
                    />
                    {formError.profile_img && <span className='validationError'>{formError.profile_img}</span>}
                </Form.Group>

                {/* Buttons */}
                <div className="d-flex">
                    <Button type="submit" className="me-2" variant="primary">
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/admin/users')}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default AddUser;
