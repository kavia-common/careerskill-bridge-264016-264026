import React from 'react';
import { useParams } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Booking() {
  /** Placeholder booking screen. */
  const { mentorId } = useParams();
  return (
    <div className="card">
      <h3 className="m-0 mb-16">Booking with Mentor #{mentorId}</h3>
      <p className="text-muted">Scheduling UI {`(placeholder)`}</p>
      <button className="btn mt-16">Confirm</button>
    </div>
  );
}
