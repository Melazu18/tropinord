// src/routes/RouteRedirector.jsx
import { useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { routeMap } from "./routeMap";

const RouteRedirector = ({ to }) => {
  const { maybeRouteKey, ...restParams } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const langRaw = localStorage.getItem("lang") || "en";
  const lang = /^sv/i.test(langRaw) ? "sv" : "en";

  const paramsKey = useMemo(() => JSON.stringify(restParams), [restParams]);

  const targetPath = useMemo(() => {
    const { pathname, search, hash } = location;
    const current = pathname;
    const appendSH = (p) => `${p}${search || ""}${hash || ""}`;

    if (to) {
      let finalPath = to;
      const params = paramsKey ? JSON.parse(paramsKey) : {};
      for (const [key, value] of Object.entries(params)) {
        finalPath = finalPath.replace(`:${key}`, value);
      }
      finalPath = finalPath.replace(/\/{2,}/g, "/");
      return finalPath !== current ? appendSH(finalPath) : null;
    }

    const matchedKey = Object.keys(routeMap).find(
      (key) => routeMap[key][lang] === maybeRouteKey
    );
    if (matchedKey) {
      const dest = `/${lang}/${routeMap[matchedKey][lang]}`;
      return dest !== current ? appendSH(dest) : null;
    }

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

    // FIX: Don't redirect to /404, just return null to stay on current page
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
