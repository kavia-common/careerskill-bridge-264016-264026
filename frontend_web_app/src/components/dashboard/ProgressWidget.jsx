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
        // Backend returns an array of ProgressOut { progress_percent, ... }
        let pct = 0;
        if (Array.isArray(data) && data.length > 0) {
          const avg =
            data.reduce((sum, item) => sum + (Number(item?.progress_percent || 0)), 0) / data.length;
          pct = avg;
        } else if (typeof data === 'number') {
          pct = data;
        }
        if (isMounted) setProgress(Math.max(0, Math.min(100, Math.round(Number(pct) || 0))));
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
