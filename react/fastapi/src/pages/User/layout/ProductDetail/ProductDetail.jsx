import api from 'api/apiClient'
import React, { useEffect, useState } from 'react'
import {  useNavigate, useParams } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa6";
import ProductViewSlider from '../Components/ProductViewSlider';

function ProductDetail() {
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


    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            if (response.data) {
                setValue(response.data)
                // setProductDetail(response.data)
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchProduct()
    }, [])

    return (
        <>
            <section className='product-detail-section'>

                <div className="container">
                    <div className='back-to-page'>
                        <button onClick={()=>navigate(-1)}>
                            Back to page
                        </button>
                    </div>
                    <div className='main-section'>
                        <div className='product-information'>
                            <div className='product-name'>
                                <h2><span>{value.product_name}</span></h2>
                            </div>
                            <div className='product-inner-detail'>
                                <p className='regular_price'>M.R.P: <span>{value.regular_price + ' ' + '₹'} </span></p>
                                <p className='price'> <span>{value.selling_price + ' ' + '₹'}</span></p>
                                <p className='quantity'>Quantity:<span>{value.product_quantity}</span></p>
                                <p className='slogan'><span>{value.product_description}</span></p>
                            </div>
                            <div className='product-company-info'>
                                <h3 className='company-heading'>Company info </h3>
                                <p className='product-brand'>Brand: <span>{value.product_brand}</span></p>
                                <p className='product-company'>Company: <span>{value.product_company}</span></p>
                            </div>
                            {value.product_status === "Active" ? (
                                <>
                                    <div className='.product-add-cart'>
                                        <button>
                                            Add to cart <span><FaArrowRight /></span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <h3>Not Available </h3>
                                    </div>
                                </>
                            )}

                        </div>

                        <div className='product-slider'>
                            <ProductViewSlider productImages={value.images} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ProductDetail