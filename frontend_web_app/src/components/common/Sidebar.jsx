import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Navigation sidebar for protected routes. */
  const { t } = useTranslation('common');
  return (
    <aside className="sb-sidebar" aria-label="Sidebar">
      <div className="sb-logo">{t('app.title')}</div>
      <nav className="sb-nav">
        <NavLink to="/dashboard">{t('nav.dashboard')}</NavLink>
        <NavLink to="/modules">{t('nav.modules')}</NavLink>
        <NavLink to="/portfolio">{t('nav.portfolio')}</NavLink>
        <NavLink to="/mentorship">{t('nav.mentorship')}</NavLink>
        <NavLink to="/job-tools">{t('nav.jobTools')}</NavLink>
        <NavLink to="/settings">{t('nav.settings')}</NavLink>
      </nav>
    </aside>
  );
}
