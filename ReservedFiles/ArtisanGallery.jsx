// src/pages/ArtisanGallery.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../utils/api";
import { getLocalizedPath } from "../utils/getLocalizedPath";
import i18n from "i18next";
import GalleryItemModal from "../components/gallery/GalleryItemModal";

/**
 * Local seed to instantly populate the grid.
 * These entries are flagged with source: "local".
 * Place the image files under: public/images/gallery/<filename>
 * Optionally add productSlug to jump to product history.
 */
const LOCAL_SEED = [
  {
    file: "kanelsoap.jpg",
    title: "Kanel Soap",
    description: "Handcrafted cinnamon soap",
    author: { handle: "Artisan A" },
    // productSlug: "black-soap"            // <- example mapping (optional)
  },
  {
    file: "crunchyLoaf03.png",
    title: "Crunchy Loaf #03",
    description: "Fresh baked artisan bread",
    author: { handle: "Baker Bee" },
  },
  {
    file: "organicsoap0001.jpg",
    title: "Organic Soap 0001",
    description: "Organic gentle cleanse",
    author: { handle: "Artisan A" },
  },
  {
    file: "crunchyLoaf02.jpg",
    title: "Crunchy Loaf #02",
    description: "Crusty sourdough loaf",
    author: { handle: "Baker Bee" },
  },
  {
    file: "coconutoil01.jpg",
    title: "Coconut Oil 01",
    description: "Cold-pressed coconut oil",
    author: { handle: "Oil Studio" },
  },
  {
    file: "specialoil01.jpg",
    title: "Special Oil 01",
    description: "Natural botanical oil",
    author: { handle: "Oil Studio" },
  },
  {
    file: "tumericoil.jpg",
    title: "Turmeric Oil",
    description: "Infused turmeric body oil",
    author: { handle: "Oil Studio" },
  },
  {
    file: "teatreeoil01.jpg",
    title: "Tea Tree Oil 01",
    description: "Tea tree wellness oil",
    author: { handle: "Oil Studio" },
  },
  {
    file: "design01.jpg",
    title: "Design 01",
    description: "Concept sketch",
    author: { handle: "Creator X" },
  },
  {
    file: "design03.jpg",
    title: "Design 03",
    description: "Pattern exploration",
    author: { handle: "Creator X" },
  },
  {
    file: "knitting02.jpg",
    title: "Knitting 02",
    description: "Stitch detail",
    author: { handle: "Knits & Co" },
  },
  {
    file: "knitting03.jpg",
    title: "Knitting 03",
    description: "Wool pattern swatch",
    author: { handle: "Knits & Co" },
  },
  {
    file: "painting01.jpg",
    title: "Painting 01",
    description: "Color study",
    author: { handle: "Studio Nova" },
  },
  {
    file: "painting02.jpg",
    title: "Painting 02",
    description: "Abstract form",
    author: { handle: "Studio Nova" },
  },
  {
    file: "painting03.jpg",
    title: "Painting 03",
    description: "Landscape impression",
    author: { handle: "Studio Nova" },
  },
  {
    file: "pottery01.jpg",
    title: "Pottery 01",
    description: "Stoneware bowl",
    author: { handle: "Clayworks" },
  },
  {
    file: "pottery02.jpg",
    title: "Pottery 02",
    description: "Glazed vase",
    author: { handle: "Clayworks" },
  },
].map((x, idx) => ({
  id: `local-${idx}-${x.file}`,
  images: [`/images/gallery/${x.file}`],
  title: x.title,
  description: x.description,
  author: x.author,
  _count: { likes: 0, comments: 0 },
  source: "local",
  productSlug: x.productSlug,
}));

// Bigger Like button with graceful fallback
function LikeButton({ id, initial }) {
  const [likes, setLikes] = useState(initial || 0);
  const [liked, setLiked] = useState(false);

  async function toggle() {
    try {
      const method = liked ? "DELETE" : "POST";
      const res = await fetch(`/api/gallery/${encodeURIComponent(id)}/like`, {
        method,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      if (typeof data.likes === "number") {
        setLikes(data.likes);
        setLiked(Boolean(data.liked));
      } else {
        const nextLiked = !liked;
        setLiked(nextLiked);
        setLikes((n) => n + (nextLiked ? 1 : -1));
      }
    } catch (_e) {}
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-1 text-base sm:text-lg font-semibold text-green-700 dark:text-green-400 hover:underline"
      aria-label={liked ? "Unlike" : "Like"}
    >
      <span className="text-xl sm:text-2xl leading-none">
        {liked ? "♥" : "♡"}
      </span>
      <span>{likes}</span>
    </button>
  );
}

export default function ArtisanGallery() {
  const { t } = useTranslation(["gallery", "buttons"]);
  const [items, setItems] = useState([]);
  const [next, setNext] = useState(null);
  const [loading, setLoading] = useState(true);
  const lang = (i18n.language || "en").slice(0, 2);

  // Router hooks
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const openedId = params.get("id");

  function openModal(id) {
    const p = new URLSearchParams(params);
    p.set("id", id);
    navigate({ search: p.toString() }, { replace: false });
  }

  function closeModal() {
    const p = new URLSearchParams(params);
    p.delete("id");
    navigate({ search: p.toString() || "" }, { replace: true });
  }

  const normalize = (arr) =>
    (arr || []).map((it) => ({
      ...it,
      id: it.id ?? cryptoRandomId(),
      images: Array.isArray(it.images) ? it.images : it.image ? [it.image] : [],
      _count: it._count ?? { likes: 0, comments: 0 },
      source: it.source ?? "api",
    }));

  function dedupeByTitleFirstImage(arr) {
    const seen = new Set();
    return arr.filter((it) => {
      const key = `${(it.title || "").trim().toLowerCase()}::${(
        it.images?.[0] || ""
      )
        .trim()
        .toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  const load = async (cursor) => {
    try {
      const url = new URL(`${API_BASE}/gallery`);
      if (cursor) url.searchParams.set("cursor", cursor);

      const res = await fetch(url);
      const data = await res.json();

      const apiItems = normalize(data.items);

      if (cursor) {
        setItems((prev) => dedupeByTitleFirstImage([...prev, ...apiItems]));
      } else {
        const merged = apiItems.length ? apiItems : LOCAL_SEED;
        setItems(dedupeByTitleFirstImage(merged));
      }

      setNext(data.nextCursor || null);
    } catch (_e) {
      if (!cursor) setItems(LOCAL_SEED);
      setNext(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cryptoRandomId() {
    return "tmp-" + Math.random().toString(36).slice(2, 10);
  }

  // Helper: build localized product detail route (/en/products/detail/:slug OR /sv/products/detail/:slug)
  const productDetailPath = (slug) =>
    `/${lang}/products/detail/${encodeURIComponent(slug)}`;

  // If the item has a productSlug (or slug), clicking the image goes to product history.
  // Otherwise, API items open the modal; local items just show the image.
  const ImageBlock = ({ it }) => {
    const targetSlug = it.productSlug || it.slug;
    const img = (
      <div className="aspect-square overflow-hidden">
        <img
          src={it.images?.[0]}
          alt={it.title || "Gallery item"}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );

    if (targetSlug) {
      return (
        <Link
          to={productDetailPath(targetSlug)}
          aria-label={it.title || "View product history"}
          className="block"
        >
          {img}
        </Link>
      );
    }

    if (it.source === "local") return img;

    return (
      <button
        type="button"
        onClick={() => openModal(it.id)}
        aria-label={it.title || "View gallery item"}
        className="block w-full text-left"
      >
        {img}
      </button>
    );
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 pt-40">
      {/* Logo pinned under header */}
      <img
        src="/images/artisanLogo.png"
        alt={t("logoAlt", { defaultValue: "Artisan Gallery" })}
        className="absolute left-1/2 -translate-x-1/2 top-2 h-28 sm:h-32 md:h-40 w-auto object-contain"
      />

      {/* ───────────────── Hero / Welcome Landing ───────────────── */}
      <section
        className="relative rounded-2xl overflow-hidden mb-10 shadow-lg"
        style={{
          backgroundImage: "url('/images/gallery/artisanPage.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative p-6 sm:p-10 md:p-14 text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            {t("hero.title")}
          </h1>
          <h2 className="text-lg md:text-xl opacity-90 mb-6">
            {t("hero.tagline")}
          </h2>

          <div className="max-w-3xl space-y-4 text-sm md:text-base leading-relaxed">
            <p>{t("hero.p1")}</p>

            <h3 className="font-semibold mt-4">{t("hero.yourTalent")}</h3>
            <ul className="list-disc pl-5 space-y-1 opacity-95">
              {t("hero.yourTalentList", { returnObjects: true }).map(
                (li, i) => (
                  <li key={i}>{li}</li>
                )
              )}
            </ul>

            <h3 className="font-semibold mt-4">{t("hero.howItWorks")}</h3>
            <p className="opacity-95">
              <span className="font-medium">{t("hero.forArtisans")}</span>{" "}
              {t("hero.forArtisansText")}
            </p>
            <p className="opacity-95">
              <span className="font-medium">{t("hero.forBuyers")}</span>{" "}
              {t("hero.forBuyersText")}
            </p>

            <h3 className="font-semibold mt-4">{t("hero.whyJoin")}</h3>
            <ul className="list-disc pl-5 space-y-1 opacity-95">
              {t("hero.whyJoinList", { returnObjects: true }).map((li, i) => (
                <li key={i}>{li}</li>
              ))}
            </ul>

            <p className="mt-4 opacity-95">{t("hero.closing")}</p>
            <p className="font-medium mt-4">{t("hero.slogan")}</p>
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href="#gallery"
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
            >
              {t("hero.ctaExplore")}
            </a>
            <Link
              to={getLocalizedPath("apply", lang)}
              className="px-4 py-2 rounded bg-white/10 hover:bg-white/20"
            >
              {t("hero.ctaBecome")}
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────── Existing page copy (kept) ───────────────── */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">
        {t("title", { defaultValue: "Artisan Gallery" })}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {t("subtitle", {
          defaultValue:
            "Discover designs from artisans. Like, comment, and follow their journey.",
        })}
      </p>

      {/* ───────────────── Grid ───────────────── */}
      <div id="gallery" />

      {loading ? (
        <div className="text-gray-500">
          {t("loading", { defaultValue: "Loading..." })}
        </div>
      ) : items.length === 0 ? (
        <div className="text-gray-500">
          {t("empty", { defaultValue: "No items yet." })}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <li
              key={it.id}
              className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900"
            >
              <ImageBlock it={it} />

              <div className="p-3">
                <div className="font-semibold">{it.title || "Untitled"}</div>
                {it.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                    {it.description}
                  </p>
                )}

                {/* Meta row with bigger Like + working Comment */}
                <div className="text-xs text-gray-500 mt-3 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    {t("by", { defaultValue: "by" })}{" "}
                    <span className="font-medium">
                      {it.author?.handle || it.author?.name || "—"}
                    </span>
                  </span>

                  <span className="hidden sm:inline">•</span>

                  <LikeButton id={it.id} initial={it._count?.likes || 0} />

                  <span className="hidden sm:inline">•</span>

                  <button
                    type="button"
                    onClick={() => openModal(it.id)}
                    className="inline-flex items-center gap-1 text-base sm:text-lg font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                  >
                    💬 {it._count?.comments || 0}{" "}
                    {t("comments", { defaultValue: "comments" })}
                  </button>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-4">
                  {it.productSlug || it.slug ? (
                    <Link
                      to={productDetailPath(it.productSlug || it.slug)}
                      className="text-sm sm:text-base text-green-700 dark:text-green-400 hover:underline"
                    >
                      {t("view", { defaultValue: "View" })}
                    </Link>
                  ) : it.source === "local" ? (
                    <span className="text-sm text-gray-400">
                      {t("previewOnly", { defaultValue: "Preview only" })}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openModal(it.id)}
                      className="text-sm sm:text-base text-green-700 dark:text-green-400 hover:underline"
                    >
                      {t("view", { defaultValue: "View" })}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {next && (
        <div className="text-center mt-6">
          <button
            onClick={() => load(next)}
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            {t("loadMore", { defaultValue: "Load more" })}
          </button>
        </div>
      )}

      {/* Modal renders when ?id=<itemId> is present */}
      {openedId && <GalleryItemModal id={openedId} onClose={closeModal} />}
    </div>
  );
}
