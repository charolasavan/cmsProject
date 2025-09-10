
import React, { useState } from 'react';
import { Button, Form, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import Swal from 'sweetalert2';

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
    addUserData.append('profile_img', userData.profile_img);


    try {

      await api.post('/users/', addUserData);
      // alert('User added successfully!');
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer:1000,
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
      navigate('/users');
    }
    catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.detail || "Failed to add User.",
      });
      // alert('Failed to upload product');
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
          </Col>
          <Col md={6}>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name='user_password' placeholder="********" onChange={handleChange} />
          </Col>

        </Row>
        <Row className='mb-3'>
          <Col md={6}>
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" name='email_id' placeholder="savan@gmail.com" onChange={handleChange} />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="tel" name='phone_number' placeholder="7862030297" onChange={handleChange} />
          </Col>
          <Col md={3}>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control type="date" name='dob' onChange={handleChange} />
          </Col>
          <Col md={3}>
            <Form.Label>Gender</Form.Label>
            <Form.Select name='gender' onChange={handleChange}>
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
            <Form.Control type="text" name='address' placeholder="Kerala Morbi" onChange={handleChange} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Label>City</Form.Label>
            <Form.Control type="text" name='city' placeholder="Morbi" onChange={handleChange} />
          </Col>
          <Col md={4}>
            <Form.Label>State</Form.Label>
            <Form.Control type="text" name='state' placeholder="Gujrat" onChange={handleChange} />
          </Col>
          <Col md={4}>
            <Form.Label>Zip Code</Form.Label>
            <Form.Control type="text" name='zip_code' placeholder="363641" onChange={handleChange} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Country</Form.Label>
            <Form.Control type="text" name='country' placeholder="India" onChange={handleChange} />
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
            required
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
    </Container>
  );
}

export default AddUser;
