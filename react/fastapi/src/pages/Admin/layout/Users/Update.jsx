import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import api from 'api/apiClient'
import Swal from 'sweetalert2'

function UpdateUsers() {
    const { id } = useParams()
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [roleId, setRoleId] = useState()
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
        role_id: ''
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
        if (!userData.phone_number) {
            validation.phone_number = "PhoneNumber is Required!!!"
        }
        // else if (userData.phone_number.length !== 10) {
        //     validation.phone_number = "Please Enter Valid Number!!!"
        // }
        if (!userData.dob) {
            validation.dob = "DOB is Required!!!"
        }
        if (!userData.gender) {
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
        if (!userData.zip_code) {
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
            // console.log("JO")
            const addUserData = new FormData();
            addUserData.append('user_name', userData.user_name);
            addUserData.append('user_password', userData.user_password);
            addUserData.append('email_id', userData.email_id);
            addUserData.append('phone_number', userData.phone_number);
            addUserData.append('dob', userData.dob);
            addUserData.append('gender', userData.gender);
            addUserData.append('address', userData.address);
            addUserData.append('city', userData.city);
            addUserData.append('state', userData.state);
            addUserData.append('zip_code', userData.zip_code);
            addUserData.append('country', userData.country);
            if (userData.profile_img instanceof File) {
                addUserData.append('profile_img', userData.profile_img);
            }

            if (userData.role_id) {
                const updateUserRole = new FormData();
                updateUserRole.append('user_id', id)
                updateUserRole.append('role_id', userData.role_id)

                try {
                    await api.put(`/user_has_role/${roleId}/`, updateUserRole);

                }
                catch (error) {
                    console.log(error)
                }
            }

            try {
                await api.put(`/users/${id}/`, addUserData);
                // console.log("Update")
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
                    user_name: res.data.user_role.user_name,
                    user_password: res.data.user_role.user_password,
                    email_id: res.data.user_role.email_id,
                    phone_number: res.data.user_role.phone_number,
                    dob: res.data.user_role.dob,
                    gender: res.data.user_role.gender,
                    address: res.data.user_role.address,
                    city: res.data.user_role.city,
                    state: res.data.user_role.state,
                    zip_code: res.data.user_role.zip_code,
                    country: res.data.user_role.country,
                    profile_img: res.data.user_role.profile_img,
                    role_id: res.data.user_role.role_id
                });

                setRoleId(res.data.id)
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
                    <Col md={4}>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" name='user_name' value={userData.user_name} placeholder="Savan Charola" onChange={handleChange} />
                        {formError && <span className='validationError'>{formError.user_name}</span>}
                    </Col>
                    <Col md={4}>
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
                        {formError && <span className='validationError'>{formError.user_password}</span>}
                    </Col>
                    <Col md={4}>
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                            name="role_id"
                            value={userData.role_id}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select</option>
                            <option value='2'>User</option>
                            <option value='1'>Admin</option>
                        </Form.Select>

                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col md={6}>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" name='email_id' placeholder="savan@gmail.com" value={userData.email_id} onChange={handleChange} />
                        {formError && <span className='validationError'>{formError.email_id}</span>}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="tel" name='phone_number' placeholder="7862030297" value={userData.phone_number} onChange={handleChange} />
                        {formError && <span className='validationError'>{formError.phone_number}</span>}
                    </Col>
                    <Col md={3}>
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" name='dob' value={userData.dob} onChange={handleChange} />
                        {formError && <span className='validationError'>{formError.dob}</span>}
                    </Col>
                    <Col md={3}>
                        <Form.Label>Gender</Form.Label>
                        <Form.Select name='gender' value={userData.gender} onChange={handleChange}>
                            <option value="">Select</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </Form.Select>
                        {formError && <span className='validationError'>{formError.gender}</span>}
                    </Col>
                </Row>


                {/* Address */}
                <h5 className="mb-3 mt-4">Address</h5>
                <Row className="mb-3">
                    <Col md={12}>
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control type="text" name='address' value={userData.address} placeholder="Kerala Morbi" onChange={handleChange} />
                        {formError && <span className='validationError'>{formError.address}</span>}
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" name='city' placeholder="Morbi" value={userData.city} onChange={handleChange} />
                        {formError && <span className='validationError'>{formError.city}</span>}
                    </Col>
                    <Col md={4}>
                        <Form.Label>State</Form.Label>
                        <Form.Control type="text" name='state' placeholder="Gujrat" value={userData.state} onChange={handleChange} />
                        {formError && <span className='validationError'>{formError.state}</span>}
                    </Col>
                    <Col md={4}>
                        <Form.Label>Zip Code</Form.Label>
                        <Form.Control type="text" name='zip_code' placeholder="363641" value={userData.zip_code} onChange={handleChange} />
                        {formError && <span className='validationError'>{formError.zip_code}</span>}
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label>Country</Form.Label>
                        <Form.Control type="text" name='country' placeholder="India" value={userData.country} onChange={handleChange} />
                        {formError && <span className='validationError'>{formError.country}</span>}
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
                    {formError && <span className='validationError'>{formError.profile_img}</span>}
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
        </div >
    );
}

export default UpdateUsers;
