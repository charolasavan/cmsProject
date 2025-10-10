import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import api from '../../api';
import Swal from 'sweetalert2';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formError, setFormError] = useState([])
  const [categories, setCategories] = useState([]);
  const [value, setValue] = useState({
    category_name: '',
    parent_id: null,
  });





  // Fetch category by ID to edit
  useEffect(() => {
    const fetchCategoryById = async () => {
      try {
        const response = await api.get(`/category/${id}`)
        setValue({
          category_name: response.data.category_name,
          parent_id: response.data.parent_id === 0 ? null : response.data.parent_id,
        })
      }
      catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops..",
          text: error?.response?.data?.detail || error.message || "Faild To Fetch Category"
        });
      }

    }
    const fetchCategory = async () => {
      try {
        const categoryData = await api.get('/category/');
        setCategories(categoryData.data);
        fetchCategoryById()
      }
      catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops..",
          text: error?.response?.data?.detail || error.message || "Faild To Fetch Category"
        });
      }
    }

    fetchCategory()
    fetchCategoryById()
  }, [id]);


  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: name === 'parent_id' ? (value === '0' ? null : parseInt(value)) : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = {}
    if (!value.category_name?.trim()) {
      validation.category_name = "Category Required !!!"
    }
    setFormError(validation)
    if (Object.keys(validation).length === 0) {
      try {
        await api.put(`/category/${id}`, value);
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
        navigate("/categories"); // Navigate to categories list after update
      }
      catch (error) {
        Swal.fire({
          icon: "error",
          title: "Faild",
          text: error?.response?.data?.detail || error.message || "Faild To Update Category"
        });
      }
    }

  };

  // Recursive function to display categories with children
  const renderOptions = (items, depth = 0) =>
    items.map((item) => (
      <React.Fragment key={item.category_id}>
        <option value={item.category_id}>
          {`${"-".repeat(depth)} ${item.category_name}`}
        </option>
        {item.children && item.children.length > 0 && renderOptions(item.children, depth + 1)}
      </React.Fragment>
    ));

  // Show loading or empty state if no categories
  if (categories.length === 0) {
    return <div>No categories available.</div>;
  }

  return (
    <div className='m-3'>
      <h3 className='mb-3'>Edit Category</h3>
      <Form onSubmit={handleSubmit}>

        {/* Parent category selection */}
        <Form.Select
          className="form-select mb-3"
          onChange={handleChange}
          value={value.parent_id || 0}
          name="parent_id"
        >
          <option value={0}>Parent Category</option>
          {renderOptions(categories)}
        </Form.Select>

        {/* Category name input */}
        <Form.Group className="mb-3">
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Category"
            name="category_name"
            value={value.category_name}
            onChange={handleChange}
          />
          {formError && <span className='validationError'>{formError.category_name}</span>}
        </Form.Group>

        {/* Update button */}
        <Button variant="primary" type="submit">
          Update
        </Button>

        {/* Cancel button */}
        <Button
          variant="secondary"
          onClick={() => navigate(-1)} // Go back to previous page
          type="button"
          className='m-3'
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default EditCategory;
