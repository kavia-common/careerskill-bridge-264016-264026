import React from 'react';
import ProgressWidget from './ProgressWidget';
import RecommendationsWidget from './RecommendationsWidget';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function DashboardHome() {
  /** Dashboard main view with widgets. */
  const { t } = useTranslation('common');
  return (
    <div>
      <h2 className="m-0 mb-16">{t('pages.welcome')}</h2>
      <div className="grid-2">
        <ProgressWidget />
        <RecommendationsWidget />
      </div>
    </div>
  );
}
