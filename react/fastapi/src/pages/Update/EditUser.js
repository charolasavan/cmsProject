import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import api from '../../api';
import Swal from 'sweetalert2'

function EditUser() {
    const { id } = useParams()
    const [isPasswordShown, setIsPasswordShown] = useState(false);
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
    });

    const [formError, setFormError] = useState([])
    const navigate = useNavigate();

    // Fetch User from backend


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
            addUserData.append('gender', userData.gender.trim());
            addUserData.append('address', userData.address.trim());
            addUserData.append('city', userData.city.trim());
            addUserData.append('state', userData.state.trim());
            addUserData.append('zip_code', userData.zip_code.trim());
            addUserData.append('country', userData.country.trim());
            if (userData.profile_img instanceof File) {
                addUserData.append('profile_img', userData.profile_img);
            }


            try {
                await api.put(`/users/${id}`, addUserData);
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
                    title: "Update Data is successfully"
                });
                navigate(-1);

            }
            catch (error) {
                // console.error('Upload error:', error);
                // alert('Failed to upload product');

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.response?.data?.detail || "Failed to add User.",
                });


            }
        };
    }


    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const res = await api.get(`/users/${id}`);
                setUserData({
                    user_name: res.data.user_name,
                    user_password: res.data.user_password,
                    email_id: res.data.email_id,
                    phone_number: res.data.phone_number,
                    dob: res.data.dob,
                    gender: res.data.gender,
                    address: res.data.address,
                    city: res.data.city,
                    state: res.data.state,
                    zip_code: res.data.zip_code,
                    country: res.data.country,
                    profile_img: res.data.profile_img
                });

                // console.log(res)
            }
            catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops..",
                    text: error?.response?.data?.detail || error.message || "Faild To Fetch User"
                });
            }
        };

        fetchUserDetail();
    }, [id]);



    return (
        <div className="m-3">
            <h3>Edit User</h3>
            <Form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <h5 className="mb-3">Personal Information</h5>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" name='user_name' value={userData.user_name} placeholder="Savan Charola" onChange={handleChange} />
                    </Col>
                    <Col md={6}>
                        <Form.Label>Password</Form.Label>

                        <div className="position-relative mb-3">
                            <Form.Control
                                type={isPasswordShown ? 'text' : 'password'}
                                placeholder="Password"
                                className="form-control ps-5 pe-5"
                                required
                                name="user_password"
                                onChange={handleChange}
                                value={userData.user_password}
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
                    </Col>

                </Row>
                <Row className='mb-3'>
                    <Col md={6}>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" name='email_id' placeholder="savan@gmail.com" value={userData.email_id} onChange={handleChange} />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="tel" name='phone_number' placeholder="7862030297" value={userData.phone_number} onChange={handleChange} />
                    </Col>
                    <Col md={3}>
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" name='dob' value={userData.dob} onChange={handleChange} />
                    </Col>
                    <Col md={3}>
                        <Form.Label>Gender</Form.Label>
                        <Form.Select name='gender' value={userData.gender} onChange={handleChange}>
                            <option value="">Select</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </Form.Select>
                    </Col>
                </Row>


                {/* Address */}
                <h5 className="mb-3 mt-4">Address</h5>
                <Row className="mb-3">
                    <Col md={12}>
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control type="text" name='address' value={userData.address} placeholder="Kerala Morbi" onChange={handleChange} />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" name='city' placeholder="Morbi" value={userData.city} onChange={handleChange} />
                    </Col>
                    <Col md={4}>
                        <Form.Label>State</Form.Label>
                        <Form.Control type="text" name='state' placeholder="Gujrat" value={userData.state} onChange={handleChange} />
                    </Col>
                    <Col md={4}>
                        <Form.Label>Zip Code</Form.Label>
                        <Form.Control type="text" name='zip_code' placeholder="363641" value={userData.zip_code} onChange={handleChange} />
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label>Country</Form.Label>
                        <Form.Control type="text" name='country' placeholder="India" value={userData.country} onChange={handleChange} />
                    </Col>
                </Row>
                {/* Profile Picture */}
                <h5 className="mb-3 mt-4">Profile Picture</h5>
                <Form.Group className="mb-3">

                    <Form.Label>Profile Image</Form.Label>
                    <div className='mb-3'>
                        <img
                            className='profile_img'
                            src={
                                userData.profile_img instanceof File
                                    ? URL.createObjectURL(userData.profile_img)
                                    : `http://localhost:8000${userData.profile_img}`
                            }
                            alt='profile_img'
                        />
                    </div>
                    <Form.Control
                        type="file"
                        name="profile_img"
                        accept="image/*"
                        onChange={handleChange}

                    />

                </Form.Group>

                {/* Buttons */}
                <div className="d-flex">
                    <Button type="submit" className="me-2" variant="primary">
                        Submit
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/users')}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div >
    );
}

export default EditUser;
