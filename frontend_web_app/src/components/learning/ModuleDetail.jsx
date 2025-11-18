import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../state/AuthContext';

// PUBLIC_INTERFACE
export default function ModuleDetail() {
  /** Module detail view with lessons/quizzes from backend. */
  const { id } = useParams();
  const { t } = useTranslation('common');
  const { api } = useAuth();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await api.getModule(id);
        if (isMounted) setModule(data);
      } catch (e) {
        if (isMounted) setErr(e?.response?.data?.detail || e.message || 'Failed to load module');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [api, id]);

  // Backend ModuleOut does not embed lessons/quizzes in the schema;
  // keep defensive defaults so UI remains stable even if arrays are absent.
  const lessons = Array.isArray(module?.lessons) ? module.lessons : [];
  const quizzes = Array.isArray(module?.quizzes) ? module.quizzes : [];

  return (
    <div>
      <h2 className="m-0 mb-16">{t('pages.moduleDetail')} #{id}</h2>
      {loading && <div className="loading" role="status">Loading...</div>}
      {err && <div role="alert" style={{ color: 'var(--color-error)' }}>{err}</div>}
      {!loading && !err && (
        <>
          <div className="card mb-16">
            <p className="m-0 text-muted">{module?.description || 'Module overview'}</p>
          </div>
          <div className="grid-2">
            {lessons.length > 0 ? (
              lessons.map((l) => (
                <Link className="btn" key={l.id || l.lesson_id} to={`/modules/${id}/lesson/${encodeURIComponent(l.id || l.lesson_id)}`}>
                  {t('pages.lessonViewer')} #{l.id || l.lesson_id}
                </Link>
              ))
            ) : (
              <span className="empty">No lessons.</span>
            )}
            {quizzes.length > 0 ? (
              quizzes.map((q) => (
                <Link className="btn" key={q.id || q.quiz_id} to={`/modules/${id}/quiz/${encodeURIComponent(q.id || q.quiz_id)}`}>
                  {t('pages.quizRunner')} #{q.id || q.quiz_id}
                </Link>
              ))
            ) : (
              <span className="empty">No quizzes.</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
