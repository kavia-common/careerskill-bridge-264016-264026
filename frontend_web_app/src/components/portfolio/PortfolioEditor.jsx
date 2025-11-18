import React, { useState } from 'react';
import { useAuth } from '../../state/AuthContext';

// PUBLIC_INTERFACE
export default function PortfolioEditor() {
  /** Portfolio editor creating or updating entries. */
  const { api } = useAuth();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const save = async () => {
    setSaving(true);
    setErr(null);
    setOk(null);
    try {
      await api.createPortfolio({ title, description: desc });
      setOk('Saved');
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h3 className="m-0 mb-16">Portfolio Editor</h3>
      <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="input mt-12" rows="5" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
      <button className="btn mt-16" onClick={save} disabled={saving}>{saving ? '...' : 'Save'}</button>
      {err && <div className="mt-12" role="alert" style={{ color: 'var(--color-error)' }}>{err}</div>}
      {ok && <div className="mt-12" style={{ color: 'var(--color-success)' }}>{ok}</div>}
    </div>
  );
}
