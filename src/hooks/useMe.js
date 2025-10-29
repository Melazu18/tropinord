// src/hooks/useMe.js
import { useEffect, useRef, useState } from "react";
import { API_BASE } from "../utils/api";

export default function useMe() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasRunRef = useRef(false);
  const reqId = useRef(0);
  const abortRef = useRef(null);

  // NEW: simple in-flight guard to avoid starting multiple refreshes at once
  const refreshingRef = useRef(false);

  async function refresh({ silent = false } = {}) {
    // don’t stack refreshes
    if (refreshingRef.current) return;
    refreshingRef.current = true;

    reqId.current += 1;
    const myId = reqId.current;

    if (!silent) setLoading(true);

    // cancel previous request (if any)
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        credentials: "include",
        signal: controller.signal,
      });

      if (myId !== reqId.current) return; // a newer refresh started

      if (res.status === 401) {
        setMe(null);
        return;
      }
      if (!res.ok) {
        setMe(null);
        return;
      }

      const data = await res.json();
      setMe(data.user || null);
    } catch (e) {
      if (!controller.signal.aborted) setMe(null);
    } finally {
      if (myId === reqId.current) setLoading(false);
      refreshingRef.current = false;
    }
  }

  async function logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setMe(null);
    }
  }

  // Run once on mount (guarded against StrictMode double-invoke)
  useEffect(() => {
    if (import.meta.env.DEV) {
      if (hasRunRef.current) return;
      hasRunRef.current = true;
    }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ⚠️ REMOVED the window.focus listener here to avoid duplication with AuthContext
  // AuthContext already refreshes on focus, so we don’t need it twice.

  return { me, loading, refresh, logout };
}

// Named export too
export { useMe };
