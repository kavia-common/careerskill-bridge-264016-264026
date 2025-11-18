import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

// PUBLIC_INTERFACE
export default function ProtectedRoute() {
  /**
   * Protects routes by checking for an auth token and validating with /users/me.
   * If no token exists or validation fails, redirect to /login.
   */
  const { token, user, api } = useAuth();
  const [checking, setChecking] = useState(!!token && !user);
  const [valid, setValid] = useState(!!user || !!token);

  useEffect(() => {
    let isMounted = true;
    async function check() {
      if (!token) return;
      try {
        setChecking(true);
        await api.me();
        if (isMounted) setValid(true);
      } catch {
        if (isMounted) setValid(false);
      } finally {
        if (isMounted) setChecking(false);
      }
    }
    if (token && !user) check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (checking) {
    return <div className="loading" role="status" aria-live="polite">Loading...</div>;
  }
  if (!valid) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
