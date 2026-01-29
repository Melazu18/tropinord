import { useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { routeMap } from "./routeMap";

const SUPPORTED = ["en", "sv", "fr", "es"];

function getLangFromPath(pathname) {
  const seg = (pathname.split("/")[1] || "").toLowerCase().slice(0, 2);
  return SUPPORTED.includes(seg) ? seg : null;
}

function getLangFromStorage() {
  const raw = (localStorage.getItem("lang") || "en").toLowerCase().slice(0, 2);
  return SUPPORTED.includes(raw) ? raw : "en";
}

const RouteRedirector = ({ to }) => {
  const { maybeRouteKey, ...restParams } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Prefer URL lang; fall back to localStorage
  const lang = getLangFromPath(location.pathname) || getLangFromStorage();

  const paramsKey = useMemo(() => JSON.stringify(restParams), [restParams]);

  const targetPath = useMemo(() => {
    const { pathname, search, hash } = location;
    const current = pathname;
    const appendSH = (p) => `${p}${search || ""}${hash || ""}`;

    // Explicit redirect target (string template with :params)
    if (to) {
      let finalPath = to;
      const params = paramsKey ? JSON.parse(paramsKey) : {};
      for (const [key, value] of Object.entries(params)) {
        finalPath = finalPath.replace(`:${key}`, value);
      }
      finalPath = finalPath.replace(/\/{2,}/g, "/");
      return finalPath !== current ? appendSH(finalPath) : null;
    }

    // Try routeMap direct match for current language (supports nested slugs)
    const matchedKey = Object.keys(routeMap).find((key) => {
      const slug = routeMap?.[key]?.[lang];
      if (!slug) return false;
      const normalized = String(slug).replace(/^\/+/, "");
      return normalized === maybeRouteKey;
    });

    if (matchedKey) {
      const dest = `/${lang}/${routeMap[matchedKey][lang]}`;
      return dest !== current ? appendSH(dest) : null;
    }

    // Keep tail when possible (legacy blog/blogg only)
    const tail = current.replace(
      new RegExp(`^/${lang}/${maybeRouteKey}/?`),
      ""
    );

    if (lang === "sv" && maybeRouteKey === "blog") {
      const dest = `/${lang}/blogg/${tail}`;
      return dest !== current ? appendSH(dest) : null;
    }
    if (lang === "en" && maybeRouteKey === "blogg") {
      const dest = `/${lang}/blog/${tail}`;
      return dest !== current ? appendSH(dest) : null;
    }

    return null;
  }, [
    location.pathname,
    location.search,
    location.hash,
    to,
    paramsKey,
    maybeRouteKey,
    lang,
  ]);

  const lastNavRef = useRef("");
  useEffect(() => {
    if (!targetPath) return;
    const currentFull = `${location.pathname}${location.search}${location.hash}`;
    if (currentFull === targetPath || lastNavRef.current === targetPath) return;
    lastNavRef.current = targetPath;
    navigate(targetPath, { replace: true });
  }, [targetPath, navigate, location.pathname, location.search, location.hash]);

  return null;
};

export default RouteRedirector;
