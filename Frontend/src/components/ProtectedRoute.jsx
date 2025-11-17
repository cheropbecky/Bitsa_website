import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated (check token in localStorage)
  const isAuthenticated = localStorage.getItem('adminToken');
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // If authenticated, show the protected page
  return children;
};

export default ProtectedRoute;