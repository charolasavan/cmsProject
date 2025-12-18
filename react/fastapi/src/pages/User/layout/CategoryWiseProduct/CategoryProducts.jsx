import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa6";
import api from 'api/apiClient';
import { FaArrowRight } from "react-icons/fa6";

function Products() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [categoryProduct, setCategoryProduct] = useState([])
    const [filterData, setFilterData] = useState([])

    const handleFetchProduct = async () => {
        try {
            const response = await api.post(`/products/category/${id}`)
            if (response.data && response.data.length > 0) {
                setCategoryProduct(response.data)
            }

        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleFetchProduct()
    }, [])
    return (
        <>
            <section className='category-product-main-section'>
                <div className="container">
                    <div className='main-section'>

                        <button onClick={() => navigate('/user/products')}>
                            <span>
                                <FaArrowLeft />
                            </span>
                            Back to Products
                        </button>


                        <div className='list-products'>
                            {categoryProduct.map((data, index) => {
                                return (
                                    <div key={index} className="product-card">
                                        <div className="product-img">
                                            <img
                                                className='thumbnail_img'
                                                src={`http://localhost:8000${data.thumbnail_image}`}
                                                alt='productImage'
                                            />
                                        </div>
                                        <div className="product-detail">
                                            <h3>{data.product_name}</h3>
                                            <p>₹{data.selling_price}</p>
                                        </div>
                                        <div className="product-add-cart">
                                            <button>
                                                Add to cart <span><FaArrowRight /></span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}

                            {categoryProduct == '' && (
                                <>
                                    <div className="flex">
                                        <h1>
                                            Not Found
                                        </h1>
                                    </div>

                                </>

                            )}
                        </div>


                    </div>
                </div>
            </section>
        </>
    )
}

export default Products