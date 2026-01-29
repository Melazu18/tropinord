// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AdminProductsManager from "../components/admin/AdminProductsManager";
import AdminNewsletter from "../components/admin/AdminNewsletter";
import { routeMap } from "../routes/routeMap";

export default function AdminDashboard() {
  const { t, i18n } = useTranslation("admin");
  const lang2 = (i18n.language || "en").slice(0, 2);

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activitiesError, setActivitiesError] = useState(null);

  // NEW: sync UI state
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  // Reusable fetch helper
  async function fetchJSON(url, opts) {
    const res = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...opts,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  // 🔄 Sync FE catalogs → Prisma products
  async function syncProducts() {
    setSyncLoading(true);
    setSyncMsg("");
    try {
      const res = await fetch("/api/admin/products/sync", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data.ok)
        throw new Error(data.error || `HTTP ${res.status}`);
      const { created = 0, updated = 0, total = 0 } = data;
      setSyncMsg(
        `Sync complete: ${created} created, ${updated} updated (scanned ${total})`
      );
      window.dispatchEvent(new CustomEvent("admin-products-sync-done"));
    } catch (e) {
      setSyncMsg(`Sync failed: ${e.message}`);
    } finally {
      setSyncLoading(false);
    }
  }

  // Auth check (admin only)
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJSON("/api/auth/me");
        setMe(data.user);
        if (data.user?.role !== "ADMIN") setAuthError("not_admin");
      } catch {
        setAuthError("unauthorized");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Recent activity logs
  useEffect(() => {
    if (authError || !me || me.role !== "ADMIN") return;
    (async () => {
      try {
        const data = await fetchJSON("/api/admin/activity?limit=50");
        setActivities(data.items || []);
      } catch {
        setActivitiesError("not_available");
      }
    })();
  }, [me, authError]);

  // Logout
  async function logout() {
    try {
      await fetchJSON("/api/auth/logout", { method: "POST" });
    } catch {}
    window.location.reload();
  }

  // ---- route helpers ----
  const publicPath = (key) =>
    `/${lang2}/${routeMap[key]?.[lang2] || routeMap[key]?.en || ""}`;

  const adminPath = (key) =>
    `/${lang2}/${routeMap.admin?.[lang2] || "admin"}/${
      routeMap[key]?.[lang2] || routeMap[key]?.en || ""
    }`;

  const linkClass =
    "inline-flex items-center justify-between gap-2 px-3 py-2 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm";

  // ──────────────────────────────
  //  RENDERING
  // ──────────────────────────────

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-10">
        <div className="animate-pulse h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <h1 className="text-xl font-semibold mb-4">
          {t("notAuthorizedTitle", { defaultValue: "Not authorized" })}
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          {t("notAuthorizedText", {
            defaultValue:
              "You need an admin account to access this page. Please log in as an admin.",
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {t("dashboardTitle", { defaultValue: "Admin Dashboard" })}
        </h1>
        <button
          onClick={logout}
          className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {t("logout", { defaultValue: "Logout" })}
        </button>
      </div>

      {/* 🔄 SYNC CATALOG → PRISMA */}
      <div className="p-4 rounded-lg border shadow-sm bg-white dark:bg-gray-900 mb-6">
        <h2 className="text-lg font-semibold mb-2">
          {t("syncTitle", { defaultValue: "Sync Catalog → Prisma" })}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {t("syncHelp", {
            defaultValue:
              "Imports/updates Tea, Oils, Coffee, and Superfoods from your frontend catalog data into the Prisma Product table.",
          })}
        </p>
        <button
          onClick={syncProducts}
          disabled={syncLoading}
          className={`px-3 py-2 rounded text-white ${
            syncLoading
              ? "bg-emerald-400"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {syncLoading
            ? t("syncing", { defaultValue: "Syncing…" })
            : t("runSync", { defaultValue: "Run Sync" })}
        </button>
        {syncMsg && (
          <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
            {syncMsg}
          </p>
        )}
      </div>

      {/* ✅ LABELS (PUBLIC + ADMIN) */}
      <div className="p-4 rounded-lg border shadow-sm bg-white dark:bg-gray-900 mb-6">
        <h2 className="text-lg font-semibold mb-2">
          {t("labelsTitle", { defaultValue: "Printable Labels" })}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {t("labelsHelp", {
            defaultValue:
              "Open printable label sheets (public) or admin sheets (with extra fields).",
          })}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Tea */}
          <div className="rounded border dark:border-gray-700 p-3">
            <div className="font-semibold mb-2">Tea</div>
            <div className="flex flex-col gap-2">
              <Link to={publicPath("teaLabels")} className={linkClass}>
                <span>Public labels</span>
                <span>→</span>
              </Link>
              <Link to={adminPath("teaAdminLabels")} className={linkClass}>
                <span>Admin labels</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Coffee */}
          <div className="rounded border dark:border-gray-700 p-3">
            <div className="font-semibold mb-2">Coffee</div>
            <div className="flex flex-col gap-2">
              <Link to={publicPath("coffeeLabels")} className={linkClass}>
                <span>Public labels</span>
                <span>→</span>
              </Link>
              <Link to={adminPath("coffeeAdminLabels")} className={linkClass}>
                <span>Admin labels</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Oils */}
          <div className="rounded border dark:border-gray-700 p-3">
            <div className="font-semibold mb-2">Oils</div>
            <div className="flex flex-col gap-2">
              <Link to={publicPath("oilsLabels")} className={linkClass}>
                <span>Public labels</span>
                <span>→</span>
              </Link>
              <Link to={adminPath("oilsAdminLabels")} className={linkClass}>
                <span>Admin labels</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Superfoods */}
          <div className="rounded border dark:border-gray-700 p-3">
            <div className="font-semibold mb-2">Superfoods</div>
            <div className="flex flex-col gap-2">
              <Link to={publicPath("superfoodsLabels")} className={linkClass}>
                <span>Public labels</span>
                <span>→</span>
              </Link>
              <Link
                to={adminPath("superfoodsAdminLabels")}
                className={linkClass}
              >
                <span>Admin labels</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ PRODUCT MANAGEMENT SECTION */}
      <div className="grid gap-6 mb-10">
        <AdminProductsManager />
        <AdminNewsletter />
      </div>

      {/* ✅ OPTIONAL: RECENT ACTIVITY */}
      <div className="p-4 rounded-lg border shadow-sm bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-3">
          {t("recentActivity", { defaultValue: "Recent Activity" })}
        </h2>
        {activitiesError === "not_available" ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("activityApiMissing", {
              defaultValue:
                "Activity API not available yet. Expose /api/admin/activities to enable this section.",
            })}
          </p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("none", { defaultValue: "None" })}
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {activities.map((a) => (
              <li key={a.id} className="py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {a.type || t("activity", { defaultValue: "Activity" })}
                  </span>
                  <span className="text-gray-500">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  {a.email || a.userId} — {a.route} — {a.ip}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
