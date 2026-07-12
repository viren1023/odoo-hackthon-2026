import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Wraps a group of routes and enforces two things from spec section 3.1:
 *   - "Only authenticated users should access the application"
 *   - "Support Role-Based Access Control (RBAC)"
 *
 * Usage as a layout route:
 *   <Route element={<ProtectedRoute />}>              // auth only
 *   <Route element={<ProtectedRoute allowedRoles={['fleet_manager']} />}>  // auth + role
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-500 text-sm">
        Checking your session...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Keep the attempted URL so a future enhancement could send the user
    // back where they were headed after they sign in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Outlet renders whichever nested <Route> matched — this component never
  // needs to know what page it's protecting.
  return <Outlet />;
}
