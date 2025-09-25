
import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../api';
import Swal from 'sweetalert2';

function CategoryList() {
  const [categories, setCategories] = useState([]); // setCategory for select Product
  const [form, setForm] = useState({ category_name: '', parent_id: 0 });
  const [formError, setFormError] = useState([])
  // Load Then Fetch all categories
  useEffect(() => {
    fetchCategories();
  }, []);


  // fetch categories 
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
      console.error(error)
    }
  };



  const handleChange = (e) => {
    e.preventDefault();
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));


  };


  // categories submit or add
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = {}
    if (!form.category_name?.trim()) {
      validation.category_name = "Category is Required !!!"
    }
    setFormError(validation)
    if (Object.keys(validation).length === 0) {

      try {
        await api.post('/category/', form);
        setForm({ category_name: '', parent_id: 0 });
        fetchCategories();
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
          title: "Category Create successfully"
        });
      }
      catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.detail || "Failed to Fetch Category.",
        });
      }
    }

  };

  // delete categories
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
        await api.delete(`/category/${id}`);
        fetchCategories();
        Swal.fire({
          title: "Deleted!",
          text: "Your Category has been deleted.",
          icon: "success"
        });
      }

      catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops..",
          text: error?.response?.data?.detail || error.message || "Faild To Delete"
        });

      }
    }
  };


  // recursive method to display nth level categories
  const renderOptions = (items, depth = 0) =>
    items.flatMap(({ category_id, category_name, children = [] }) => [
      <option key={category_id} value={category_id}>
        {`${'-'.repeat(depth)}${category_name}`}
      </option>,
      ...renderOptions(children, depth + 1)
    ]);

  // display table using recursive method
  let count = 0;   // display Counte of category number
  const renderCategory = (items, depth = 0) => {
    return items.flatMap(({ category_id, category_name, children = [] }) => {
      count++;
      return [
        <tr key={category_id}>
          <td>{count}</td>
          <td>{category_id}</td>
          <td>{`${'-'.repeat(depth)}${category_name}`}</td>
          <td>
            <Link to={`/editcategory/${category_id}`}>
              <Button>Edit</Button>
            </Link>
          </td>
          <td>
            <Button variant="danger" onClick={() => handleDelete(category_id)}>
              Delete
            </Button>
          </td>
        </tr>,
        ...renderCategory(children, depth + 1)
      ];
    });
  };

  return (
    <div className="m-2">
      <h3>Category</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Parent Category</Form.Label>
          <Form.Select name="parent_id" value={form.parent_id} onChange={handleChange} required>
            <option value="" disabled>Select Parent Category</option>
            <option value={0}>Root Category</option>
            {renderOptions(categories)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            name="category_name"
            value={form.category_name}
            onChange={handleChange}
            placeholder="Enter Category Name"
          />
          {formError && <span className='validationError'>{formError.category_name}</span>}
        </Form.Group>
        <Button type="submit" variant='primary'>Add</Button>
      </Form>

      {/* display category in table */}
      <Table striped bordered hover className="text-center mt-5">
        <thead>
          <tr>
            <th>No</th>
            <th>Category Id</th>
            <th>Category</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {renderCategory(categories)}
        </tbody>
      </Table>
    </div>
  );
}

export default CategoryList;
