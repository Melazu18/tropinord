// src/contexts/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { API_BASE } from "../utils/api";

const AuthContext = createContext({
  user: null,
  loading: true,
  refreshUser: async (_opts) => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // prevent overlapping refreshes from writing stale data
  const reqIdRef = useRef(0);
  const abortRef = useRef(null);

  async function refreshUser(opts = { silent: false }) {
    const { silent = false } = opts;
    reqIdRef.current += 1;
    const myId = reqIdRef.current;

    if (!silent) setLoading(true);

    // cancel any in-flight /auth/me
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        credentials: "include",
        cache: "no-store",
        headers: {
          "Accept-Language": (localStorage.getItem("lang") || "en").slice(0, 2),
        },
        signal: controller.signal,
      });

      // only apply the result if this is the latest request
      if (myId !== reqIdRef.current) return null;

      if (res.status === 200) {
        const data = await res.json();
        const u = data?.user ?? null;
        setUser(u);
        return u;
      }

      // IMPORTANT: treat 401 as "logged out" (no redirects here)
      if (res.status === 401) {
        setUser(null);
        return null;
      }

      // any other error → consider unauthenticated
      setUser(null);
      return null;
    } catch (err) {
      if (!controller.signal.aborted) {
        // network or other error → consider unauthenticated
        setUser(null);
      }
      return null;
    } finally {
      if (myId === reqIdRef.current && !silent) setLoading(false);
    }
  }

  async function logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // no-op
    } finally {
      setUser(null);
    }
  }

  useEffect(() => {
    // initial hydrate
    refreshUser({ silent: false });

    // refresh when window regains focus (silent to avoid UI flicker)
    const onFocus = () => refreshUser({ silent: true });
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, refreshUser, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
