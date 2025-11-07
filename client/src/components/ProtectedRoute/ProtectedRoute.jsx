import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Redirects to login page if user is not authenticated
 * 
 * @param {React.Component} children - The component to render if authenticated
 * @param {string|string[]} allowedRoles - Optional: specific roles allowed to access this route
 */
const ProtectedRoute = ({ children, allowedRoles = null }) => {
  const { isAuthenticated, user, loading } = useUser();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page, saving the current location
    // This allows redirecting back after successful login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if specified
  if (allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (!user || !roles.includes(user.role)) {
      // User doesn't have required role, redirect to home or show error
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">גישה נדחתה</h2>
            <p className="text-gray-600 mb-6">
              אין לך הרשאה לגשת לדף זה. נדרשת הרשאה של: {roles.join(' או ')}
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all"
            >
              חזור
            </button>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and has required role (if specified)
  return children;
};

export default ProtectedRoute;

