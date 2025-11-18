import React from 'react';

// PUBLIC_INTERFACE
export default function PortfolioEditor() {
  /** Placeholder portfolio editor. */
  return (
    <div className="card">
      <h3 className="m-0 mb-16">Portfolio Editor</h3>
      <input className="input" placeholder="Title" />
      <textarea className="input mt-12" rows="5" placeholder="Description" />
      <button className="btn mt-16">Save</button>
    </div>
  );
}
