import React from 'react';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function NotificationsBell() {
  /** Minimal bell indicator placeholder. */
  const { t } = useTranslation('common');
  return (
    <button className="btn secondary" aria-label={t('app.notifications')} title={t('app.notifications')}>
      🔔
    </button>
  );
}
