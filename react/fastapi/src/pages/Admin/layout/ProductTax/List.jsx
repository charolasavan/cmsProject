import React, { useState, useEffect } from 'react';
import api from 'api/apiClient'
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
// import '../../App.css'
// import { FaSearch } from "react-icons/fa";
// import { HiMiniArrowsUpDown } from "react-icons/hi2";
// import Pagination from 'components/Pagination';


function ProductTaxList() {
    const [taxData, setTexData] = useState([])

    const fetchTax = async () => {
        try {
            const response = await api.get('/tax/')
            setTexData(response.data);
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops..",
                text: error?.response?.data?.detail || error.message || "Faild To Fetch Iteams"
            });
        }
    }


    // Handle Delete product 

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
                await api.delete(`/tax/${id}`);
                setTexData(taxData.filter(taxData => taxData.tax_id !== id));
                Swal.fire({
                    title: "Deleted!",
                    text: "Your Product has been deleted.",
                    icon: "success"
                });
                fetchTax()

            }
            catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Faild",
                    text: error?.response?.data?.detail || error.message || "Faild To Delete Iteam"
                });
            }
        }

    };

    useEffect(() => {
        fetchTax()
    }, [])

    return (
        <div>
            <h3>Products Tax</h3>

            <div className='mt-3'>
                <Link to='/admin/tax/add'>
                    <Button className="mb-3" variant="primary">
                        Add Tax
                    </Button>
                </Link>

                <Table striped bordered hover className='text-center' responsive>
                    <thead>
                        <tr>
                            <th>
                                id
                            </th>
                            <th>
                                Tax Name
                            </th>
                            <th>
                                Value %
                            </th>
                            <th>Active</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taxData.map((data) => {
                            return (
                                <tr key={`${data.tax_id}-${data.tax_name}`}>
                                    <td>{data.tax_id}</td>
                                    <td>{data.tax_name}</td>
                                    <td>{data.tax_value} %</td>
                                    <td>
                                        {
                                            data.tax_active == 0 ?
                                                (
                                                    <p className='active'>
                                                        Active
                                                    </p>
                                                ) :
                                                (
                                                    <p className='deactive'>
                                                        DeActive
                                                    </p>
                                                )
                                        }
                                    </td>
                                    <td>
                                        <Link to={`/admin/products/update/${data.id}`}>
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

            </div>
        </div>
    )
}

export default ProductTaxList