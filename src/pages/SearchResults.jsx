// src/pages/SearchResults.jsx
import React, { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import teaCatalog from "../shared/teaCatalogData";
import oilCatalog from "../shared/oilCatalogData";
import coffeeCatalog from "../shared/coffeeCatalogData";
import superfoodsCatalog from "../shared/superfoodsCatalogData";

import { getLocalizedPath } from "../utils/getLocalizedPath";
import { nameT, descT } from "../utils/i18nProductHelpers";

// --- helpers ---------------------------------------------------------------
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

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

// map category -> translation namespace
const nsFor = (c) =>
  c === "tea"
    ? "teas"
    : c === "oils"
    ? "oils"
    : c === "coffee"
    ? "coffee"
    : c === "superfoods"
    ? "superfoods"
    : "common";

export default function SearchResults() {
  const { t, i18n } = useTranslation([
    "search",
    "common",
    "teas",
    "oils",
    "coffee",
    "superfoods",
  ]);
  const lang = (i18n.language || "en").slice(0, 2);

  const q = useQuery();
  const query = (q.get("q") || "").trim();
  const cat = (q.get("cat") || "all").toLowerCase();

  const index = useMemo(
    () => [
      ...normalize(teaCatalog, "tea"),
      ...normalize(oilCatalog, "oils"),
      ...normalize(coffeeCatalog, "coffee"),
      ...normalize(superfoodsCatalog, "superfoods"),
    ],
    []
  );

  const results = useMemo(() => {
    const text = query.toLowerCase();
    const hay = (p) => `${p.name} ${p.description} ${p.slug}`.toLowerCase();
    return index
      .filter((p) => (cat === "all" ? true : p._cat === cat))
      .filter((p) => (text ? hay(p).includes(text) : true));
  }, [index, query, cat]);

  // ✅ FIX: use categories.* (matches your search.json)
  const catLabel = (c) =>
    t(`categories.${c}`, {
      ns: "search",
      defaultValue:
        c === "tea"
          ? "Teas"
          : c === "oils"
          ? "Oils"
          : c === "coffee"
          ? "Coffee"
          : c === "superfoods"
          ? "Superfoods"
          : "All",
    });

  const listingPath = (c) =>
    c === "tea"
      ? getLocalizedPath("tea", lang)
      : c === "oils"
      ? getLocalizedPath("oils", lang)
      : c === "coffee"
      ? getLocalizedPath("coffee", lang)
      : c === "superfoods"
      ? getLocalizedPath("superfoods", lang)
      : getLocalizedPath("products", lang);

  return (
    <main className="pt-32 px-4 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 dark:text-green-300">
          {query
            ? t("resultsFor", {
                ns: "search",
                q: query,
                defaultValue: `Results for “${query}”`,
              })
            : t("browseTitle", {
                ns: "search",
                defaultValue: "Browse products",
              })}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {cat === "all"
            ? t("showing.across", {
                ns: "search",
                count: results.length,
                defaultValue: `Showing ${results.length} items across Teas, Oils, Coffee, and Superfoods`,
              })
            : t("showing.inCat", {
                ns: "search",
                count: results.length,
                category: catLabel(cat),
                defaultValue: `Showing ${results.length} items in ${catLabel(
                  cat
                )}`,
              })}
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "tea", "oils", "coffee", "superfoods"].map((c) => {
          const base = getLocalizedPath("search", lang);
          const url = `${base}?q=${encodeURIComponent(query)}&cat=${c}`;
          const active = c === cat;
          return (
            <Link
              key={c}
              to={url}
              className={`px-3 py-1.5 text-sm rounded-full border ${
                active
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
              }`}
            >
              {catLabel(c)}
            </Link>
          );
        })}
      </div>

      {results.length === 0 ? (
        <div className="p-8 text-center border rounded-xl dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-300">
            {t("empty.noMatches", {
              ns: "search",
              defaultValue:
                "No matches found. Try different keywords or browse:",
            })}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <Link
              to={listingPath("tea")}
              className="px-3 py-2 rounded bg-emerald-600 text-white"
            >
              {t("btn.browseTeas", { ns: "search", defaultValue: "Browse Teas" })}
            </Link>
            <Link to={listingPath("oils")} className="px-3 py-2 rounded border">
              {t("btn.browseOils", { ns: "search", defaultValue: "Browse Oils" })}
            </Link>
            <Link to={listingPath("coffee")} className="px-3 py-2 rounded border">
              {t("btn.browseCoffee", { ns: "search", defaultValue: "Browse Coffee" })}
            </Link>
            <Link
              to={listingPath("superfoods")}
              className="px-3 py-2 rounded border"
            >
              {t("btn.browseSuperfoods", {
                ns: "search",
                defaultValue: "Browse Superfoods",
              })}
            </Link>
          </div>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((r) => (
            <article
              key={`${r._cat}-${r.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow p-4"
            >
              <img
                src={r.image || "/images/placeholder.jpg"}
                alt={r.name}
                className="w-full h-44 object-cover rounded-lg"
              />
              <div className="mt-3 flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold">
                  {nameT(t, nsFor(r._cat), r.id, r.name)}
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  {catLabel(r._cat)}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                {descT(t, nsFor(r._cat), r.id, r.description)}
              </p>
              <div className="mt-3">
                <Link
                  to={listingPath(r._cat)}
                  className="inline-block text-sm px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {t("btn.viewCat", {
                    ns: "search",
                    cat: catLabel(r._cat),
                    defaultValue: `View ${catLabel(r._cat)}`,
                  })}
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
