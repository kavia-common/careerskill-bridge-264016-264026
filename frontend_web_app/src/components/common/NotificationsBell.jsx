import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import connectWS from '../../services/wsClient';
import { useAuth } from '../../state/AuthContext';

// PUBLIC_INTERFACE
export default function NotificationsBell() {
  /** Bell showing number of unread notifications. Uses REST and WS (if configured). */
  const { t } = useTranslation('common');
  const { api, token } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await api.listNotifications();
        const items = Array.isArray(data) ? data : (data?.items || []);
        if (isMounted) setCount(items.filter((n) => !n.read).length);
      } catch {
        // ignore errors to avoid noisy UI
      }
    }
    if (token) load();
    return () => { isMounted = false; };
  }, [api, token]);

  useEffect(() => {
    if (!token) return;
    const ws = connectWS({
      onMessage: (payload) => {
        if (payload?.type === 'notification') {
          setCount((c) => c + 1);
        }
      },
    });
    return () => {
      ws?.close?.();
    };
  }, [token]);

  return (
    <button className="btn secondary" aria-label={t('app.notifications')} title={t('app.notifications')}>
      🔔 {count > 0 ? `(${count})` : ''}
    </button>
  );
}
