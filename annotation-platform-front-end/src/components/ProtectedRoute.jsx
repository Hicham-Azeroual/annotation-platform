import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import Cookies from 'js-cookie';
import { parseJwt, isTokenExpired } from '../utils/jwt';

const ProtectedRoute = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const token = Cookies.get('token');
  const location = useLocation();
  const [redirectTo, setRedirectTo] = useState(null); // State to control redirects

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, [token, logout]);

  // If not authenticated, redirect to login
  if (!isAuthenticated || !token || isTokenExpired(token)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user or user.role is undefined, redirect to login
  if (!user || !user.role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Define role-based route access
  const adminRoutes = [
    '/dashboard',
    '/datasets',
    '/datasets/:datasetId',
    '/annotators',
    '/datasets/:datasetId/assign',
    '/settings',
  ];
  const userRoutes = [
    '/dashboard-user',
    '/tasks',
    '/my-work',
    '/history',
    '/settings-user',
  ];

  // Get the current pathname
  const currentPath = location.pathname;

  // Helper to check if a path matches a route pattern
  const matchRoute = (path, route) => {
    if (route.includes(':')) {
      const baseRoute = route.split('/:')[0];
      return path.startsWith(baseRoute);
    }
    return path === route || path === '/'; // Treat '/' as a special case
  };

  // Check if the current path is allowed for the user's role
  const isAdminRoute = adminRoutes.some(route => matchRoute(currentPath, route));
  const isUserRoute = userRoutes.some(route => matchRoute(currentPath, route));

  // Determine the default route based on role
  const defaultRoute = user.role === 'admin' ? '/dashboard' : '/dashboard-user';

  // Role-based access control
  if (user.role === 'ADMIN') {
    if (isUserRoute && currentPath !== '/') {
      return <Navigate to="/dashboard" replace />;
    }
  } else if (user.role === 'ANNOTATOR') {
    if (isAdminRoute && currentPath !== '/') {
      return <Navigate to="/dashboard-user" replace />;
    }
  }

  // Handle the root path ('/')
  if (currentPath === '/') {
    return <Navigate to={defaultRoute} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;