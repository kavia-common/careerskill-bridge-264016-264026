import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import http, { api } from '../services/apiClient';

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
   * Persists a token in localStorage (key: 'sb_token') and user profile.
   */
  const [token, setToken] = useState(localStorage.getItem('sb_token') || null);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('sb_user');
    return u ? JSON.parse(u) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const features = useMemo(parseFeatureFlags, []);

  // Keep localStorage synced
  useEffect(() => {
    if (token) localStorage.setItem('sb_token', token);
    else localStorage.removeItem('sb_token');
  }, [token]);
  useEffect(() => {
    if (user) localStorage.setItem('sb_user', JSON.stringify(user));
    else localStorage.removeItem('sb_user');
  }, [user]);

  // Validate session by calling /users/me if token exists
  useEffect(() => {
    let isMounted = true;
    async function validate() {
      if (!token) return;
      try {
        setLoading(true);
        const me = await api.me();
        if (isMounted) setUser(me);
      } catch (e) {
        if (isMounted) {
          setError('Session expired. Please sign in again.');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    validate();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token: tkn } = await api.login(email, password);
      if (!tkn) {
        throw new Error('Login succeeded but no access token was returned.');
      }

      /**
       * Critical: our Axios interceptor reads the token from localStorage.
       * React state updates + useEffect syncing token->localStorage are async, so
       * calling api.me() immediately after setToken(tkn) can race and send no header.
       *
       * Fix: write localStorage synchronously before api.me().
       */
      localStorage.setItem('sb_token', tkn);
      setToken(tkn);

      // Fetch user profile after login to populate context and enable guards/UI.
      const me = await api.me();
      setUser(me);

      return { success: true };
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.detail ||
        e.message ||
        'Login failed';
      setError(msg);

      // Clear any possibly-written token/user to avoid stuck/invalid sessions.
      localStorage.removeItem('sb_token');
      localStorage.removeItem('sb_user');

      setToken(null);
      setUser(null);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token: tkn } = await api.register(email, password);
      if (!tkn) {
        throw new Error('Registration succeeded but no access token was returned.');
      }

      // See login() for rationale: ensure interceptor can read token immediately.
      localStorage.setItem('sb_token', tkn);
      setToken(tkn);

      // Fetch user profile after registration for consistent post-auth state.
      const me = await api.me();
      setUser(me);

      return { success: true };
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.detail ||
        e.message ||
        'Registration failed';
      setError(msg);

      localStorage.removeItem('sb_token');
      localStorage.removeItem('sb_user');

      setToken(null);
      setUser(null);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, error, login, register, logout, features, http, api }),
    [token, user, loading, error, features]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
