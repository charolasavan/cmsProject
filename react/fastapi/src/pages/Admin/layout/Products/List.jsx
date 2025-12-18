import React, { useState, useEffect } from 'react';
import api from 'api/apiClient'
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
// import '../../App.css'
import { FaSearch } from "react-icons/fa";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import Pagination from 'components/Pagination';


function ProductList() {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [productData, setProductData] = useState([])
    const [filterData, setFilterData] = useState([])
    const [categories, setCategories] = useState([]);

    const [searchProduct, setSearchProduct] = useState({
        product_name: '',
        regular_price: '',
        selling_price: '',
        product_brand: '',
        product_company: '',
        product_status: '',
        category_id: '',
    })
    const [order, setOrder] = useState("ASC")

    // Fetch categories

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/category/');
            setCategories(data);
        } catch (err) {
            console.error('Fetch categories error:', err);
        }
    };


    // FetchAll product 
    const fetchProduct = async () => {
        try {
            const response = await api.get('/products/')
            // console.log(response.data)
            setProductData(response.data);
            setFilterData(response.data)
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops..",
                text: error?.response?.data?.detail || error.message || "Faild To Fetch Iteams"
            });
        }
    };
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
                await api.delete(`/products/${id}`);
                setProductData(productData.filter(productData => productData.id !== id));
                Swal.fire({
                    title: "Deleted!",
                    text: "Your Product has been deleted.",
                    icon: "success"
                });
                fetchProduct()

            }
            catch (error) {
                // console.log("Error is", error.data)
                Swal.fire({
                    icon: "error",
                    title: "Faild",
                    text: error?.response?.data?.detail || error.message || "Faild To Delete Iteam"
                });
            }
        }

    };

    // Call Api useing useEffect hook

    useEffect(() => {
        fetchProduct();
        fetchCategories()
    }, []);


    const handleSearch = (e) => {
        setSearchProduct((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleFilter = async (e) => {
        e.preventDefault()

        const filterProductForm = new FormData();

        Object.entries(searchProduct).forEach(([key, value]) => {
            if (value !== '') {
                filterProductForm.append(key, value);
            }
        });
        try {
            const responseData = await api.post('/products/getproduct/', filterProductForm);
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
        setSearchProduct({
            product_name: '',
            regular_price: '',
            selling_price: '',
            product_brand: '',
            product_company: '',
            product_status: '',
            category_id: '',
        });
        fetchProduct()
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

    const renderOptions = (items, depth = 0) =>
        items.flatMap(({ category_id, category_name, children = [] }) => [
            <option key={category_id} value={category_id}>
                {`${'-'.repeat(depth)} ${category_name}`}
            </option>
            ,
            ...renderOptions(children, depth + 1),
        ]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    return (
        <div>
            <h3>Products</h3>

            <div className='mt-3'>
                <Link to='/admin/products/add'>
                    <Button className="mb-3" variant="primary">
                        Add Products
                    </Button>
                </Link>
                <Form className='mb-3'>
                    <Row>
                        <Col>
                            <Form.Group className='mb-3'>
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name='product_name'
                                    placeholder="Search User"
                                    value={searchProduct.product_name}
                                    onChange={handleSearch}
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className='mb-3'>
                                <Form.Label>Regual Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name='regular_price'
                                    placeholder="Regual Price"
                                    value={searchProduct.regular_price}
                                    onChange={handleSearch}
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className='mb-3'>
                                <Form.Label>Selling Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name='selling_price'
                                    placeholder="Selling Price"
                                    value={searchProduct.selling_price}
                                    onChange={handleSearch}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className='mb-3'>
                                <Form.Label>Product Brand</Form.Label>
                                <Form.Control
                                    type="text"
                                    name='product_brand'
                                    placeholder="Product Brand"
                                    value={searchProduct.product_brand}
                                    onChange={handleSearch}
                                />
                            </Form.Group>

                        </Col>
                        <Col>
                            <Form.Group className='mb-3'>
                                <Form.Label>Product Company</Form.Label>
                                <Form.Control
                                    type="text"
                                    name='product_company'
                                    placeholder="Product Company"
                                    value={searchProduct.product_company}
                                    onChange={handleSearch}
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className='mb-3'>
                                <Form.Label>Product Status</Form.Label>
                                <Form.Select
                                    name="product_status"
                                    value={searchProduct.product_status}
                                    onChange={handleSearch}
                                >
                                    <option value="" disabled>Select</option>
                                    <option>Active</option>
                                    <option>DeActive</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className='mb-3'>
                                <Form.Label>Category</Form.Label>
                                <Form.Select
                                    name="category_id"
                                    value={searchProduct.category_id}
                                    onChange={handleSearch}
                                >
                                    <option value="" disabled>
                                        Select Category
                                    </option>
                                    {renderOptions(categories)}
                                </Form.Select>
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
                    </Row>

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
                            <th>
                                Product Name
                                <span className='ps-2'>
                                    <Button onClick={() => handleSort('product_name')}>
                                        <HiMiniArrowsUpDown />
                                    </Button>
                                </span>
                            </th>
                            <th>
                                Quantity / Units
                                <span className='ps-2'>
                                    <Button onClick={() => handleSort('product_quantity')}>
                                        <HiMiniArrowsUpDown />
                                    </Button>
                                </span>
                            </th>
                            <th>
                                Regular price
                                <span className='ps-2'>
                                    <Button onClick={() => handleSort('regular_price')}>
                                        <HiMiniArrowsUpDown />
                                    </Button>
                                </span>
                            </th>
                            <th>
                                Selling price
                                <span className='ps-2'>
                                    <Button onClick={() => handleSort('selling_price')}>
                                        <HiMiniArrowsUpDown />
                                    </Button>
                                </span>
                            </th>
                            <th>
                                Product Brand
                                <span className='ps-2'>
                                    <Button onClick={() => handleSort('product_brand')}>
                                        <HiMiniArrowsUpDown />
                                    </Button>
                                </span>
                            </th>
                            <th>
                                Product Company
                                <span className='ps-2'>
                                    <Button onClick={() => handleSort('product_company')}>
                                        <HiMiniArrowsUpDown />
                                    </Button>
                                </span>
                            </th>
                            <th>
                                Product Status
                                <span className='ps-2'>
                                    <Button onClick={() => handleSort('product_status')}>
                                        <HiMiniArrowsUpDown />
                                    </Button>
                                </span>
                            </th>
                            <th>
                                Product Category
                                <span className='ps-2'>
                                    <Button onClick={() => handleSort('category_id')}>
                                        <HiMiniArrowsUpDown />
                                    </Button>
                                </span>
                            </th>
                            <th>
                                Thumbnail Images
                            </th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterData.map((data) => {
                            return (
                                <tr key={`${data.id}-${data.product_name}`}>
                                    <td>{data.id}</td>
                                    <td>{data.product_name}</td>
                                    <td>{data.product_quantity}</td>
                                    <td>{data.regular_price}</td>
                                    <td>{data.selling_price}</td>
                                    <td>{data.product_brand}</td>
                                    <td>{data.product_company}</td>
                                    <td>
                                        {
                                            data.product_status == "Active" ?
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
                                    <td>{data.category.category_name}</td>
                                    <td>
                                        <img
                                            className='thumbnail_img'
                                            src={`http://localhost:8000${data.thumbnail_image}`}
                                            alt='productImage'
                                        />
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
                <Pagination
                    count={filterData != null ? filterData.length : 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </div>

        </div >
    );
}



export default ProductList;
