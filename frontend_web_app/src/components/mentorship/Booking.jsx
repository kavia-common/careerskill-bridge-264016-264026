import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';

/**
 * PUBLIC_INTERFACE
 */
export default function Booking() {
  /**
   * Booking screen creating a mentorship request to the backend.
   * Uses POST /mentorship/requests with minimal payload (mentor_id, note).
   * Provides basic loading/error/success feedback with no extra dependencies.
   */
  const { mentorId } = useParams();
  const { api } = useAuth();

  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const submit = async () => {
    setSubmitting(true);
    setErr(null);
    setOk(null);
    try {
      await api.requestMentorship({ mentor_id: Number(mentorId), message: note });
      setOk('Request sent!');
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h3 className="m-0 mb-16">Booking with Mentor #{mentorId}</h3>
      <textarea
        className="input"
        rows="4"
        placeholder="Share your goals or availability"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button className="btn mt-16" onClick={submit} disabled={submitting}>
        {submitting ? '...' : 'Confirm'}
      </button>
      {err && (
        <div className="mt-12" role="alert" style={{ color: 'var(--color-error)' }}>
          {err}
        </div>
      )}
      {ok && <div className="mt-12" style={{ color: 'var(--color-success)' }}>{ok}</div>}
    </div>
  );
}
