import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import api from 'api/apiClient'
import Swal from 'sweetalert2';

function Dashboard() {
    const [countUser, setCountUser] = useState(null);
    const [countProducts, setCountProducts] = useState(null);

    const fetchUserCount = async () => {
        try {
            const res = await api.get('/users/');
            setCountUser(res.data.length);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed to load Users",
                text: error?.response?.data?.detail || error.message
            });
        }
    };

    const fetchProductCount = async () => {
        try {
            const res = await api.get('/products/');
            setCountProducts(res.data.length);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed to load Products",
                text: error?.response?.data?.detail || error.message
            });
        }
    };

    useEffect(() => {
        fetchUserCount();
        fetchProductCount();
    }, []);

    return (
        <Container>
            <h2>Welcome to the Admin Dashboard</h2>
            <p>Manage all users and products</p>

            <div className="container mt-4">
                <div className="row justify-content-center g-4">

                    <div className="col-md-4">
                        <div className="card text-white bg-primary shadow h-100">
                            <div className="card-body text-center">
                                <h5 className="card-title">Total Users</h5>
                                <p className="card-text display-5 fw-bold">
                                    {countUser !== null ? countUser : "Loading..."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card text-white bg-success shadow h-100">
                            <div className="card-body text-center">
                                <h5 className="card-title">Total Products</h5>
                                <p className="card-text display-5 fw-bold">
                                    {countProducts !== null ? countProducts : "Loading..."}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Container>
    );
}

export default Dashboard;
