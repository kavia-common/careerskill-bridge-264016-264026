import React from 'react';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function RecommendationsWidget() {
  /** Placeholder for personalized learning recommendations. */
  const { t } = useTranslation('common');
  return (
    <div className="card">
      <h3 className="m-0 mb-16">{t('pages.recommendations')}</h3>
      <ul className="m-0">
        <li className="text-muted">Module A</li>
        <li className="text-muted">Module B</li>
        <li className="text-muted">Module C</li>
      </ul>
    </div>
  );
}
