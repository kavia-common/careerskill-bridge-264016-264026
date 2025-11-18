import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function ModuleDetail() {
  /** Placeholder module detail view with lesson/quiz links. */
  const { id } = useParams();
  const { t } = useTranslation('common');

  return (
    <div>
      <h2 className="m-0 mb-16">{t('pages.moduleDetail')} #{id}</h2>
      <div className="card mb-16">
        <p className="m-0 text-muted">{t('pages.comingSoon')}</p>
      </div>
      <div className="grid-2">
        <Link className="btn" to={`/modules/${id}/lesson/1`}>{t('pages.lessonViewer')}</Link>
        <Link className="btn" to={`/modules/${id}/quiz/1`}>{t('pages.quizRunner')}</Link>
      </div>
    </div>
  );
}
