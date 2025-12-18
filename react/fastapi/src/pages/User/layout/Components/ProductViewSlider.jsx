
import React, { useState } from 'react';
import Slider from 'react-slick';

function ProductViewSlider({ productImages }) {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 200,
        autoplaySpeed: 2000,
        cssEase: "linear"
    };


    return (
        <div className="carousel-container">
            <div className='carousel-content'>
                <div className="product-image">
                    <Slider {...settings}>
                        {productImages.map((images, index) => {
                            return (
                                <div key={index} className='images'>
                                    <img
                                        // className='thumbnail_img'
                                        src={`http://localhost:8000${images.image_name}`}
                                        alt='productImage'
                                    />
                                </div>
                            )
                        })}



                    </Slider>
                </div>
            </div>
        </div >
    );
}
export default ProductViewSlider;