import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRole
}) {

  const role =
    localStorage.getItem("role");

  if (!role) {

    return (
      <Navigate to="/" />
    );

  }

  if (
    role !== allowedRole
  ) {

    return (
      <Navigate to="/" />
    );

  }

  return children;
}

export default ProtectedRoute;