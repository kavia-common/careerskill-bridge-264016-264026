import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * PUBLIC_INTERFACE
 */
export default function Sidebar() {
  /** Navigation sidebar for protected routes with accessibility and responsive collapse. */
  const { t } = useTranslation('common');
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Auto-collapse on very small screens initially
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const setByMQ = () => setCollapsed(mq.matches);
    setByMQ();
    mq.addEventListener?.('change', setByMQ);
    return () => mq.removeEventListener?.('change', setByMQ);
  }, []);

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <aside
      className={`sb-sidebar ${collapsed ? 'is-collapsed' : ''}`}
      aria-label={t('app.title')}
      role="navigation"
    >
      <div className="sb-logo" aria-label={t('app.title')}>
        {t('app.title')}
      </div>

      {/* Collapse/expand toggle visible for screen readers and touch users */}
      <button
        className="btn secondary mt-12"
        onClick={() => setCollapsed((v) => !v)}
        aria-expanded={!collapsed}
        aria-controls="primary-navigation"
        aria-label={collapsed ? 'Open navigation' : 'Close navigation'}
      >
        {collapsed ? '☰' : '×'}
      </button>

      <nav id="primary-navigation" className="sb-nav" aria-label="Primary" role="navigation">
        <NavLink to="/dashboard" aria-current={isActive('/dashboard') ? 'page' : undefined}>
          {t('nav.dashboard')}
        </NavLink>
        <NavLink to="/modules" aria-current={isActive('/modules') ? 'page' : undefined}>
          {t('nav.modules')}
        </NavLink>
        <NavLink to="/portfolio" aria-current={isActive('/portfolio') ? 'page' : undefined}>
          {t('nav.portfolio')}
        </NavLink>
        <NavLink to="/mentorship" aria-current={isActive('/mentorship') ? 'page' : undefined}>
          {t('nav.mentorship')}
        </NavLink>
        <NavLink to="/job-tools" aria-current={isActive('/job-tools') ? 'page' : undefined}>
          {t('nav.jobTools')}
        </NavLink>
        <NavLink to="/settings" aria-current={isActive('/settings') ? 'page' : undefined}>
          {t('nav.settings')}
        </NavLink>
      </nav>
    </aside>
  );
}
