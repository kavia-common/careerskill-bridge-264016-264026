import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../state/AuthContext';

// PUBLIC_INTERFACE
export default function LessonViewer() {
  /** Load lesson content and allow marking as complete. */
  const { id, lessonId } = useParams();
  const { t } = useTranslation('common');
  const { api } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [err, setErr] = useState(null);
  const [doneMsg, setDoneMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await api.getLesson(lessonId);
        if (isMounted) setLesson(data);
      } catch (e) {
        if (isMounted) setErr(e?.response?.data?.detail || e.message || 'Failed to load lesson');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [api, lessonId]);

  const markComplete = async () => {
    setCompleting(true);
    setDoneMsg(null);
    try {
      await api.completeLesson(lessonId);
      setDoneMsg('Marked as complete.');
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message || 'Failed to mark complete');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="card">
      <h3 className="m-0 mb-16">{t('pages.lessonViewer')} - {id}/{lessonId}</h3>
      {loading && <div className="loading" role="status">Loading...</div>}
      {err && <div role="alert" style={{ color: 'var(--color-error)' }}>{err}</div>}
      {!loading && !err && (
        <>
          <p className="text-muted">{lesson?.title || 'Lesson'}</p>
          <div className="mt-12">{lesson?.content || '...'}</div>
          <button className="btn mt-16" onClick={markComplete} disabled={completing}>
            {completing ? '...' : 'Mark Complete'}
          </button>
          {doneMsg && <div className="mt-12" style={{ color: 'var(--color-success)' }}>{doneMsg}</div>}
        </>
      )}
    </div>
  );
}
