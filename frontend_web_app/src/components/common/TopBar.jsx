import React from 'react';
import LanguageSelector from './LanguageSelector';
import NotificationsBell from './NotificationsBell';
import { useAuth } from '../../state/AuthContext';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function TopBar({ theme, onToggleTheme }) {
  /**
   * TopBar with language selector, notifications, theme toggle, and logout.
   */
  const { logout, user } = useAuth();
  const { t } = useTranslation('common');

  return (
    <header className="sb-topbar" role="banner">
      <div className="left">
        <strong>{user?.email}</strong>
      </div>
      <div className="right" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <LanguageSelector />
        <NotificationsBell />
        <button className="btn secondary" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button className="btn" onClick={logout}>{t('app.logout')}</button>
      </div>
    </header>
  );
}
