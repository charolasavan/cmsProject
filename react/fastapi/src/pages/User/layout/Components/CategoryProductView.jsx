import React, { useEffect, useState } from 'react'
import api from 'api/apiClient';
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
function CategoryProductView({ searchProduct }) {
    // console.log(props)
    const [productData, setProductData] = useState([])
    const [filterData, setFilterData] = useState([])
    const category_id = parseInt(searchProduct.category_id);

    const fetchProduct = async () => {
        try {
            const response = await api.get('/products/')
            // console.log(response.data)
            setProductData(response.data);
            setFilterData(response.data)
        }
        catch (error) {
            console.log(error?.response?.data?.detail || error.message || "Faild To Fetch Iteams")
        }
    }




    useEffect(() => {
        fetchProduct();
        // fetchCategoryProduct()
    }, [])

    useEffect(() => {
        const fetchCategoryProduct = async () => {
            try {
                if (category_id) {
                    const responseData = await api.post(`/products/category/${category_id}`)
                    if (responseData.data && responseData.data.length > 0) {
                        setFilterData(responseData.data)
                    }
                    else {
                        setFilterData([])
                    }
                }
            }
            catch (error) {
                console.log('product Not found')
            }
        }
        fetchCategoryProduct()
    }, [category_id])
    return (
        <>
            {filterData.map((data, index) => {
                return (
                    <div key={index} className="product-card">
                        <div className="product-img">
                            <Link to={`/user/products/${data.id}`}>

                                <img
                                    className='thumbnail_img'
                                    src={`http://localhost:8000${data.thumbnail_image}`}
                                    alt='productImage'
                                />
                            </Link>
                        </div>
                        <div className="product-detail">
                            <h3>{data.product_name}</h3>
                            {/* <p>₹{data.selling_price}</p> */}
                            {data.selling_price ==0 ? <p>₹{data.regular_price}</p> : <p>₹{data.selling_price}</p> }
                        </div>
                        <div className="product-add-cart">
                            <button>
                                Add to cart <span><FaArrowRight /></span>
                            </button>
                        </div>
                    </div>
                )
            })}

            {filterData == '' && (
                <>
                    <div className="flex">
                        <h1>
                            Not Found
                        </h1>
                    </div>

                </>

            )}
        </>

    )
}

export default CategoryProductView