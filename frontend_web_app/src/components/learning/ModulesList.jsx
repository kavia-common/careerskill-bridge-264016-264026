import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function ModulesList() {
  /** Placeholder list of modules. */
  const { t } = useTranslation('common');
  const modules = [
    { id: '101', title: 'Intro to Data Analytics' },
    { id: '102', title: 'Digital Marketing Basics' }
  ];

  return (
    <div>
      <h2 className="m-0 mb-16">{t('pages.modules')}</h2>
      <div className="grid-2">
        {modules.map((m) => (
          <div key={m.id} className="card">
            <h3 className="m-0">{m.title}</h3>
            <div className="mt-12">
              <Link className="btn" to={`/modules/${m.id}`}>Open</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
