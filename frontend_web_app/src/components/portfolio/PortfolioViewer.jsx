import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../state/AuthContext';

// PUBLIC_INTERFACE
export default function PortfolioViewer() {
  /** Portfolio viewer fetching from backend. */
  const { t } = useTranslation('common');
  const { api } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await api.getPortfolio();
        if (isMounted) setPortfolio(data);
      } catch (e) {
        if (isMounted) setErr(e?.response?.data?.detail || e.message || 'Failed to load portfolio');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [api]);

  return (
    <div className="card">
      <h3 className="m-0 mb-16">{t('pages.portfolio')}</h3>
      {loading && <div className="loading" role="status">Loading...</div>}
      {err && <div role="alert" style={{ color: 'var(--color-error)' }}>{err}</div>}
      {!loading && !err && (
        <>
          {!portfolio ? (
            <p className="empty">No portfolio yet.</p>
          ) : (
            <>
              <strong>{portfolio.title}</strong>
              <p className="text-muted">{portfolio.description}</p>
            </>
          )}
          <Link className="btn mt-16" to="/portfolio/edit">{portfolio ? 'Edit' : 'Create'}</Link>
        </>
      )}
    </div>
  );
}
