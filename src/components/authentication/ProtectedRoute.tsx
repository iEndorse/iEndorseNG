import React from 'react';
import { toast } from 'sonner';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from './auth';

const ProtectedRoute: React.FC = () => {
  // Check if the user is authenticated
  const isUserAuthenticated = isAuthenticated();

  // If the user is not authenticated, redirect to the login page
  if (!isUserAuthenticated) {
    window.localStorage.clear();
    toast.error("Please login to access this page");
    const intendedUrl = window.location.pathname;
    return <Navigate to={`/SignIn?next=${intendedUrl}`} replace />;
    // return <Navigate to="/SignIn" replace />;
  }
else
{
  // If the user is authenticated, render the protected routes via Outlet
  return <Outlet />;
}
};

export default ProtectedRoute;








