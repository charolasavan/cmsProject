import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../api'
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2'



function UserList() {
  // const navigate = useNavigate();
  const [user, setUser] = useState([])


  const fetchUserDetail = async () => {
    try {
      const users = await api.get('/users/');
      const fetchedUsers = users.data;
      setUser(fetchedUsers);
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
  return (
    <Container>
      <h3>Users</h3>
      <Link to='/users/add'>
        <Button className="mb-3" variant="primary">
          Add User
        </Button>
      </Link>




      <Table striped bordered hover className='text-center' responsive>
        <thead>
          <tr>
            <th>id</th>
            <th>Full Name</th>
            <th>Password</th>
            <th>Email Id</th>
            <th>Phone Number</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Zip Code</th>
            <th>Country</th>
            <th>Profile Image</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {user.map((data) => {
            return (
              <tr key={data.id}>
                <td>{data.id}</td>
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
                  <Link to={`/edituser/${data.id}`}>
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

    </Container>
  );
}

export default UserList;
