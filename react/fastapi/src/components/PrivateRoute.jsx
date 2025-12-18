import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ allowedRole, children }) {
  const role = localStorage.getItem("userRole");
  const auth = localStorage.getItem("isLoggedin") === "true"; // convert to boolean

  if (!auth) return <Navigate to="/login" replace />;

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
