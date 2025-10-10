import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../api'
import Swal from 'sweetalert2';

function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    product_name: '',
    regular_price: '',
    selling_price: '',
    product_quantity: '',
    product_brand: '',
    product_company: '',
    product_status: '',
    product_description: '',
    category_id: '',
    thumbnail_image: '',
  });

  const [productImages, setProductImages] = useState([])
  const [formError, setFormError] = useState([])
  const navigate = useNavigate();


  const handleImages = (e) => {
    e.preventDefault()
    setProductImages(Array.from(e.target.files))
  }


  // Handle input changes
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.name === 'thumbnail_image') {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.files[0],
      }));
    }
    else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = {}
    if (!formData.category_id) {
      validation.category_id = "Category  is required"
    }

    if (!formData.product_name?.trim()) {
      validation.product_name = "Product name is required"
    }

    if (!formData.regular_price) {
      validation.regular_price = "Regular Price is required"
    }

    if (!formData.selling_price) {
      validation.selling_price = "Selling Price is required"
    }
    if (!formData.product_quantity) {
      validation.product_quantity = "Quantity is required"
    }

    if (!formData.product_brand?.trim()) {
      validation.product_brand = "Product brand is required"
    }

    if (!formData.product_company?.trim()) {
      validation.product_company = "Product Company is required"
    }

    if (!formData.product_status?.trim()) {
      validation.product_status = "Product Status is required"
    }

    if (!formData.product_description?.trim()) {
      validation.product_description = "Product Description is required"
    }

    if (!formData.thumbnail_image) {
      validation.thumbnail_image = "Thumbnail Image is required"
    }

    setFormError(validation)

    if (Object.keys(validation).length === 0) {
      // console.log(validation)
      const addProductData = new FormData();
      addProductData.append('product_name', formData.product_name.trim());
      addProductData.append('regular_price', formData.regular_price.trim());
      addProductData.append('selling_price', formData.selling_price.trim());
      addProductData.append('product_quantity', formData.product_quantity);
      addProductData.append('product_brand', formData.product_brand.trim());
      addProductData.append('product_company', formData.product_company.trim());
      addProductData.append('product_status', formData.product_status.trim());
      addProductData.append('product_description', formData.product_description.trim());
      addProductData.append('category_id', formData.category_id);
      addProductData.append('thumbnail_image', formData.thumbnail_image);
      productImages.forEach(image => {
        addProductData.append('images', image)
      });

      // addProductData.forEach (data => {
      //   console.log(data)
      // })

      // console.log(add)

      try {
        await api.post('/products/', addProductData);
        Swal.fire({
          icon: 'success',
          title: 'Product Created Successfully',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
        navigate('/products');
      }
      catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.detail || "Failed to add category.",
        });
      }
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
      </option>
      ,
      ...renderOptions(children, depth + 1),
    ]);

  return (
    <div className="m-3">
      <h3>Add Product</h3>
      <Form onSubmit={handleSubmit} encType='multipart/form-data'>
        <Row>
          <Col>
            <Form.Group className='mb-3'>
              <Form.Label>Product Category</Form.Label>
              <Form.Select
                name="category_id"
                value={formData.category_id}
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
                value={formData.product_name}
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
                value={formData.regular_price}
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
                value={formData.selling_price}
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
                value={formData.product_quantity}
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
                value={formData.product_brand}
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
                value={formData.product_company}
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
                value={formData.product_status}
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
            <Form.Control as="textarea" name='product_description' rows={3} value={formData.product_description} onChange={handleChange} style={{ resize: 'none' }} />
          </Form.Group>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Thumbnail Image</Form.Label>
              <Form.Control
                type="file"
                name="thumbnail_image"
                accept="image/*"
                onChange={handleChange}
              // required
              />
              {formError.thumbnail_image && <span className='validationError'>{formError.thumbnail_image}</span>}
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                name="images"
                accept="image/*"
                onChange={handleImages}
                multiple
              />
              {formError.productImages && <span className='validationError'>{formError.productImages}</span>}
            </Form.Group>
          </Col>
        </Row>

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