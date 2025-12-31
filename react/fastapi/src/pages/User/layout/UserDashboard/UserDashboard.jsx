import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "../../../../App.css";

function UserDashboard() {
    const heroRef = useRef(null);

    useEffect(() => {
        gsap.from(heroRef.current, {
            opacity: 0,
            y: 80,
            duration: 1.2,
            ease: "power3.out",
        });
    }, []);


    return (
        <>
            {/* HERO */}
            <section className="user-main-section hero-section">
                <div className="container">
                    <div className="hero-content" ref={heroRef}>
                        <motion.h1
                            initial={{ opacity: 0, y: -40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Welcome to Your Product Dashboard
                        </motion.h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                            Explore and manage products with ease. Everything you need in one dashboard.
                        </motion.p>
                        <Link to="/user/products">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="view-product-section">
                                View Products
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </section>

           
        </>
    );
}

export default UserDashboard;
