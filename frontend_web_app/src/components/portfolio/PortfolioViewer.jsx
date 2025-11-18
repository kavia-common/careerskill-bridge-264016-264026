import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function PortfolioViewer() {
  /** Placeholder portfolio viewer. */
  const { t } = useTranslation('common');
  return (
    <div className="card">
      <h3 className="m-0 mb-16">{t('pages.portfolio')}</h3>
      <p className="text-muted">Your public portfolio appears here.</p>
      <Link className="btn mt-16" to="/portfolio/edit">Edit</Link>
    </div>
  );
}
