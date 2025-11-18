import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function QuizRunner() {
  /** Placeholder quiz runner. */
  const { id, quizId } = useParams();
  const { t } = useTranslation('common');
  return (
    <div className="card">
      <h3 className="m-0 mb-16">{t('pages.quizRunner')} - {id}/{quizId}</h3>
      <p className="text-muted">{t('pages.comingSoon')}</p>
    </div>
  );
}
