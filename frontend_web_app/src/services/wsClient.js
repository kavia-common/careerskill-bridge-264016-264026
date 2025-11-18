const LOG_LEVEL = (process.env.REACT_APP_LOG_LEVEL || 'info').toLowerCase();
const canLog = (level) => {
  const weights = { error: 0, warn: 1, info: 2, debug: 3 };
  return (weights[level] ?? 2) <= (weights[LOG_LEVEL] ?? 2);
};

const WS_BASE = process.env.REACT_APP_WS_URL || '';

/**
 * Lightweight WS client with subscribe/unsubscribe support and graceful fallback.
 * PUBLIC_INTERFACE
 * connectWS(callbacks)
 * @param {{onOpen?: Function, onMessage?: Function, onClose?: Function, onError?: Function}} callbacks
 * @returns {{send: Function, close: Function, subscribe: Function, unsubscribe: Function, connected: () => boolean}}
 */
export function connectWS(callbacks = {}) {
  const { onOpen, onMessage, onClose, onError } = callbacks;
  const token = localStorage.getItem('sb_token');

  if (!WS_BASE) {
    if (canLog('info')) console.info('[ws] REACT_APP_WS_URL not set, WS disabled.');
    // Return a no-op client
    return {
      send: () => {},
      close: () => {},
      subscribe: () => {},
      unsubscribe: () => {},
      connected: () => false,
    };
  }

  const url = token ? `${WS_BASE}?token=${encodeURIComponent(token)}` : WS_BASE;

  let ws;
  try {
    ws = new WebSocket(url);
  } catch (e) {
    if (canLog('warn')) console.warn('[ws] Failed to create WebSocket:', e?.message || e);
    return {
      send: () => {},
      close: () => {},
      subscribe: () => {},
      unsubscribe: () => {},
      connected: () => false,
    };
  }

  const listeners = new Map();

  ws.addEventListener('open', (e) => {
    if (canLog('info')) console.info('[ws] connected');
    onOpen && onOpen(e);
  });
  ws.addEventListener('message', (e) => {
    let payload;
    try {
      payload = JSON.parse(e.data);
    } catch {
      payload = e.data;
    }
    if (payload && payload.type && listeners.has(payload.type)) {
      listeners.get(payload.type).forEach((cb) => cb(payload));
    }
    onMessage && onMessage(payload);
  });
  ws.addEventListener('close', (e) => {
    if (canLog('info')) console.info('[ws] closed', e.code);
    onClose && onClose(e);
  });
  ws.addEventListener('error', (e) => {
    if (canLog('warn')) console.warn('[ws] error', e?.message || e);
    onError && onError(e);
  });

  function subscribe(channel, handler) {
    const set = listeners.get(channel) || new Set();
    set.add(handler);
    listeners.set(channel, set);
  }

  function unsubscribe(channel, handler) {
    const set = listeners.get(channel);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) listeners.delete(channel);
  }

  function send(data) {
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    ws.readyState === 1 && ws.send(payload);
  }

  function close() {
    try { ws.close(); } catch {}
  }

  function connected() {
    return ws && ws.readyState === 1;
  }

  return { send, close, subscribe, unsubscribe, connected };
}

export default connectWS;
