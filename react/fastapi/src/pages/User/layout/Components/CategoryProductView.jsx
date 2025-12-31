import React, { useEffect, useState } from 'react';
import api from 'api/apiClient';
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function CategoryProductView({ searchProduct }) {

    const [filterData, setFilterData] = useState([]);

    const handleSetCart = async (product_id) => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            Swal.fire("Please login first");
            return;
        }

        const cartData = new FormData();
        cartData.append('user_id', user.id);
        cartData.append('product_id', product_id);
        cartData.append('product_quantity', 1);

        try {
            await api.post('/addtocart/', cartData);
            Swal.fire({
                icon: 'success',
                title: 'Add To Cart Successfully',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
            });
        } catch (error) {
            Swal.fire("Failed to add cart");
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // ✅ ALL PRODUCTS
                if (!searchProduct.category_id) {
                    const response = await api.get('/products/');
                    setFilterData(response.data);
                }
                // ✅ CATEGORY PRODUCTS
                else {
                    const response = await api.post(
                        `/products/category/${parseInt(searchProduct.category_id)}`
                    );
                    setFilterData(response.data || []);
                }
            } catch (error) {
                setFilterData([]);
            }
        };

        fetchProducts();
    }, [searchProduct.category_id]);
    return (
        <>
            {filterData.length > 0 ? (
                filterData.map((data) => (
                    <div key={data.id} className="product-card">
                        <div className="product-img">
                            <Link to={`/user/products/${data.id}`}>
                                <img
                                    className="thumbnail_img"
                                    src={`http://localhost:8000${data.thumbnail_image}`}
                                    alt={data.product_name}
                                />
                            </Link>
                        </div>

                        <div className="product-detail">
                            <h3>{data.product_name}</h3>
                            <p>
                                ₹{data.selling_price === 0
                                    ? data.regular_price
                                    : data.selling_price}
                            </p>
                        </div>

                        <div className="product-add-cart">
                            <button onClick={() => handleSetCart(data.id)}>
                                Add to cart <span><FaArrowRight /></span>
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex">
                    <h1>Not Found</h1>
                </div>
            )}
        </>
    );

}

export default CategoryProductView;
