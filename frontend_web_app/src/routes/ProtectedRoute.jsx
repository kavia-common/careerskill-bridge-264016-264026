import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

// PUBLIC_INTERFACE
export default function ProtectedRoute() {
  /**
   * Protects routes by checking for an auth token.
   * If no token exists, redirect to /login.
   */
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
