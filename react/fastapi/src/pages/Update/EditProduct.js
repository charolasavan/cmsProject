import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import api from '../../api'
import Swal from 'sweetalert2';
import { IoCloseOutline } from "react-icons/io5";

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
        images: []
    });
    const [categories, setCategories] = useState([]);
    const [formError, setFormError] = useState([])

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
                images: res.data[0].images,
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
        if (!value.product_name?.trim()) {
            validation.product_name = "Name Is required !!!"
        }
        if (!value.product_price) {
            validation.product_price = "price Is required !!!"
        }
        if (!value.product_brand?.trim()) {
            validation.product_brand = "Product Brand Is required !!!"
        }
        if (!value.product_company?.trim()) {
            validation.product_company = "Company Name Is required !!!"
        }
        if (!value.category_id) {
            validation.category_id = "Category Is required !!!"
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
            formData.append('product_price', value.product_price);
            formData.append('product_brand', value.product_brand.trim());
            formData.append('product_company', value.product_company.trim());
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
            }
        }


    };



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

                    >
                        <option value="" disabled>Select Category</option>
                        {renderOptions(categories)}
                    </Form.Select>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Name" name='product_name' value={value.product_name} onChange={handleChange} />
                        {formError && <span className='validationError'>{formError.product_name}</span>}

                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label>Product Price</Form.Label>
                        <Form.Control type="number" placeholder="Enter Price" name='product_price' value={value.product_price} onChange={handleChange} />
                        {formError && <span className='validationError'>{formError.product_price}</span>}
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label>Product Brand</Form.Label>
                        <Form.Control type="text" placeholder="Enter Brand" name='product_brand' value={value.product_brand} onChange={handleChange} />
                        {formError && <span className='validationError'>{formError.product_brand}</span>}
                    </Form.Group>

                    <Form.Group className="mb-3" >
                        <Form.Label>Product Company</Form.Label>
                        <Form.Control type="text" placeholder="Enter Company" name='product_company' value={value.product_company} onChange={handleChange} />
                        {formError && <span className='validationError'>{formError.product_company}</span>}
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
                            {formError && <span className='validationError'>{formError.thumbnail_image}</span>}
                        </Form.Group>
                    </Form.Group>

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