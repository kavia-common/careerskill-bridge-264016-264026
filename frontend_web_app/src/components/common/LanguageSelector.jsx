import React from 'react';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function LanguageSelector() {
  /** Dropdown to switch languages. */
  const { i18n, t } = useTranslation('common');

  const changeLang = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span className="text-muted" style={{ fontSize: 12 }}>{t('app.language')}</span>
      <select className="input" onChange={changeLang} value={i18n.language} style={{ width: 120 }}>
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </label>
  );
}
