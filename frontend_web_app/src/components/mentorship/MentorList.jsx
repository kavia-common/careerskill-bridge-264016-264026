import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../state/AuthContext';

// PUBLIC_INTERFACE
export default function MentorList() {
  /** Mentor list from backend. */
  const { t } = useTranslation('common');
  const { api } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await api.listMentors();
        if (isMounted) setMentors(Array.isArray(data) ? data : (data?.items || []));
      } catch (e) {
        if (isMounted) setErr(e?.response?.data?.detail || e.message || 'Failed to load mentors');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [api]);

  return (
    <div>
      <h2 className="m-0 mb-16">{t('pages.mentorship')}</h2>
      {loading && <div className="loading" role="status">Loading...</div>}
      {err && <div role="alert" style={{ color: 'var(--color-error)' }}>{err}</div>}
      {!loading && !err && (
        <div className="grid-2">
          {mentors.length === 0 && <div className="empty">No mentors available.</div>}
          {mentors.map((m) => (
            <div key={m.id || m.mentor_id} className="card">
              <h3 className="m-0">{m.full_name || m.name || `Mentor ${m.id || m.mentor_id}`}</h3>
              <div className="mt-12">
                <Link className="btn" to={`/mentorship/${encodeURIComponent(m.id || m.mentor_id)}`}>View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
