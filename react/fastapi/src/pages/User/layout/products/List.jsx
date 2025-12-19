
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