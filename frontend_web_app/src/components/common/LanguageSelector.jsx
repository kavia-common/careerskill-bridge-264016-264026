import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
export default function LanguageSelector() {
  /** Dropdown to switch languages. */
  const { i18n, t } = useTranslation('common');
  const id = useId();

  const changeLang = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <label className="text-muted" htmlFor={id} style={{ fontSize: 12 }}>
        {t('app.language')}
      </label>
      <select
        id={id}
        className="input"
        onChange={changeLang}
        value={i18n.language}
        style={{ width: 120 }}
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </div>
  );
}
