import React, { useEffect, useState } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from 'api/apiClient'
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2'
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { FaSearch } from "react-icons/fa";
import Pagination from '../../../../components/Pagination';
// import '../../../../App.css'



function Users() {
    // const navigate = useNavigate();
    const [user, setUser] = useState([])

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const [searchUser, setSearchUser] = useState({
        user_name: '',
        email_id: '',
        phone_number: '',
        dob: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
    })   // apply search
    const [order, setOrder] = useState("ASC")
    const [filterData, setFilterData] = useState([])  // filtered Data



    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }



    const fetchUserDetail = async () => {
        try {
            const response = await api.get('/users/');
            // const fetchedUsers = users.data;
            setUser(response.data);
            setFilterData(response.data)
            // console.log(response.data)
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops..",
                text: error?.response?.data?.detail || error.message || "Faild To Fetch User"
            });
        }
    };

    const handleDelete = async (id) => {

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        })

        if (result.isConfirmed) {
            try {
                await api.delete(`/users/${id}`);
                fetchUserDetail();
                Swal.fire({
                    title: "Deleted!",
                    text: "Your User has been deleted.",
                    icon: "success"
                });
            }
            catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Faild",
                    text: error?.response?.data?.detail || error.message || "Faild To Delete User"
                });
            }
        }
    };

    useEffect(() => {
        fetchUserDetail()
    }, [])

    const handleSearch = (e) => {
        setSearchUser((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const handleFilter = async (e) => {
        e.preventDefault()

        const filterUserForm = new FormData();

        Object.entries(searchUser).forEach(([key, value]) => {
            if (value !== '') {
                filterUserForm.append(key, value);
            }
        });
        try {
            const responseData = await api.post('/users/getuser/', filterUserForm);

            if (responseData.data && responseData.data.length > 0) {
                setFilterData(responseData.data);
            } else {
                setFilterData([]);
                Swal.fire({
                    icon: "info",
                    title: "No Users Found",
                    text: "Try different search criteria.",
                });
            }
        } catch (error) {
            setFilterData([]);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response?.data?.detail || "Failed to find user.",
            });
        }



    }

    const clearFilter = (e) => {
        e.preventDefault()
        setSearchUser({
            user_name: '',
            email_id: '',
            phone_number: '',
            dob: '',
            gender: '',
            address: '',
            city: '',
            state: '',
            zip_code: '',
            country: '',
        });
        fetchUserDetail()
    }

    const handleSort = (col) => {
        if (order === "ASC") {
            const sorted = [...filterData].sort((a, b) =>
                a[col] > b[col] ? 1 : -1
            );
            setFilterData(sorted);
            setOrder("DSC")
        }

        if (order === "DSC") {
            const sorted = [...filterData].sort((a, b) =>
                a[col] < b[col] ? 1 : -1
            );
            setFilterData(sorted);
            setOrder("ASC")
        }
    }


    return (
        <Container>
            <h3>Users</h3>
            <Link to='/admin/users/add'>
                <Button className="mb-3" variant="primary">
                    Add User
                </Button>
            </Link>

            <Form className='mb-3'>
                {/* <Container> */}
                <Row>
                    <Col>
                        <Form.Group className='mb-3'>

                            <Form.Control
                                type="text"
                                name='user_name'
                                placeholder="Search User"
                                value={searchUser.user_name}
                                onChange={handleSearch}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className='mb-3'>
                            <Form.Control
                                type='email'
                                name='email_id'
                                placeholder='emailId'
                                value={searchUser.email_id}
                                onChange={handleSearch}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className='mb-3'>
                            <Form.Control
                                type='tel'
                                name='phone_number'
                                placeholder='Number'
                                value={searchUser.phone_number}
                                onChange={handleSearch}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className='mb-3'>
                            <Form.Control
                                type='date'
                                name='dob'
                                placeholder='DOB'
                                value={searchUser.dob}
                                onChange={handleSearch}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Select name='gender' onChange={handleSearch} value={searchUser.gender}>
                            <option value="">Select</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='address'
                                value={searchUser.address}
                                placeholder='Address'
                                onChange={handleSearch}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='city'
                                value={searchUser.city}
                                placeholder='city'
                                onChange={handleSearch}
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='state'
                                placeholder='State'
                                value={searchUser.state}
                                onChange={handleSearch}
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group>
                            <Form.Control
                                type='number'
                                name='zip_code'
                                placeholder='Zip Code'
                                value={searchUser.zip_code}
                                onChange={handleSearch}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='country'
                                placeholder='Country'
                                value={searchUser.country}
                                onChange={handleSearch}
                            />
                        </Form.Group>
                    </Col>

                </Row>
                <Row>
                    <div className='d-flex gap-2'>
                        <Button variant='success' onClick={handleFilter}>
                            <div className='d-flex justify-content-center align-items-center'>
                                Search
                                <span className='ms-1'>
                                    <FaSearch />
                                </span>
                            </div>
                        </Button>
                        <Button variant='danger' onClick={clearFilter}>
                            Clear
                        </Button>
                    </div>
                    {/* <Col md={1}>
            <Button variant='danger' onClick={clearFilter}>
              Clear
            </Button>
          </Col> */}
                </Row>
                {/* </Container> */}
            </Form>


            <Table striped bordered hover className='text-center' responsive>
                <thead>
                    <tr>
                        <th>
                            id
                            <span className='ps-2'>
                                <Button onClick={() => handleSort('id')}>
                                    <HiMiniArrowsUpDown />
                                </Button>
                            </span>
                        </th>
                        {/* <th>
                            User Role
                            <span className='ps-2'>
                                <Button onClick={() => handleSort('id')}>
                                    <HiMiniArrowsUpDown />
                                </Button>
                            </span>
                        </th> */}
                        <th>
                            Full Name
                            <span className='ps-2'>
                                <Button onClick={() => handleSort('user_name')}>
                                    <HiMiniArrowsUpDown />
                                </Button>
                            </span>
                        </th>
                        <th>
                            Password
                            <span className='ps-2'>
                                <Button onClick={() => handleSort('user_password')}>
                                    <HiMiniArrowsUpDown />
                                </Button>
                            </span>

                        </th>
                        <th>
                            Email Id
                            <span className='ps-2'>
                                <Button onClick={() => handleSort('email_id')}>
                                    <HiMiniArrowsUpDown />
                                </Button>
                            </span>
                        </th>
                        <th>
                            Phone Number
                            <span className='ps-2'>
                                <Button onClick={() => handleSort('phone_number')}>
                                    <HiMiniArrowsUpDown />
                                </Button>
                            </span>
                        </th>
                        <th>
                            DOB
                            <span className='ps-2'>
                                <Button onClick={() => handleSort('dob')}>
                                    <HiMiniArrowsUpDown />
                                </Button>
                            </span>
                        </th>
                        <th>
                            Gender
                            <span className='ps-2'>
                                <Button onClick={() => handleSort('gender')}>
                                    <HiMiniArrowsUpDown />
                                </Button>
                            </span>
                        </th>
                        <th>
                            Address
                            <span className='ps-2'>
                                <Button onClick={() => handleSort('address')}>
                                    <HiMiniArrowsUpDown />
                                </Button>
                            </span>
                        </th>
                        <th>
                            City
                            <span className='ps-2'>
                                <Button onClick={() => handleSort('city')}>
                                    <HiMiniArrowsUpDown />
                                </Button>
                            </span>
                        </th>
                        <th>
                            State
                            <span className='ps-2'>
                                <Button onClick={() => handleSort('state')}>
                                    <HiMiniArrowsUpDown />
                                </Button>
                            </span>
                        </th>
                        <th>
                            Zip Code
                            <span className='ps-2'>
                                <Button onClick={() => handleSort('zip_code')}>
                                    <HiMiniArrowsUpDown />
                                </Button>
                            </span>
                        </th>
                        <th>
                            Country
                            <span className='ps-2'>
                                <Button onClick={() => handleSort('country')}>
                                    <HiMiniArrowsUpDown />
                                </Button>
                            </span>
                        </th>
                        <th>Profile Image</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {filterData.map((data) => {
                        return (
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                {/* <td>{data.role_name_user.role_name}</td> */}
                                <td>{data.user_name}</td>
                                <td>{data.user_password}</td>
                                <td>{data.email_id}</td>
                                <td>{data.phone_number}</td>
                                <td>{data.dob}</td>
                                <td>{data.gender}</td>
                                <td>{data.address}</td>
                                <td>{data.city}</td>
                                <td>{data.state}</td>
                                <td>{data.zip_code}</td>
                                <td>{data.country}</td>
                                <td>
                                    <img
                                        className='profile_img'
                                        src={`http://localhost:8000${data.profile_img}`}  // Display image with full URL
                                        alt='profile_img'


                                    />
                                </td>

                                <td>
                                    <Link to={`/admin/users/update/${data.id}`}>
                                        <Button>Edit</Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={() => {
                                        handleDelete(data.id)
                                    }}>Delete</Button>

                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <Pagination
                count={filterData != null ? filterData.length : 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Container>
    );
}

export default Users;
