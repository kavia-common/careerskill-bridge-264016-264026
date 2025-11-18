import React, { useState } from 'react';
import { useAuth } from '../../state/AuthContext';

// PUBLIC_INTERFACE
export default function ResumeBuilder() {
  /** Resume preview calling /jobtools/resume/preview. */
  const { api } = useAuth();
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [preview, setPreview] = useState(null);

  const build = async () => {
    setSaving(true);
    setErr(null);
    setPreview(null);
    try {
      const data = await api.resumePreview({ content: `Name: ${name}\n\nSummary: ${summary}`.trim() });
      setPreview(data);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message || 'Failed to generate preview');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h3 className="m-0 mb-16">Resume Builder</h3>
      <input className="input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea className="input mt-12" rows="3" placeholder="Professional summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
      <button className="btn mt-16" onClick={build} disabled={saving}>{saving ? '...' : 'Preview'}</button>
      {err && <div className="mt-12" role="alert" style={{ color: 'var(--color-error)' }}>{err}</div>}
      {preview && <pre className="mt-12 text-muted" style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(preview, null, 2)}</pre>}
    </div>
  );
}
