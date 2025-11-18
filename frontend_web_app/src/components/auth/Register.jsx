import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration screen with email and password confirmation. */
  const { register, token, loading } = useAuth();
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  if (token) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return;
    const res = await register(email, password);
    if (res.success) navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <h2 className="auth-header">{t('app.register')}</h2>
      <form onSubmit={onSubmit}>
        <label className="text-muted">{t('auth.email')}</label>
        <input className="input mt-12" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="text-muted mt-16">{t('auth.password')}</label>
        <input className="input mt-12" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <label className="text-muted mt-16">{t('auth.confirmPassword')}</label>
        <input className="input mt-12" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <button className="btn mt-16" type="submit" disabled={loading}>
          {t('auth.signUp')}
        </button>
      </form>
      <p className="mt-16">
        {t('auth.haveAccount')} <Link to="/login">{t('auth.signIn')}</Link>
      </p>
    </div>
  );
}
