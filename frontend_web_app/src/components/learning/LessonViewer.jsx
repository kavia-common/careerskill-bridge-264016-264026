import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function LessonViewer() {
  /** Placeholder lesson viewer. */
  const { id, lessonId } = useParams();
  const { t } = useTranslation('common');

  return (
    <div className="card">
      <h3 className="m-0 mb-16">{t('pages.lessonViewer')} - {id}/{lessonId}</h3>
      <p className="text-muted">{t('pages.comingSoon')}</p>
    </div>
  );
}
