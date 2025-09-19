import React, { useEffect, useState } from 'react'
import { data, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import api from '../../api'
import Swal from 'sweetalert2';



const EditProduct = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [value, setValue] = useState({
        product_name: '',
        product_price: '',
        product_brand: '',
        product_company: '',
        category_id: '',
        thumbnail_image: null,
        image_name: []
    });
    const [categories, setCategories] = useState([]);
    // Fetch product data
    const fetchProducts = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            setValue({
                product_name: res.data[0].product_name,
                product_price: res.data[0].product_price,
                product_brand: res.data[0].product_brand,
                product_company: res.data[0].product_company,
                category_id: res.data[0].category_id,
                thumbnail_image: res.data[0].thumbnail_image,
                image_name: res.data[0].images,
            });
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
        } else {
            setValue((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }));
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


    const handleSubmit = (e) => {
        e.preventDefault();

        const addProductData = new FormData();
        addProductData.append('product_name', value.product_name);
        addProductData.append('product_price', value.product_price);
        addProductData.append('product_brand', value.product_brand);
        addProductData.append('product_company', value.product_company);
        addProductData.append('category_id', value.category_id);
        addProductData.append('thumbnail_image', value.thumbnail_image);

        // console.log(addProductData)
        try {
            api.put("/products/" + id, addProductData)
            // alert("Product Updated Successfully!!!")
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
            navigate('/products')
            // console.log(response)
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                title: "Faild",
                text: error?.response?.data?.detail || error.message || "Faild To Update Iteam"
            });
        }
    }
    return (
        <>
            <div className='m-3'>
                <h3 >Edit Product</h3>
                <Form onSubmit={handleSubmit} >
                    <Form.Label>Product Category</Form.Label>
                    <Form.Select
                        className='mb-3'
                        name="category_id"
                        value={value.category_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select Category</option>
                        {renderOptions(categories)}
                    </Form.Select>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Name" name='product_name' value={value.product_name} onChange={handleChange} required />

                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label>Product Price</Form.Label>
                        <Form.Control type="number" placeholder="Enter Price" name='product_price' value={value.product_price} onChange={handleChange} required />

                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label>Product Brand</Form.Label>
                        <Form.Control type="text" placeholder="Enter Brand" name='product_brand' value={value.product_brand} onChange={handleChange} required />

                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label>Product Company</Form.Label>
                        <Form.Control type="text" placeholder="Enter Company" name='product_company' value={value.product_company} onChange={handleChange} required />
                    </Form.Group>

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
                        </Form.Group>
                    </Form.Group>

                    <div className='image_display'>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Image</Form.Label>
                            <Form.Group className="mb-3">
                                <div className='image_view mb-3'>
                                    {value.image_name.map((name, index) => {
                                        return (
                                            <div key={index} className='main-image-layout' >
                                                <img
                                                    className='product_image'
                                                    src={`http://localhost:8000${name.image_name}`}
                                                    alt='productImage'
                                                    height={80}
                                                    width={100}
                                                />
                                                <div className='w-100 text-center'>
                                                    <Button variant='danger'
                                                        onClick={() => {
                                                            handleDelete(name.id)
                                                        }}
                                                    >Delete</Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Form.Group>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Add Product Images</Form.Label>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="file"
                                    name="image_name"
                                    accept="image/*"
                                    onChange={handleChange}
                                    multiple

                                />
                            </Form.Group>
                        </Form.Group>


                    </div>
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