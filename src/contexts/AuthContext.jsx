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
  refreshUser: async (_opts) => null,
  login: async (_email, _password) => ({ ok: false }),
  logout: async () => {},
});

function toApiUrl(pathOrUrl) {
  // If it's already absolute (http/https), keep it.
  if (/^https?:\/\//i.test(String(pathOrUrl))) return String(pathOrUrl);

  // If someone passes "/api/..." or "api/..." we normalize to API_BASE
  const p = String(pathOrUrl || "").trim();
  const noLeading = p.replace(/^\/+/, ""); // remove leading /
  const noApiPrefix = noLeading.replace(/^api\/+/i, ""); // remove leading "api/"

  // API_BASE already ends with "/api" (per your utils/api.js)
  return `${API_BASE}/${noApiPrefix}`;
}

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

    // cancel any in-flight /me
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const url = toApiUrl("/auth/me");

      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
        headers: {
          "Accept-Language": (localStorage.getItem("lang") || "en").slice(0, 2),
        },
        signal: controller.signal,
      });

      // only apply result if latest request
      if (myId !== reqIdRef.current) return null;

      if (res.status === 200) {
        const data = await res.json().catch(() => ({}));
        const u = data?.user ?? null;
        setUser(u);
        return u;
      }

      // 401 = not logged in
      if (res.status === 401) {
        setUser(null);
        return null;
      }

      // any other status → treat as logged out
      setUser(null);
      return null;
    } catch (err) {
      if (!controller.signal.aborted) setUser(null);
      return null;
    } finally {
      if (myId === reqIdRef.current && !silent) setLoading(false);
    }
  }

  async function login(email, password) {
    setLoading(true);
    try {
      const url = toApiUrl("/auth/login");

      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": (localStorage.getItem("lang") || "en").slice(0, 2),
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUser(null);
        return {
          ok: false,
          error: data?.error || `login_failed_${res.status}`,
        };
      }

      // After login cookie is set, hydrate user
      const u = data?.user ?? (await refreshUser({ silent: true }));
      setUser(u ?? null);

      return { ok: true, user: u ?? null };
    } catch (e) {
      setUser(null);
      return { ok: false, error: "network_error" };
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      const url = toApiUrl("/auth/logout");
      await fetch(url, { method: "POST", credentials: "include" });
    } catch {
      // no-op
    } finally {
      setUser(null);
    }
  }

  useEffect(() => {
    // initial hydrate
    refreshUser({ silent: false });

    // refresh on focus (silent = no UI flicker)
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
      value={{ user, loading, refreshUser, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
