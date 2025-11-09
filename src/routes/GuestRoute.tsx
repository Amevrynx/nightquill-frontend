import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const GuestRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default GuestRoute;
