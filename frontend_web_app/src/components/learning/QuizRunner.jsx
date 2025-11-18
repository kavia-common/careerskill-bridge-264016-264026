import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../state/AuthContext';

// PUBLIC_INTERFACE
export default function QuizRunner() {
  /** Start a quiz and allow submission. */
  const { id, quizId } = useParams();
  const { t } = useTranslation('common');
  const { api } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function start() {
      try {
        setLoading(true);
        // Backend expects module_id for /quizzes/{module_id}/start
        const data = await api.startQuiz(id);
        // Normalize questions to {id, text, options:[{value,label}]}
        const normalized = {
          ...data,
          questions: (data?.questions || []).map((q) => ({
            id: q.id,
            text: q.prompt,
            options: [
              { value: 'A', label: q.option_a },
              { value: 'B', label: q.option_b },
              { value: 'C', label: q.option_c },
              { value: 'D', label: q.option_d },
            ].filter((o) => o.label != null),
          })),
        };
        if (isMounted) setQuiz(normalized);
      } catch (e) {
        if (isMounted) setErr(e?.response?.data?.detail || e.message || 'Failed to start quiz');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    start();
    return () => { isMounted = false; };
  }, [api, quizId]);

  const onChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const submit = async () => {
    setSubmitting(true);
    setErr(null);
    setResult(null);
    try {
      const data = await api.submitQuiz(quizId, answers);
      setResult(data);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h3 className="m-0 mb-16">{t('pages.quizRunner')} - {id}/{quizId}</h3>
      {loading && <div className="loading" role="status">Loading...</div>}
      {err && <div role="alert" style={{ color: 'var(--color-error)' }}>{err}</div>}
      {!loading && !err && (
        <>
          <div className="mb-16 text-muted">{quiz?.title || 'Quiz'}</div>
          <div className="grid-2">
            {(quiz?.questions || []).map((q) => (
              <div key={q.id} className="card">
                <strong>{q.text}</strong>
                {(q.options || []).map((opt) => (
                  <label key={opt.value} style={{ display: 'block', marginTop: 8 }}>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt.value}
                      checked={answers[q.id] === opt.value}
                      onChange={(e) => onChange(q.id, e.target.value)}
                    />{' '}
                    {opt.label}
                  </label>
                ))}
              </div>
            ))}
          </div>
          <button className="btn mt-16" onClick={submit} disabled={submitting}>
            {submitting ? '...' : 'Submit'}
          </button>
          {result && <div className="mt-16" style={{ color: 'var(--color-success)' }}>Score: {result.score ?? 'N/A'}</div>}
        </>
      )}
    </div>
  );
}
