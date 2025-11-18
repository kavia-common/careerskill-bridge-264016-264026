import React from 'react';
import { useAuth } from '../../state/AuthContext';

// PUBLIC_INTERFACE
export default function Settings() {
  /** Placeholder settings screen showing feature flags. */
  const { features } = useAuth();
  return (
    <div className="card">
      <h3 className="m-0 mb-16">Settings</h3>
      <pre className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(features, null, 2)}
      </pre>
    </div>
  );
}
