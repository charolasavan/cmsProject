import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Image, Button } from 'react-bootstrap';
import api from '../api'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
function UserProfile() {
  const [userData, setUserData] = useState({
    // id: null,
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

  const getUserLoginData = async () => {
    const userIs = localStorage.getItem('user');
    const newUser = JSON.parse(userIs);
    try {
      const response = await api.get(`/users/${newUser.id}`);
      setUserData(response.data)

    } catch (error) {
      console.error(error);
    }

  }

  useEffect(() => {
    getUserLoginData()
  }, [])


  return (
    <Container >
      <Card className="shadow-lg border-0 rounded-4">
        <Card.Header className="bg-gradient text-black text-center py-4" >
          <h3 className="mb-0">User Profile</h3>
        </Card.Header>
        <Card.Body className="p-4">
          <Link to={`/edituser/${userData.id}`}>
            <Button variant='btn btn-success'>update</Button>
          </Link>
          <Row className="mb-4 justify-content-center text-center">
            <Col xs="auto">
              <Image
                src={`http://localhost:8000${userData.profile_img}`}
                alt="profile_img"
                roundedCircle
                width={120}
                height={120}
                className="shadow-sm border border-light object-fit-cover"
              />
              <h5 className="mt-3 mb-0">{userData.user_name}</h5>
            </Col>
          </Row>

          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formUserName">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control type="text" value={userData.user_name} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="text" value={userData.user_password} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={userData.email_id} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" value={userData.phone_number} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formDOB">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control type="text" value={userData.dob} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formGender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control type="text" value={userData.gender} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" value={userData.city} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formState">
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" value={userData.state} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formZip">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control type="text" value={userData.zip_code} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formCountry">
                  <Form.Label>Country</Form.Label>
                  <Form.Control type="text" value={userData.country} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="formAddress" className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control as="textarea" rows={2} value={userData.address} readOnly />
            </Form.Group>
          </Form>
        </Card.Body>

      </Card>
    </Container>
  );
}

export default UserProfile;
