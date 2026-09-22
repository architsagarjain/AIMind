'use client';

import { useCallback } from 'react';

const VISITOR_KEY = 'archit-ai:visitor';

function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    // Private mode / blocked storage — telemetry is optional, carry on.
    return '';
  }
}

/**
 * Fire-and-forget event reporting. Silently no-ops when the backend is
 * unconfigured; never blocks or surfaces an error to the user.
 */
export function useTelemetry() {
  return useCallback((name: string, payload?: Record<string, unknown>) => {
    const body = JSON.stringify({ name, payload, visitorId: getVisitorId() });

    // sendBeacon survives page transitions; fetch is the fallback.
    if (navigator.sendBeacon?.(`/api/telemetry`, new Blob([body], { type: 'application/json' }))) {
      return;
    }

    void fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => undefined);
  }, []);
}

export { getVisitorId };
