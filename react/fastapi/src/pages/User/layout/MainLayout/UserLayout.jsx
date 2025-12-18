import React, { Children } from 'react'
import Header from '../Components/Header'
import Sidebar from '../Components/Sidebar'
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

function UserLayout() {

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('auth');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole')
    };
    return (
        <>

            <div className="main-wrapper">

                <Header onLogout={handleLogout} />
                <div className="main-content-wrapper">
                    <Outlet />
                </div>

            </div>


        </>
    )
}

export default UserLayout