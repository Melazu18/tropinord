// src/pages/TeaPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";
import teaCatalogData from "@shared/teaCatalogData";
import { CurrencySelect, useCurrency } from "../shared/ui/CurrencyProvider";
import FilterControls from "../shared/ui/FilterControls";
import PaginationBar from "../shared/ui/PaginationBar";
import { IconBadge, LeafIcon, CupIcon, ShieldIcon } from "../shared/ui/Badge";
// import PressIcon from "../components/icons/PressIcon"; // not used here

// ---------- helpers ----------
const kw = {
  minty: ["mint", "peppermint", "spearmint", "mentha"],
  fruity: ["hibiscus", "apple", "berry", "rosehip", "lemon", "citrus", "peach"],
  floral: ["jasmine", "chamomile", "peony"],
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

export default function TeaPage() {
  const { t } = useTranslation(["teas", "buttons", "common"]);
  const { addToCart } = useCart();
  const { format } = useCurrency();

  // ---------- state ----------
  const [catalog, setCatalog] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTea, setSelectedTea] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCaffeine, setFilterCaffeine] = useState("any");
  const [filterProfile, setFilterProfile] = useState("any");
  const [page, setPage] = useState(1);
  const [toastMsg, setToastMsg] = useState("");

  const PAGE_SIZE = 9;

  // ---------- load catalog once ----------
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

  const filtered = useMemo(() => {
    return teas.filter((ti) => {
      const catOk =
        filterCategory === "all" || (ti.category || "") === filterCategory;
      const cafOk =
        filterCaffeine === "any" || ti._meta.caffeine === filterCaffeine;
      const proOk =
        filterProfile === "any" || ti._meta.profile === filterProfile;
      return catOk && cafOk && proOk;
    });
  }, [teas, filterCategory, filterCaffeine, filterProfile]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  if (loading)
    return (
      <div className="p-10">
        {t("loading", { ns: "common", defaultValue: "Loading..." })}
      </div>
    );
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  // ---------- actions ----------
  const add = (tea) => {
    const quantity = quantities[tea.id] || 1;
    addToCart({
      id: tea.id,
      label: tea.name,
      image: tea.image,
      price: tea.prices?.SEK || 0,
      quantity,
    });
    setToastMsg(
      t("addedToCart", {
        defaultValue: "{{name}} added to cart!",
        name: tea.name,
      })
    );
    setTimeout(() => setToastMsg(""), 2000);
  };

  // ---------- filter options (localized) ----------
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
    <main className="pt-32 px-4 py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">
          {t("title", { defaultValue: "🫖 Tea Collection" })}
        </h1>
        <CurrencySelect />
      </div>

      {toastMsg && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-3 py-2 text-sm rounded mb-4">
          {toastMsg}
        </div>
      )}

      <FilterControls
        items={[
          {
            key: "cat",
            label: t("filters.category", { defaultValue: "Category" }),
            value: filterCategory,
            onChange: (v) => {
              setFilterCategory(v);
              setPage(1);
            },
            options: categories,
          },
          {
            key: "caf",
            label: t("filters.caffeine.label", { defaultValue: "Caffeine" }),
            value: filterCaffeine,
            onChange: (v) => {
              setFilterCaffeine(v);
              setPage(1);
            },
            options: caffeineOptions,
          },
          {
            key: "pro",
            label: t("filters.profile.label", { defaultValue: "Flavor" }),
            value: filterProfile,
            onChange: (v) => {
              setFilterProfile(v);
              setPage(1);
            },
            options: profileOptions,
          },
        ]}
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageItems.map((tea) => (
          <article
            key={tea.id}
            className="bg-white dark:bg-gray-800 rounded shadow p-4"
          >
            <button
              onClick={() => setSelectedTea(tea)}
              className="block w-full text-left"
            >
              <img
                src={tea.image}
                alt={tea.name}
                className="w-full h-48 object-cover rounded"
              />
            </button>

            <div className="flex items-start justify-between gap-3 mt-3">
              <h2 className="text-lg font-semibold">{tea.name}</h2>
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
              </div>
            </div>

            <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
              {tea.description}
            </p>

            <div className="flex items-center justify-between mt-2">
              <p className="font-bold text-green-700 dark:text-green-300">
                {format(tea.prices?.SEK || 0)}
              </p>
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
                {t("addToCart", { ns: "buttons", defaultValue: "Add to Cart" })}
              </button>
            </div>
          </article>
        ))}
      </section>

      <PaginationBar
        page={page}
        setPage={setPage}
        total={filtered.length}
        pageSize={PAGE_SIZE}
      />

      {selectedTea && (
        <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center px-4">
          <div className="bg-white dark:bg-gray-900 max-w-md w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 relative">
            <button
              onClick={() => setSelectedTea(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
            >
              {t("close", { ns: "common", defaultValue: "Close" })}
            </button>

            <img
              src={selectedTea.image}
              alt={selectedTea.name}
              className="w-full h-60 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{selectedTea.name}</h2>
            <p className="text-sm mb-3">{selectedTea.description}</p>

            {selectedTea.history && (
              <>
                <h3 className="font-semibold">
                  {t("modal.historyHeading", { defaultValue: "History" })}
                </h3>
                <p className="text-sm mb-3">{selectedTea.history}</p>
              </>
            )}

            {selectedTea.benefits && (
              <>
                <h3 className="font-semibold">
                  {t("modal.benefitsHeading", {
                    defaultValue: "Health Benefits",
                  })}
                </h3>
                <ul className="list-disc list-inside text-sm mb-2">
                  {selectedTea.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </>
            )}

            {selectedTea.ingredients && (
              <>
                <h3 className="font-semibold">
                  {t("modal.ingredientsHeading", {
                    defaultValue: "Ingredients",
                  })}
                </h3>
                <p className="text-sm mb-3">
                  {Array.isArray(selectedTea.ingredients)
                    ? selectedTea.ingredients.join(", ")
                    : selectedTea.ingredients}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
