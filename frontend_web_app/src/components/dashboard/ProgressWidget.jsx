import React from 'react';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function ProgressWidget() {
  /** Placeholder for user progress visualization. */
  const { t } = useTranslation('common');
  return (
    <div className="card">
      <h3 className="m-0 mb-16">{t('pages.progress')}</h3>
      <div className="text-muted">0%</div>
      <div style={{ height: 8, background: '#e5e7eb', borderRadius: 8, marginTop: 8 }}>
        <div style={{ width: '0%', height: '100%', background: 'var(--ocean-success)', borderRadius: 8 }} />
      </div>
    </div>
  );
}
