import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import apiClient from '../services/apiClient';

// Parse feature flags from env var JSON or comma-separated list
function parseFeatureFlags() {
  const raw = process.env.REACT_APP_FEATURE_FLAGS || '';
  try {
    if (raw.trim().startsWith('{')) {
      return JSON.parse(raw);
    }
    if (raw.trim().length === 0) return {};
    // comma-separated "flagA,flagB"
    return raw.split(',').reduce((acc, k) => {
      const key = k.trim();
      if (key) acc[key] = true;
      return acc;
    }, {});
  } catch {
    return {};
  }
}

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access the authentication context. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides authentication state and actions.
   * Persists a token in localStorage (key: 'sb_token') and user profile stub.
   */
  const [token, setToken] = useState(localStorage.getItem('sb_token') || null);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('sb_user');
    return u ? JSON.parse(u) : null;
  });
  const [loading, setLoading] = useState(false);
  const features = useMemo(parseFeatureFlags, []);

  useEffect(() => {
    if (token) localStorage.setItem('sb_token', token);
    else localStorage.removeItem('sb_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('sb_user', JSON.stringify(user));
    else localStorage.removeItem('sb_user');
  }, [user]);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Stub auth request; replace with backend endpoint if available
      // const res = await apiClient.post('/auth/login', { email, password });
      // const { token: tkn, user: usr } = res.data;

      const tkn = 'demo-token';
      const usr = { id: 'me', email };
      setToken(tkn);
      setUser(usr);
      return { success: true };
    } catch (e) {
      return { success: false, error: e?.response?.data || e.message };
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const register = async (email, password) => {
    setLoading(true);
    try {
      // const res = await apiClient.post('/auth/register', { email, password });
      // const { token: tkn, user: usr } = res.data;
      const tkn = 'demo-token';
      const usr = { id: 'me', email };
      setToken(tkn);
      setUser(usr);
      return { success: true };
    } catch (e) {
      return { success: false, error: e?.response?.data || e.message };
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout, features }),
    [token, user, loading, features]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
