import React from 'react';
import LanguageSelector from './LanguageSelector';
import NotificationsBell from './NotificationsBell';
import { useAuth } from '../../state/AuthContext';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function TopBar({ theme, onToggleTheme }) {
  /**
   * TopBar with language selector, notifications, theme toggle, and logout.
   * Uses role="toolbar" for the right-side control group and accessible labels.
   */
  const { logout, user } = useAuth();
  const { t } = useTranslation('common');

  return (
    <header className="sb-topbar" role="banner" aria-label="Application top bar">
      <div className="left" aria-live="polite">
        <strong>{user?.email}</strong>
      </div>
      <div className="right" role="toolbar" aria-label="Top bar actions">
        <LanguageSelector />
        <NotificationsBell />
        <button
          className="btn secondary"
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Activate dark theme' : 'Activate light theme'}
          title={theme === 'light' ? 'Dark theme' : 'Light theme'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button className="btn" onClick={logout}>{t('app.logout')}</button>
      </div>
    </header>
  );
}
