import React from "react";
import { Link } from "react-router-dom";

function UserDashboard() {
    console.log(window.localStorage.getItem('user'))
    return (
        <>
            <Link to={'/user/products'}>

                <button >
                    View product
                </button>
            </Link>
        </>

    )
}

export default UserDashboard