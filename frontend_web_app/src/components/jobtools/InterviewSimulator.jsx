import React, { useState } from 'react';
import { useAuth } from '../../state/AuthContext';

// PUBLIC_INTERFACE
export default function InterviewSimulator() {
  /** Simple interview simulator calling /jobtools/interview/simulate. */
  const { api } = useAuth();
  const [role, setRole] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [resp, setResp] = useState(null);

  const run = async () => {
    setSaving(true);
    setErr(null);
    setResp(null);
    try {
      const data = await api.interviewSimulate({ role });
      setResp(data);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message || 'Failed to simulate');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h3 className="m-0 mb-16">Interview Simulator</h3>
      <input className="input" placeholder="Target role" value={role} onChange={(e) => setRole(e.target.value)} />
      <button className="btn mt-16" onClick={run} disabled={saving}>{saving ? '...' : 'Run'}</button>
      {err && <div className="mt-12" role="alert" style={{ color: 'var(--color-error)' }}>{err}</div>}
      {resp && <pre className="mt-12 text-muted" style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(resp, null, 2)}</pre>}
    </div>
  );
}
