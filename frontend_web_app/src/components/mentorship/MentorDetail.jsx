import React from 'react';
import { Link, useParams } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function MentorDetail() {
  /** Placeholder mentor detail with booking link. */
  const { mentorId } = useParams();
  return (
    <div className="card">
      <h3 className="m-0 mb-16">Mentor #{mentorId}</h3>
      <p className="text-muted">Experienced professional. {`(placeholder)`}</p>
      <Link className="btn mt-16" to={`/mentorship/${mentorId}/booking`}>Book Session</Link>
    </div>
  );
}
