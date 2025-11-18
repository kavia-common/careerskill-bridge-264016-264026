import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../state/AuthContext';

// PUBLIC_INTERFACE
export default function ModulesList() {
  /** Load modules from backend and render cards. */
  const { t } = useTranslation('common');
  const { api } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await api.listModules();
        if (isMounted) setModules(Array.isArray(data) ? data : (data?.items || []));
      } catch (e) {
        if (isMounted) setErr(e?.response?.data?.detail || e.message || 'Failed to load modules');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [api]);

  return (
    <div>
      <h2 className="m-0 mb-16">{t('pages.modules')}</h2>
      {loading && <div className="loading" role="status">Loading...</div>}
      {err && <div role="alert" style={{ color: 'var(--color-error)' }}>{err}</div>}
      {!loading && !err && (
        <div className="grid-2">
          {modules.length === 0 && <div className="empty">No modules found.</div>}
          {modules.map((m) => (
            <div key={m.id || m.module_id} className="card">
              <h3 className="m-0">{m.title || m.name || `Module ${m.id || m.module_id}`}</h3>
              <div className="mt-12">
                <Link className="btn" to={`/modules/${encodeURIComponent(m.id || m.module_id)}`}>Open</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
