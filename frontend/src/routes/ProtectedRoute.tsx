import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.status === 'SUSPENDED') {
    return <Navigate to="/suspended" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === 'ADMIN') {
      return <Navigate to="/unauthorized" replace />;
    }
    if (requiredRole === 'STUDENT' && user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};
