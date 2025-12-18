import React, { Children } from 'react'
import Header from '../Components/Header'
import Sidebar from '../Components/Sidebar'
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import '../../../../App.css'

function AdminLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    useEffect(() => {
        const handleResize = () => {
            setSidebarOpen(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('auth');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole')
    };
    return (
        <>

            <div className="app-container">
                <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} />
                <div className="main-content">
                    <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                    <div className="content-area">
                        <Outlet />
                    </div>
                </div>
            </div>


        </>
    )
}

export default AdminLayout