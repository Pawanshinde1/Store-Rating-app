import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectMap = {
      ADMIN: '/admin/dashboard',
      USER: '/user/stores',
      STORE_OWNER: '/owner/dashboard',
    };
    return <Navigate to={redirectMap[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
