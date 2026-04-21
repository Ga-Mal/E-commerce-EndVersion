import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function ProtectedRoute({ requiredRole }) {
  const { isLoggedIn, userRole } = useAuth();

  if (!isLoggedIn) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    toast.error('Unauthorized access. Admin privileges required.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
