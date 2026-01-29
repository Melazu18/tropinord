// src/components/search/ProductSearch.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Leaf, Coffee, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";
import teaCatalog from "../../shared/teaCatalogData";
import oilCatalog from "../../shared/oilCatalogData";
import coffeeCatalog from "../../shared/coffeeCatalogData";
import superfoodsCatalog from "../../shared/superfoodsCatalogData";
import { getLocalizedPath } from "../../utils/getLocalizedPath";
import { Sprout } from "lucide-react";

const CATS = ["all", "tea", "oils", "coffee", "superfoods"];

function normalize(items, cat) {
  return Object.values(items || {}).map((p) => ({
    id: p.id,
    slug: p.slug || p.id,
    name: p.name,
    image: p.image,
    description: p.description || "",
    priceSEK: p.prices?.SEK ?? 0,
    _cat: cat,
  }));
}

export default function ProductSearch({ className = "" }) {
  const { t, i18n } = useTranslation(["search", "common"]);
  const lang = (i18n.language || "en").slice(0, 2);
  const nav = useNavigate();

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const boxRef = useRef(null);

  const catIcon = {
    all: <Search className="w-4 h-4" />,
    tea: <Leaf className="w-4 h-4" />,
    oils: <Flame className="w-4 h-4" />,
    coffee: <Coffee className="w-4 h-4" />,
    superfoods: <Sprout className="w-4 h-4" />,
  };

  const catLabel = (k) =>
    t(`categories.${k}`, {
      ns: "search",
      defaultValue:
        k === "tea"
          ? "Teas"
          : k === "oils"
          ? "Oils"
          : k === "coffee"
          ? "Coffee"
          : k === "superfoods"
          ? "Superfoods"
          : "All",
    });

  // merge allowed catalogs
  const index = useMemo(() => {
    return [
      ...normalize(teaCatalog, "tea"),
      ...normalize(oilCatalog, "oils"),
      ...normalize(coffeeCatalog, "coffee"),
      ...normalize(superfoodsCatalog, "superfoods"),
    ];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const hay = (p) => `${p.name} ${p.description} ${p.slug}`.toLowerCase();

    const filtered = index.filter((p) => {
      const catOk = cat === "all" ? true : p._cat === cat;
      if (!q) return catOk;
      return catOk && hay(p).includes(q);
    });

    const order = ["tea", "oils", "coffee", "superfoods"];
    const grouped = order.flatMap((k) => filtered.filter((p) => p._cat === k));
    return grouped.slice(0, 12);
  }, [index, query, cat]);

  // close on outside click/esc
  useEffect(() => {
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const goToResults = () => {
    const base = getLocalizedPath("search", lang);
    const params = new URLSearchParams({
      q: query.trim(),
      cat,
    }).toString();

    nav(`${base}?${params}`, { replace: false });
    setOpen(false);
  };

  const onKey = (e) => {
    if (!open && results.length) setOpen(true);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      goToResults();
    }
  };

  return (
    <section
      className={`relative z-[9999] px-3 sm:px-6 md:px-10 ${className}`}
      aria-label={t("aria.productSearch", {
        ns: "search",
        defaultValue: "Product search",
      })}
    >
      <div className="mx-auto max-w-5xl rounded-2xl shadow-lg border border-emerald-200/50 dark:border-emerald-800/50 overflow-visible">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(1000px_200px_at_50%_-20%,rgba(16,122,57,0.25),transparent)]" />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 sm:p-4 bg-white/75 dark:bg-slate-900/70 backdrop-blur">
            {/* “nature avatar” */}
            <div className="shrink-0 relative w-12 h-12 rounded-full overflow-hidden border border-emerald-400/50">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 via-amber-100 to-emerald-300 dark:from-emerald-900 dark:via-amber-900 dark:to-emerald-800 animate-[pulse_6s_ease-in-out_infinite]" />
              <Leaf className="absolute inset-0 m-auto w-6 h-6 text-emerald-700 dark:text-emerald-300" />
            </div>

            {/* category pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {CATS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setCat(k);
                    setOpen(true);
                    setHighlight(0);

                    // keep original intent: if user already typed, clicking category performs search
                    if (query.trim()) goToResults();
                  }}
                  className={`text-xs sm:text-sm px-3 py-1.5 rounded-full border transition ${
                    cat === k
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300/70 dark:border-slate-700"
                  }`}
                  aria-pressed={cat === k}
                >
                  <span className="inline-flex items-center gap-1">
                    {catIcon[k]}
                    {catLabel(k)}
                  </span>
                </button>
              ))}
            </div>

            {/* input */}
            <div className="flex-1 relative">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 px-3 py-2">
                <Search className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
                <input
                  type="search"
                  value={query}
                  onFocus={() => setOpen(true)}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setHighlight(0);
                  }}
                  onKeyDown={onKey}
                  placeholder={t("placeholder", {
                    ns: "search",
                    defaultValue:
                      "Type to search teas, oils, coffee, superfoods…",
                  })}
                  className="w-full bg-transparent outline-none text-sm sm:text-base"
                  aria-label={t("aria.searchProducts", {
                    ns: "search",
                    defaultValue: "Search products",
                  })}
                />
              </div>

              {/* results */}
              {open && (query || cat !== "all") && (
                <div
                  ref={boxRef}
                  className="absolute mt-2 w-full rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden max-h-[70vh] overflow-y-auto"
                  role="listbox"
                >
                  {results.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
                      {t("empty.noMatches", {
                        ns: "search",
                        defaultValue:
                          "No matches found. Try different keywords or browse:",
                      })}
                    </div>
                  ) : (
                    results.map((r, i) => (
                      <button
                        key={`${r._cat}-${r.id}`}
                        type="button"
                        onMouseEnter={() => setHighlight(i)}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => goToResults()}
                        role="option"
                        aria-selected={i === highlight}
                        className={`w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 ${
                          i === highlight
                            ? "bg-emerald-50 dark:bg-emerald-900/30"
                            : ""
                        }`}
                      >
                        <img
                          src={r.image || "/images/placeholder.jpg"}
                          alt=""
                          className="w-10 h-10 rounded object-cover border border-slate-200 dark:border-slate-700"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {r.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {r._cat.toUpperCase()} • {r.description}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
