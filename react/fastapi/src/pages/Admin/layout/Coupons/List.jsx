import React, { useState, useEffect } from 'react';
import api from 'api/apiClient'
import { Link, resolvePath, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button, Table } from 'react-bootstrap';
import Pagination from 'components/Pagination';




function CouponList() {
    const [coupon, setCoupon] = useState([])
    const navigate = useNavigate();

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }


    // FetchAll Coupon
    const fetchCoupon = async () => {
        try {
            const response = await api.get('/coupons/')
            setCoupon(response.data);
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops..",
                text: error?.response?.data?.detail || error.message || "Faild To Fetch Coupons"
            });
        }
    };


    // Handle Delete coupons
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
                await api.delete(`/coupons/${id}`);
                setCoupon(coupon.filter(coupon => coupon.id !== id));
                Swal.fire({
                    title: "Deleted!",
                    text: "Your Coupon has been deleted.",
                    icon: "success"
                });

            }
            catch (error) {
                // console.log("Error is", error.data)
                Swal.fire({
                    icon: "error",
                    title: "Faild",
                    text: error?.response?.data?.detail || error.message || "Faild To Delete Coupon"
                });
            }
        }

    };

    // Call Api useing useEffect hook
    useEffect(() => {
        fetchCoupon();
    }, []);


    return (
        <div>
            <h3>Avaiable Coupons</h3>

            <div className='mt-3'>
                <Button className='mb-3' variant='primary' onClick={() => navigate('/admin/coupons/add')}>
                    Add New
                </Button>
                <Table striped bordered hover className='text-center' responsive>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Coupon</th>
                            <th>Specific Product</th>
                            <th>Disoccunt Price</th>
                            <th>Expire Date</th>
                            <th>Use Limit</th>
                            <th>Total Usage</th>
                            <th>Is Active</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupon.map((data) => {
                            return (
                                <tr key={`${data.id}-${data.code}`}>
                                    <td>{data.id}</td>
                                    <td>{data.code}</td>
                                    <td>{data.product != null ? data.product.product_name : "All"}</td>
                                    <td>{'₹' + data.discount_price}</td>
                                    <td>{data.expires_date}</td>
                                    <td>{data.usage_limit}</td>
                                    <td>{data.usage_count}</td>
                                    <td>
                                        {data.is_active ? (
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
                                        <Link to={`/admin/coupons/update/${data.id}`}>
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

                {/* <Pagination
                    count={coupon.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}

            </div>

        </div >
    );
}



export default CouponList;
