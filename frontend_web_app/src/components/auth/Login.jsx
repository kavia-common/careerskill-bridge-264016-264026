import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login screen with email/password inputs. */
  const { login, token, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  if (token) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <h2 className="auth-header">{t('app.login')}</h2>
      {error && <div role="alert" className="text-muted" style={{ color: 'var(--color-error)' }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <label className="text-muted">{t('auth.email')}</label>
        <input className="input mt-12" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="text-muted mt-16">{t('auth.password')}</label>
        <input className="input mt-12" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn mt-16" type="submit" disabled={loading}>
          {loading ? '...' : t('auth.signIn')}
        </button>
      </form>
      <p className="mt-16">
        {t('auth.noAccount')} <Link to="/register">{t('auth.signUp')}</Link>
      </p>
    </div>
  );
}
