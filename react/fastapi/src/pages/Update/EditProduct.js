import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

import api from '../../api'
import Swal from 'sweetalert2';
import { Button, Col, Form, Row } from 'react-bootstrap';

const EditProduct = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [value, setValue] = useState({
        product_name: '',
        regular_price: '',
        selling_price: '',
        product_quantity: '',
        product_brand: '',
        product_company: '',
        product_status: '',
        product_description: '',
        category_id: '',
        thumbnail_image: null,
        images: []
    });
    const [categories, setCategories] = useState([]);
    const [formError, setFormError] = useState([])

    // Fetch product data
    const fetchProducts = async () => {

        try {
            const res = await api.get(`/products/${id}`);
            setValue(res.data)
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops..",
                text: error?.response?.data?.detail || error.message || "Faild To Fetch Iteam"
            });
        }
    };

    // Fetch product categories
    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/category/');
            setCategories(data);
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops..",
                text: error?.response?.data?.detail || error.message || "Faild To Fetch Category"
            });
        }
    };

    // UseEffect to fetch product and categories
    useEffect(() => {
        // console.log(value)
        fetchProducts();
        fetchCategories();
    }, [id]);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.name === 'thumbnail_image') {
            setValue((prev) => ({
                ...prev,
                [e.target.name]: e.target.files[0],
            }));
        }
        else if (e.target.name === 'images') {
            const newFiles = Array.from(e.target.files);
            setValue((prev) => ({
                ...prev,
                images: [...prev.images, ...newFiles],
            }));
        }
        else {
            setValue((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }));
        }
    };


    const handleDelete = async (id) => {
        console.log(id)
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
                await api.delete(`/products/product_image/${id}`);
                fetchProducts();
                Swal.fire({
                    title: "Deleted!",
                    text: "Your Image has been deleted.",
                    icon: "success"
                });
            }
            catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Faild",
                    text: error?.response?.data?.detail || error.message || "Faild To Delete Image"
                });
            }
        }
    };
    const renderOptions = (items, depth = 0) =>
        items.flatMap(({ category_id, category_name, children = [] }) => [
            <option key={category_id} value={category_id}>
                {`${'-'.repeat(depth)} ${category_name}`}
            </option>,
            ...renderOptions(children, depth + 1)
        ]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = {}
        if (!value.category_id) {
            validation.category_id = "Category  is required"
        }

        if (!value.product_name?.trim()) {
            validation.product_name = "Product name is required"
        }

        if (!value.regular_price) {
            validation.regular_price = "Regular Price is required"
        }

        if (!value.selling_price) {
            validation.selling_price = "Selling Price is required"
        }
        if (!value.product_quantity) {
            validation.product_quantity = "Quantity is required"
        }

        if (!value.product_brand?.trim()) {
            validation.product_brand = "Product brand is required"
        }

        if (!value.product_company?.trim()) {
            validation.product_company = "Product Company is required"
        }

        if (!value.product_status?.trim()) {
            validation.product_status = "Product Status is required"
        }

        if (!value.product_description?.trim()) {
            validation.product_description = "Product Description is required"
        }

        if (!value.thumbnail_image) {
            validation.thumbnail_image = "Thumbnail Image Is required !!!"
        }
        if (!value.images) {
            validation.images = "Product Images Is required !!!"
        }

        setFormError(validation)
        if (Object.keys(validation).length === 0) {
            const formData = new FormData();
            formData.append('product_name', value.product_name.trim());
            formData.append('regular_price', value.regular_price);
            formData.append('selling_price', value.selling_price);
            formData.append('product_quantity', value.product_quantity);
            formData.append('product_brand', value.product_brand.trim());
            formData.append('product_company', value.product_company.trim());
            formData.append('product_status', value.product_status.trim());
            formData.append('product_description', value.product_description.trim());
            formData.append('category_id', value.category_id);

            if (value.thumbnail_image instanceof File) {
                formData.append('thumbnail_image', value.thumbnail_image);
            }
            value.images.forEach((img) => {
                if (img instanceof File) {
                    formData.append('images', img);
                }
            });

            try {
                await api.put(`/products/${id}/`, formData);
                await fetchProducts();

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Product updated successfully',
                    timer: 1500,
                    showConfirmButton: false,
                });

                navigate('/products');
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: error?.response?.data?.detail || error.message || 'Failed to update product',
                });
                console.log(error)
            }
            // formData.forEach(element => {
            //     console.log(element)
            // })
        }


    };



    return (
        <>
            <div className='m-3'>
                <h3 >Edit Product</h3>
                <Form onSubmit={handleSubmit} encType='multipart/form-data'>
                    <Row>
                        <Col>
                            <Form.Group className='mb-3'>
                                <Form.Label>Product Category</Form.Label>
                                <Form.Select
                                    name="category_id"
                                    value={value.category_id}
                                    onChange={handleChange}
                                // required
                                >
                                    <option value="" disabled>
                                        Select Category
                                    </option>
                                    {renderOptions(categories)}
                                </Form.Select>
                                {formError.category_id && <span className='validationError'>{formError.category_id}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Name"
                                    name="product_name"
                                    value={value.product_name}
                                    onChange={handleChange}
                                // required
                                />
                                {formError.product_name && <span className='validationError'>{formError.product_name}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Regular Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Regular Price"
                                    name="regular_price"
                                    value={value.regular_price}
                                    onChange={handleChange}
                                // required
                                />
                                {formError.regular_price && <span className='validationError'>{formError.regular_price}</span>}
                            </Form.Group>

                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Selling Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Selling Price"
                                    name="selling_price"
                                    value={value.selling_price}
                                    onChange={handleChange}
                                // required
                                />
                                {formError.selling_price && <span className='validationError'>{formError.selling_price}</span>}
                            </Form.Group>

                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Quantity / Units </Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Quantity"
                                    name="product_quantity"
                                    value={value.product_quantity}
                                    onChange={handleChange}
                                // required
                                />
                                {formError.product_quantity && <span className='validationError'>{formError.product_quantity}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Product Brand</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Brand"
                                    name="product_brand"
                                    value={value.product_brand}
                                    onChange={handleChange}
                                // required
                                />
                                {formError.product_brand && <span className='validationError'>{formError.product_brand}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Product Company</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Company"
                                    name="product_company"
                                    value={value.product_company}
                                    onChange={handleChange}
                                // required
                                />
                                {formError.product_company && <span className='validationError'>{formError.product_company}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className='mb-3'>
                                <Form.Label>Product Status</Form.Label>
                                <Form.Select
                                    name="product_status"
                                    value={value.product_status}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select</option>
                                    <option>Active</option>
                                    <option>DeActive</option>
                                </Form.Select>
                                {formError.product_status && <span className='validationError'>{formError.product_status}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Form.Group className="mb-3" >
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control as="textarea" name='product_description' rows={3} value={value.product_description} onChange={handleChange} style={{ resize: 'none' }} />
                        </Form.Group>
                    </Row>
                    <Row>
                        {/* <Col> */}
                        <Form.Group className="mb-3">
                            <Form.Label>Thumbnail Image</Form.Label>
                            <Form.Group className="mb-3">
                                <div className='mb-3'>
                                    <img
                                        className='thumbnail_img'
                                        src={
                                            value.thumbnail_image instanceof File
                                                ? URL.createObjectURL(value.thumbnail_image)
                                                : `http://localhost:8000${value.thumbnail_image}`
                                        }
                                        alt='thumbnail_image'
                                    />
                                </div>
                                <Form.Control
                                    type="file"
                                    name="thumbnail_image"
                                    accept="image/*"
                                    onChange={handleChange}

                                />
                                {formError && <span className='validationError'>{formError.thumbnail_image}</span>}
                            </Form.Group>
                        </Form.Group>
                        {/* </Col> */}
                        <Col>
                            <div className='image_display'>
                                <Form.Group className="mb-3">
                                    <Form.Label>Product Image</Form.Label>
                                    <Form.Group className="mb-3">
                                        <div className='image_view mb-3'>
                                            {value.images.map((name, index) => {
                                                const isFile = name instanceof File || name.images instanceof File;
                                                const imgSrc = isFile
                                                    ? URL.createObjectURL(name instanceof File ? name : name.images)
                                                    : `http://localhost:8000${name.image_name}`

                                                return (
                                                    <div key={index} className='main-image-layout'>
                                                        <img
                                                            className='product_image'
                                                            src={imgSrc}
                                                            alt='productImage'
                                                            height={100}
                                                            width={100}
                                                        />
                                                        <div className='w-100 text-center'>

                                                            <Button variant='danger' onClick={() => handleDelete(name.id)}>
                                                                {/* <IoCloseOutline /> */}
                                                                Delete
                                                            </Button>

                                                        </div>
                                                    </div>
                                                );
                                            })}

                                        </div>
                                        {formError && <span className='validationError'>{formError.images}</span>}
                                    </Form.Group>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Add Product Images</Form.Label>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="file"
                                            name="images"
                                            accept="image/*"
                                            onChange={handleChange}
                                            multiple
                                        />
                                    </Form.Group>
                                </Form.Group>
                            </div>
                        </Col>
                    </Row>

                    <div className='d-flex'>
                        <Button className='me-2' variant="primary" type="submit" >
                            Update
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/products')}>
                            Cancel
                        </Button>
                    </div>
                </Form>

            </div>
        </>

    )
}

export default EditProduct