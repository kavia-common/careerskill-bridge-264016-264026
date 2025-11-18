const WS_URL = process.env.REACT_APP_WS_URL || '';

/**
 * Lightweight WS client with subscribe/unsubscribe support.
 * PUBLIC_INTERFACE
 * connectWS(callbacks)
 * @param {{onOpen?: Function, onMessage?: Function, onClose?: Function, onError?: Function}} callbacks
 * @returns {{send: Function, close: Function, subscribe: Function, unsubscribe: Function}}
 */
export function connectWS(callbacks = {}) {
  const { onOpen, onMessage, onClose, onError } = callbacks;
  const token = localStorage.getItem('sb_token');
  const url = token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL;

  const ws = new WebSocket(url);
  const listeners = new Map();

  ws.addEventListener('open', (e) => onOpen && onOpen(e));
  ws.addEventListener('message', (e) => {
    let payload;
    try {
      payload = JSON.parse(e.data);
    } catch {
      payload = e.data;
    }
    // Broadcast to channel-specific listeners if type/channel exists
    if (payload && payload.type && listeners.has(payload.type)) {
      listeners.get(payload.type).forEach((cb) => cb(payload));
    }
    onMessage && onMessage(payload);
  });
  ws.addEventListener('close', (e) => onClose && onClose(e));
  ws.addEventListener('error', (e) => onError && onError(e));

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
    ws.close();
  }

  return { send, close, subscribe, unsubscribe };
}

export default connectWS;
