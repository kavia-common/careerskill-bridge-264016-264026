import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function MentorList() {
  /** Placeholder mentor list. */
  const { t } = useTranslation('common');
  const mentors = [
    { id: 'm1', name: 'Alex Rivera' },
    { id: 'm2', name: 'Jordan Lee' }
  ];
  return (
    <div>
      <h2 className="m-0 mb-16">{t('pages.mentorship')}</h2>
      <div className="grid-2">
        {mentors.map((m) => (
          <div key={m.id} className="card">
            <h3 className="m-0">{m.name}</h3>
            <div className="mt-12">
              <Link className="btn" to={`/mentorship/${m.id}`}>View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
