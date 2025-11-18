import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../state/AuthContext';

// PUBLIC_INTERFACE
export default function ProgressWidget() {
  /** Fetches and displays user progress from backend. */
  const { t } = useTranslation('common');
  const { api } = useAuth();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await api.getProgress();
        const pct = Number(data?.percent || data?.completion || 0);
        if (isMounted) setProgress(Math.max(0, Math.min(100, Math.round(pct))));
      } catch (e) {
        if (isMounted) setErr(e?.response?.data?.detail || e.message || 'Failed to load progress');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [api]);

  return (
    <div className="card">
      <h3 className="m-0 mb-16">{t('pages.progress')}</h3>
      {loading && <div className="loading" role="status">Loading...</div>}
      {err && <div role="alert" style={{ color: 'var(--color-error)' }}>{err}</div>}
      {!loading && !err && (
        <>
          <div className="text-muted">{progress}%</div>
          <div style={{ height: 8, background: '#e5e7eb', borderRadius: 8, marginTop: 8 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--color-success)', borderRadius: 8 }} />
          </div>
        </>
      )}
    </div>
  );
}
