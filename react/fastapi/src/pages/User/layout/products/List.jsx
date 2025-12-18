// import React, { useEffect, useState } from "react";
// import { Form } from 'react-bootstrap';
// import { FaArrowRight } from "react-icons/fa6";
// import api from "api/apiClient";
// import Pagination from "components/Pagination";
// import Swal from 'sweetalert2';
// import { useNavigate } from "react-router-dom";

// function UserProductList() {

//     // const [productData, setProductData] = useState([])
//     // const [categories, setCategories] = useState([]);
//     // const [filterData, setFilterData] = useState([])
//     // const [rowsPerPage, setRowsPerPage] = useState(5)

//     // const navigate = useNavigate()

//     // const [searchProduct, setSearchProduct] = useState({
//     //     category_id: '',
//     // })


//     // const fetchCategories = async () => {
//     //     try {
//     //         const { data } = await api.get('/category/');
//     //         setCategories(data);
//     //     } catch (err) {
//     //         console.error('Fetch categories error:', err);
//     //     }
//     // };
//     // const fetchProduct = async () => {
//     //     try {
//     //         const response = await api.get('/products/')
//     //         // console.log(response.data)
//     //         setProductData(response.data);
//     //         setFilterData(response.data)
//     //     }
//     //     catch (error) {
//     //         console.log(error?.response?.data?.detail || error.message || "Faild To Fetch Iteams")
//     //     }
//     // };

//     // useEffect(() => {
//     //     fetchProduct();
//     //     fetchCategories()
//     // }, [])

//     // const handleSearch = async (e) => {
//     //     let categoryId = e.target.value

//     //     if (categoryId) {
//     //         navigate(`/user/products/category/${categoryId}`)
//     //     }
//     // }



//     // const renderOptions = (items, depth = 0) =>
//     //     items.flatMap(({ category_id, category_name, children = [] }) => [
//     //         <li key={category_id} value={category_id}>
//     //             {`${'-'.repeat(depth)} ${category_name}`}
//     //         </li>
//     //         ,
//     //         ...renderOptions(children, depth + 1),
//     //     ]);

//     // const handleChangePage = (event, newPage) => {
//     //     setPage(newPage)
//     // }
//     // const handleChangeRowsPerPage = (event) => {
//     //     setRowsPerPage(parseInt(event.target.value, 10))
//     //     setPage(0)
//     // }


//     return (
//         <section className="main-product-section">
//             <div className="container">
//                 <div className='main-product-view'>
//                     <div className='product-heading'>
//                         <h2>
//                             Our Products
//                         </h2>
//                     </div>
//                     <div className="product-view">
//                         <div className="heading-filter">
//                             <div className="product-count">
//                                 <p>Showing All 3 product</p>
//                             </div>
//                             <div className="filter-product">
//                                 <Form.Select name='sort'>
//                                     <option>Default Sorting</option>
//                                     <option>Default Sorting</option>
//                                 </Form.Select>
//                             </div>
//                         </div>

//                         <div className="list-products">
//                             <Form.Group className='mb-3'>
//                                 <Form.Label>All Products</Form.Label>
//                                 <ul
//                                     name="category_id"
//                                     value={searchProduct.category_id}
//                                     onClick={handleSearch}
//                                 >
//                                     {renderOptions(categories)}
//                                 </ul>
//                             </Form.Group>
//                             {filterData.map((data, index) => {
//                                 return (
//                                     <div key={index} className="product-card">
//                                         <div className="product-img">
//                                             <img
//                                                 className='thumbnail_img'
//                                                 src={`http://localhost:8000${data.thumbnail_image}`}
//                                                 alt='productImage'
//                                             />
//                                         </div>
//                                         <div className="product-detail">
//                                             <h3>{data.product_name}</h3>
//                                             <p>₹{data.selling_price}</p>
//                                         </div>
//                                         <div className="product-add-cart">
//                                             <button>
//                                                 Add to cart <span><FaArrowRight /></span>
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )
//                             })}

//                             {filterData == '' && (
//                                 <>
//                                     <div className="flex">
//                                         <h1>
//                                             Not Found
//                                         </h1>
//                                     </div>

//                                 </>

//                             )}

//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </section >

//     )
// }

// export default UserProductList





import React from 'react'
import { Form } from 'react-bootstrap';
import SideCategory from '../Components/SideCategory'
function UserProductList() {
    return (
        <section className="main-product-section">
            <div className="container">
                <div className='main-product-view'>
                    <div className='product-heading'>
                        <h2>
                            Our Products
                        </h2>
                    </div>
                    <div className="product-view">
                        <div className="heading-filter">
                            <div className="product-count">
                                <p>Showing All 3 product</p>
                            </div>
                            <div className="filter-product">
                                <Form.Select name='sort'>
                                    <option>Default Sorting</option>
                                    <option>Default Sorting</option>
                                </Form.Select>
                            </div>
                        </div>
                        <SideCategory />
                    </div>
                </div>
            </div>
        </section>


    )
}

export default UserProductList