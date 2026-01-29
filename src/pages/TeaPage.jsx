// src/pages/TeaPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import teaCatalogData from "@shared/teaCatalogData";
import { CurrencySelect } from "../shared/ui/CurrencyProvider";
import FilterControls from "../shared/ui/FilterControls";
import PaginationBar from "../shared/ui/PaginationBar";
import { IconBadge, LeafIcon, CupIcon, ShieldIcon } from "../shared/ui/Badge";
import { nameT, descT } from "../utils/i18nProductHelpers";
import PriceTag from "../components/PriceTag";
import ProductImageCarousel from "../components/ProductImageCarousel";
import CloseButton from "../components/CloseButton";
import LikeButton from "../components/LikeButton";
import ProductReviews from "../components/ProductReviews";

// ---------- helpers ----------
const kw = {
  minty: ["mint", "peppermint", "spearmint", "mentha"],
  fruity: ["hibiscus", "apple", "berry", "rosehip", "lemon", "citrus", "peach"],
  floral: ["jasmine", "chamomile", "peony", "floral"],
  earthy: ["nettle", "rooibos", "pu erh", "pu-erh"],
};

const inferProfile = (t) => {
  const hay = `${t.name} ${t.description} ${(t.ingredients || []).join(
    ", "
  )}`.toLowerCase();
  if (kw.minty.some((k) => hay.includes(k))) return "minty";
  if (kw.fruity.some((k) => hay.includes(k))) return "fruity";
  if (kw.floral.some((k) => hay.includes(k))) return "floral";
  if (kw.earthy.some((k) => hay.includes(k))) return "earthy";
  return "neutral";
};

const isOrganic = (t) =>
  /organic|ekologisk/i.test(t.name || "") ||
  /organic|ekologisk/i.test(t.description || "");

const caffeineState = (t) => {
  const c = (t.category || "").toLowerCase();
  if (c === "herbal") return "free";
  if (["green", "black", "white", "oolong"].includes(c)) return "caffeinated";
  return "any";
};

// ---------- tiny inline icons ----------
const IconSpoon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M8.5 2C6.6 2 5 3.6 5 5.5S6.6 9 8.5 9 12 7.4 12 5.5 10.4 2 8.5 2zm10.7 7.3a1 1 0 0 0-1.4 0L9.7 17.4a3 3 0 0 0-.9 2.1V21a1 1 0 0 0 1 1h1.5a3 3 0 0 0 2.1-.9l7.8-7.8a1 1 0 0 0 0-1.4l-2-2z"
    />
  </svg>
);

const IconClock = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 11h-5a1 1 0 0 1 0-2h4V6a1 1 0 0 1 2 0v6a1 1 0 0 1-1 1z"
    />
  </svg>
);

const IconThermo = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0zM12 22a3 3 0 0 1-1-5.83V5a1 1 0 0 1 2 0v11.17A3 3 0 0 1 12 22z"
    />
  </svg>
);

// ---------- formatting ----------
const isImperialLocale = (lang = "") => /^en-US/i.test(lang);
const cToF = (c) => (c * 9) / 5 + 32;
const mlToFlOz = (ml) => ml / 29.5735295625;

const formatNumber = (n, { maxDecimals = 1 } = {}) => {
  const factor = Math.pow(10, maxDecimals);
  return Math.round(n * factor) / factor;
};

const formatDosage = (t, i18n, d) => {
  if (!d) return null;
  const imperial = isImperialLocale(i18n?.language || "en");
  if (!imperial) {
    return t("brew.dosageMetric", {
      amount: d.amount,
      unit: d.unit,
      volume: d.volumeMl,
      defaultValue: "{{amount}} {{unit}} (per {{volume}} ml)",
    });
  }
  const flOz = formatNumber(mlToFlOz(d.volumeMl), { maxDecimals: 1 });
  return t("brew.dosageImperial", {
    amount: d.amount,
    unit: d.unit,
    volume: flOz,
    defaultValue: "{{amount}} {{unit}} (per {{volume}} fl oz)",
  });
};

const formatBrewingTime = (t, bt) => {
  if (!bt) return null;
  if (bt.min && bt.max) {
    return t("brew.timeRange", {
      min: bt.min,
      max: bt.max,
      unit: bt.unit,
      defaultValue: "{{min}}–{{max}} {{unit}}",
    });
  }
  return t("brew.timeSingle", {
    value: bt.min,
    unit: bt.unit,
    defaultValue: "{{value}} {{unit}}",
  });
};

const formatTemperature = (t, i18n, temp) => {
  if (!temp) return null;
  const imperial = isImperialLocale(i18n?.language || "en");
  if (!imperial) {
    return t("brew.temperatureC", {
      value: temp.value,
      defaultValue: "{{value}}°C",
    });
  }
  const f = formatNumber(cToF(temp.value), { maxDecimals: 0 });
  return t("brew.temperatureF", { value: f, defaultValue: "{{value}}°F" });
};

const getSafetyKey = (tea) => {
  const type = tea?.safetyNotice?.type;
  if (!type) return null;
  return `safety.${type}`;
};

const getTeaDetailPath = (lang2, slug) => {
  if (lang2 === "sv") return `/sv/produktdetalj/${slug}`;
  if (lang2 === "fr") return `/fr/detail-produit/${slug}`;
  if (lang2 === "es") return `/es/detalle-producto/${slug}`;
  return `/en/detail-product/${slug}`;
};

const BrewSpec = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2 text-xs text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-gray-500 dark:text-gray-500">{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <span className="font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
        {value}
      </span>
    </div>
  );
};

export default function TeaPage() {
  const { t, i18n } = useTranslation(["teas", "buttons", "common"]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [catalog, setCatalog] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTea, setSelectedTea] = useState(null);
  const [quantities, setQuantities] = useState({});

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCaffeine, setFilterCaffeine] = useState("any");
  const [filterProfile, setFilterProfile] = useState("any");

  // ✅ NEW: search + scan
  const [search, setSearch] = useState("");
  const [scanValue, setScanValue] = useState("");

  const [page, setPage] = useState(1);
  const [toastMsg, setToastMsg] = useState("");

  const PAGE_SIZE = 9;
  const lang2 = (i18n.language || "en").slice(0, 2);

  useEffect(() => {
    try {
      setCatalog(teaCatalogData || {});
    } catch (e) {
      console.error(e);
      setError("Failed to load tea catalog");
    } finally {
      setLoading(false);
    }
  }, []);

  const teas = useMemo(() => {
    return Object.entries(catalog).map(([id, tea]) => ({
      id,
      ...tea,
      _meta: {
        profile: inferProfile(tea),
        organic: isOrganic(tea),
        caffeine: caffeineState(tea),
      },
    }));
  }, [catalog]);

  // ✅ NEW: search matcher includes productCode + id + slug + name + desc + ingredients
  const matchesSearch = (tea, qRaw) => {
    const q = (qRaw || "").trim().toLowerCase();
    if (!q) return true;

    const ingredients = Array.isArray(tea.ingredients)
      ? tea.ingredients.join(", ")
      : tea.ingredients || "";

    const hay = [
      tea.productCode,
      tea.id,
      tea.slug,
      tea.i18nKey,
      tea.name,
      tea.description,
      ingredients,
      (tea.flavour || []).join(", "),
      tea.flavouring,
      tea.originCountry,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return hay.includes(q);
  };

  const filtered = useMemo(() => {
    return teas.filter((ti) => {
      const catOk =
        filterCategory === "all" || (ti.category || "") === filterCategory;
      const cafOk =
        filterCaffeine === "any" || ti._meta.caffeine === filterCaffeine;
      const proOk =
        filterProfile === "any" || ti._meta.profile === filterProfile;
      const searchOk = matchesSearch(ti, search);
      return catOk && cafOk && proOk && searchOk;
    });
  }, [teas, filterCategory, filterCaffeine, filterProfile, search]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search, filterCategory, filterCaffeine, filterProfile]);

  if (loading)
    return (
      <div className="p-10">
        {t("loading", { ns: "common", defaultValue: "Loading..." })}
      </div>
    );
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  const add = (tea) => {
    const quantity = quantities[tea.id] || 1;
    const basePrice = tea.prices?.SEK ?? tea.price ?? 0;

    const key = tea.i18nKey || tea.slug || tea.id;
    const displayName = nameT(t, "teas", key, tea.name);

    addToCart({
      id: tea.id,
      label: displayName,
      image: tea.image,
      price: basePrice,
      quantity,
    });

    setToastMsg(
      t("addedToCart", {
        defaultValue: "{{name}} added to cart!",
        name: displayName,
      })
    );
    setTimeout(() => setToastMsg(""), 2000);
  };

  // ✅ NEW: scanner input handler (QR scanners often type then press Enter)
  const handleScanSubmit = (e) => {
    e.preventDefault();
    const code = (scanValue || "").trim();
    if (!code) return;

    const found =
      teas.find(
        (x) => (x.productCode || "").toLowerCase() === code.toLowerCase()
      ) ||
      teas.find((x) => (x.id || "").toLowerCase() === code.toLowerCase()) ||
      teas.find((x) => (x.slug || "").toLowerCase() === code.toLowerCase());

    if (!found) {
      setToastMsg(
        t("scan.notFound", {
          defaultValue: "No product found for code: {{code}}",
          code,
        })
      );
      setTimeout(() => setToastMsg(""), 2500);
      return;
    }

    // Open quick view by default (fast for staff + customers)
    setSelectedTea(found);

    // If you prefer navigation instead, replace above with:
    // navigate(getTeaDetailPath(lang2, found.slug || found.id));

    setScanValue("");
  };

  const categories = [
    { value: "all", label: t("categories.all", { defaultValue: "All" }) },
    {
      value: "herbal",
      label: t("categories.herbal", { defaultValue: "Herbal" }),
    },
    { value: "green", label: t("categories.green", { defaultValue: "Green" }) },
    { value: "black", label: t("categories.black", { defaultValue: "Black" }) },
    { value: "white", label: t("categories.white", { defaultValue: "White" }) },
  ];

  const caffeineOptions = [
    { value: "any", label: t("filters.caffeine.any", { defaultValue: "Any" }) },
    {
      value: "free",
      label: t("filters.caffeine.free", { defaultValue: "Caffeine-Free" }),
    },
    {
      value: "caffeinated",
      label: t("filters.caffeine.caffeinated", { defaultValue: "Caffeinated" }),
    },
  ];

  const profileOptions = [
    { value: "any", label: t("filters.profile.any", { defaultValue: "Any" }) },
    { value: "minty", label: t("profiles.minty", { defaultValue: "Minty" }) },
    {
      value: "fruity",
      label: t("profiles.fruity", { defaultValue: "Fruity" }),
    },
    {
      value: "floral",
      label: t("profiles.floral", { defaultValue: "Floral" }),
    },
    {
      value: "earthy",
      label: t("profiles.earthy", { defaultValue: "Earthy" }),
    },
  ];

  return (
    <main className="pt-32 px-4 py-8 max-w-6xl mx-auto [color-scheme:light] dark:[color-scheme:dark]">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">
          {t("title", { defaultValue: "TropiNord Tea Collection" })}
        </h1>
        <CurrencySelect />
      </div>

      <p className="text-slate-600 dark:text-slate-400 mb-6">
        {t("subtitle", {
          defaultValue:
            "Explore our selection of black, green, fruit and herbal blends sourced from trusted growers and refined with care. Every doypack includes loose tea and eco-friendly teabags so you can craft your own perfect brew at home. Premium blends. Personal preparation. Pure experience.",
        })}
      </p>

      {toastMsg && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-3 py-2 text-sm rounded mb-4">
          {toastMsg}
        </div>
      )}

      {/* ✅ NEW: Search + Scan row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
            {t("search.label", { defaultValue: "Search" })}
          </label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search.placeholder", {
              defaultValue: "Search by name, ingredient, or product code…",
            })}
            className="w-full h-11 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-gray-800"
          />
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t("search.hint", {
              defaultValue:
                "Tip: search also matches product code (e.g. TN-TEA-…).",
            })}
          </div>
        </div>

        <form onSubmit={handleScanSubmit}>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
            {t("scan.label", { defaultValue: "Scan / Enter product code" })}
          </label>
          <div className="flex items-center gap-2">
            <input
              value={scanValue}
              onChange={(e) => setScanValue(e.target.value)}
              placeholder={t("scan.placeholder", {
                defaultValue: "TN-TEA-… (press Enter)",
              })}
              className="flex-1 h-11 px-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-gray-800"
            />
            <button
              type="submit"
              className="h-11 px-4 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
            >
              {t("scan.open", { defaultValue: "Open" })}
            </button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t("scan.hint", {
              defaultValue:
                "Works with QR scanners that type codes as keyboard input.",
            })}
          </div>
        </form>
      </div>

      <FilterControls
        items={[
          {
            key: "cat",
            label: t("filters.category", { defaultValue: "Category" }),
            value: filterCategory,
            onChange: (v) => setFilterCategory(v),
            options: categories,
          },
          {
            key: "caf",
            label: t("filters.caffeine.label", { defaultValue: "Caffeine" }),
            value: filterCaffeine,
            onChange: (v) => setFilterCaffeine(v),
            options: caffeineOptions,
          },
          {
            key: "pro",
            label: t("filters.profile.label", { defaultValue: "Flavor" }),
            value: filterProfile,
            onChange: (v) => setFilterProfile(v),
            options: profileOptions,
          },
        ]}
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageItems.map((tea) => {
          const basePrice = tea.prices?.SEK ?? tea.price ?? 0;

          const dosageStr = formatDosage(t, i18n, tea.dosage);
          const timeStr = formatBrewingTime(t, tea.brewingTime);
          const tempStr = formatTemperature(t, i18n, tea.brewTemperature);

          const safetyKey = getSafetyKey(tea);
          const detailHref = getTeaDetailPath(lang2, tea.slug || tea.id);

          const key = tea.i18nKey || tea.slug || tea.id;

          return (
            <article
              key={tea.id}
              className="bg-white dark:bg-gray-800 rounded shadow p-4"
            >
              {/* no outer <button> (carousel already has buttons) */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedTea(tea)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedTea(tea);
                }}
                className="block w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                aria-label={t("openTeaQuickView", {
                  defaultValue: "Open tea quick view",
                })}
              >
                <ProductImageCarousel
                  images={tea.images || [tea.image]}
                  alt={nameT(t, "teas", key, tea.name)}
                  className="h-48"
                />
              </div>

              <div className="flex items-start justify-between gap-3 mt-3">
                {/* ✅ Name + Product code */}
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">
                    {nameT(t, "teas", key, tea.name)}
                  </h2>

                  {tea.productCode && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {t("productCode", { defaultValue: "Product code" })}:{" "}
                      <span className="font-medium">{tea.productCode}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {tea._meta.organic && (
                    <IconBadge
                      tooltip={t("badges.organic", { defaultValue: "Organic" })}
                    >
                      <LeafIcon />
                    </IconBadge>
                  )}
                  {tea._meta.caffeine === "free" && (
                    <IconBadge
                      tooltip={t("badges.caffeineFree", {
                        defaultValue: "Caffeine-Free",
                      })}
                    >
                      <CupIcon />
                    </IconBadge>
                  )}
                  {["green", "white"].includes(
                    (tea.category || "").toLowerCase()
                  ) && (
                    <IconBadge
                      tooltip={t("badges.antioxidants", {
                        defaultValue: "Rich in Antioxidants",
                      })}
                    >
                      <ShieldIcon />
                    </IconBadge>
                  )}
                  <LikeButton productId={tea.id} size="sm" />
                </div>
              </div>

              <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                {descT(t, "teas", key, tea.description)}
              </p>

              {(dosageStr || timeStr || tempStr) && (
                <div className="mt-2 space-y-1 border-t border-gray-100 dark:border-gray-700 pt-2">
                  <BrewSpec
                    icon={<IconSpoon />}
                    label={t("card.dosageLabel", { defaultValue: "Dosage" })}
                    value={dosageStr}
                  />
                  <BrewSpec
                    icon={<IconClock />}
                    label={t("card.brewingTimeLabel", {
                      defaultValue: "Brewing time",
                    })}
                    value={timeStr}
                  />
                  <BrewSpec
                    icon={<IconThermo />}
                    label={t("card.brewTemperatureLabel", {
                      defaultValue: "Temperature",
                    })}
                    value={tempStr}
                  />
                </div>
              )}

              {safetyKey && (
                <div className="mt-2 text-xs rounded border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20 p-2">
                  <span className="font-semibold">
                    {t("safety.heading", { defaultValue: "Important notice" })}:
                  </span>{" "}
                  {t(safetyKey)}
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                <PriceTag
                  product={{ ...tea, price: basePrice, prices: tea.prices }}
                />
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {t(`categories.${(tea.category || "").toLowerCase()}`, {
                      defaultValue: (tea.category || "").toUpperCase(),
                    })}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    {t(`profiles.${tea._meta.profile}`, {
                      defaultValue: tea._meta.profile,
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={quantities[tea.id] || 1}
                  onChange={(e) =>
                    setQuantities((prev) => ({
                      ...prev,
                      [tea.id]: Math.max(1, parseInt(e.target.value) || 1),
                    }))
                  }
                  className="w-16 p-1 border rounded text-center dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                  onClick={() => add(tea)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                >
                  {t("addToCart", {
                    ns: "buttons",
                    defaultValue: "Add to Cart",
                  })}
                </button>

                <Link
                  to={detailHref}
                  className="ml-auto text-sm text-green-700 hover:underline dark:text-green-300"
                >
                  {t("learnMore", { defaultValue: "Learn more" })}
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <PaginationBar
        page={page}
        setPage={setPage}
        total={filtered.length}
        pageSize={PAGE_SIZE}
      />

      {/* ✅ Quick View modal */}
      {selectedTea && (
        <div
          className="fixed inset-0 bg-black/60 z-50 grid place-items-center px-4"
          onClick={() => setSelectedTea(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 max-w-md w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton
              onClick={() => setSelectedTea(null)}
              label={t("close", { ns: "common", defaultValue: "Close" })}
            />

            <ProductImageCarousel
              images={selectedTea.images || [selectedTea.image]}
              alt={nameT(
                t,
                "teas",
                selectedTea.i18nKey || selectedTea.slug || selectedTea.id,
                selectedTea.name
              )}
              containerClassName="mb-4"
              className="h-60"
            />

            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <h2 className="text-xl font-bold">
                  {nameT(
                    t,
                    "teas",
                    selectedTea.i18nKey || selectedTea.slug || selectedTea.id,
                    selectedTea.name
                  )}
                </h2>

                {/* ✅ Product code in modal */}
                {selectedTea.productCode && (
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {t("productCode", { defaultValue: "Product code" })}:{" "}
                    <span className="font-medium">
                      {selectedTea.productCode}
                    </span>
                  </div>
                )}
              </div>

              <LikeButton productId={selectedTea.id} size="sm" />
            </div>

            <p className="text-sm mb-3">
              {descT(
                t,
                "teas",
                selectedTea.i18nKey || selectedTea.slug || selectedTea.id,
                selectedTea.description
              )}
            </p>

            <ProductReviews productId={selectedTea.id} />

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={quantities[selectedTea.id] || 1}
                  onChange={(e) =>
                    setQuantities((prev) => ({
                      ...prev,
                      [selectedTea.id]: Math.max(
                        1,
                        parseInt(e.target.value) || 1
                      ),
                    }))
                  }
                  className="w-16 p-2 border rounded text-center dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                  onClick={() => {
                    add(selectedTea);
                    setSelectedTea(null);
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {t("addToCart", {
                    ns: "buttons",
                    defaultValue: "Add to Cart",
                  })}
                </button>

                <Link
                  to={getTeaDetailPath(
                    lang2,
                    selectedTea.slug || selectedTea.id
                  )}
                  className="text-sm text-green-700 hover:underline dark:text-green-300"
                >
                  {t("learnMore", { defaultValue: "Learn more" })}
                </Link>
              </div>

              {/* Optional: a direct “Go to details” button via navigation */}
              <button
                onClick={() =>
                  navigate(
                    getTeaDetailPath(lang2, selectedTea.slug || selectedTea.id)
                  )
                }
                className="mt-3 w-full border border-slate-300 dark:border-slate-700 rounded py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t("goToDetails", { defaultValue: "Go to product page" })}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
