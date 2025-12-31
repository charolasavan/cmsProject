import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ allowedRole, children }) {
  const isLoggedIn = localStorage.getItem("isLoggedin") === "true";
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  // Not logged in or token missing
  if (!isLoggedIn || !token) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
