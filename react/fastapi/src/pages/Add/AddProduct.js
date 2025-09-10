import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../api'
import Swal from 'sweetalert2';

function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    product_name: '',
    product_price: '',
    product_brand: '',
    product_company: '',
    category_id: '',
    thumbnail_image: '',
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.name === 'thumbnail_image') {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const addProductData = new FormData();
    addProductData.append('product_name', formData.product_name);
    addProductData.append('product_price', formData.product_price);
    addProductData.append('product_brand', formData.product_brand);
    addProductData.append('product_company', formData.product_company);
    addProductData.append('category_id', formData.category_id);
    addProductData.append('thumbnail_image', formData.thumbnail_image);
    // try {
    //   await api.post('/products/', addProductData);

    //   // alert('Product added successfully!');
    //   // navigate('/products');
    // }
    try {

      await api.post('/products/', addProductData);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer:1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Product Create successfully"
      });
      navigate('/products');
    }
    catch (error) {
      // console.error('Upload error:', error);
      // setError(err.response?.data?.detail || "Failed to add category.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.detail || "Failed to add category.",
      });
    }
  };


  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/category/');
      setCategories(data);
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Recursive function to render category options (for nested categories)
  const renderOptions = (items, depth = 0) =>
    items.flatMap(({ category_id, category_name, children = [] }) => [
      <option key={category_id} value={category_id}>
        {`${'-'.repeat(depth)} ${category_name}`}
      </option>,
      ...renderOptions(children, depth + 1),
    ]);

  return (
    <div className="m-3">
      <h3>Add Product</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Label>Product Category</Form.Label>
        <Form.Select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Category
          </option>
          {renderOptions(categories)}
        </Form.Select>

        <Form.Group className="mb-3">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Product Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Price"
            name="product_price"
            value={formData.product_price}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Product Brand</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Brand"
            name="product_brand"
            value={formData.product_brand}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Product Company</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Company"
            name="product_company"
            value={formData.product_company}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Thumbnail Image</Form.Label>
          <Form.Control
            type="file"
            name="thumbnail_image"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className="d-flex">
          <Button className="me-2" variant="primary" type="submit">
            Submit
          </Button>
          <Button variant="secondary" onClick={() => navigate('/products')}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AddProduct;
