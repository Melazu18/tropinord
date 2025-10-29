// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// (keep your other cards if you have them)
import AdminProductsQueue from "../components/admin/AdminProductsQueue";

export default function AdminDashboard() {
  const { t } = useTranslation("admin");
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const [pendingSellers, setPendingSellers] = useState([]);
  const [approvedSellers, setApprovedSellers] = useState([]);
  const [sellersError, setSellersError] = useState(null);

  const [activities, setActivities] = useState([]);
  const [activitiesError, setActivitiesError] = useState(null);

  // NEW: seed UI state (non-breaking)
  const [seedMsg, setSeedMsg] = useState("");
  const [seedLoading, setSeedLoading] = useState(false);

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

  // Auth gate
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

  // Sellers lists (best-effort)
  useEffect(() => {
    if (authError || !me || me.role !== "ADMIN") return;
    (async () => {
      try {
        const pending = await fetchJSON("/api/sellers/pending");
        const approved = await fetchJSON("/api/sellers/approved");
        setPendingSellers(pending.items || []);
        setApprovedSellers(approved.items || []);
        setSellersError(null);
      } catch {
        setSellersError("not_available");
      }
    })();
  }, [me, authError]);

  // Activity (best-effort)
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

  async function logout() {
    try {
      await fetchJSON("/api/auth/logout", { method: "POST" });
    } catch {}
    window.location.reload();
  }

  async function approveSeller(id) {
    try {
      if (!id) return;
      const res = await fetch(
        `/api/sellers/${encodeURIComponent(id)}/approve`,
        {
          method: "POST",
          credentials: "include",
          headers: { Accept: "application/json" },
        }
      );
      if (!res.ok) {
        const text = await res.text();
        alert(`Approve failed (${res.status}): ${text}`);
        return;
      }
      setPendingSellers((s) => s.filter((x) => x.id !== id));
    } catch (e) {
      alert(`Approve failed: ${e.message}`);
    }
  }

  async function rejectSeller(id) {
    try {
      await fetchJSON(`/api/sellers/${encodeURIComponent(id)}/reject`, {
        method: "POST",
      });
      setPendingSellers((s) => s.filter((x) => x.id !== id));
    } catch {
      alert(t("rejectFailed", { defaultValue: "Reject failed." }));
    }
  }

  // NEW: Seed handler (non-breaking)
  async function seedGallery() {
    setSeedLoading(true);
    setSeedMsg(t("seeding", { defaultValue: "Seeding…" }));
    try {
      const res = await fetch("/api/admin/gallery/seed", {
        method: "POST",
        credentials: "include", // uses your admin session cookie
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSeedMsg(
        t("seedDone", {
          defaultValue: "Done: {{count}} items",
          count: data.count,
        })
      );
    } catch (e) {
      setSeedMsg(
        t("seedError", {
          defaultValue: "Error: {{msg}}",
          msg: e.message,
        })
      );
    } finally {
      setSeedLoading(false);
    }
  }

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

      {/* ONE grid only — put all admin cards here as siblings */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Pending Sellers */}
        <div className="p-4 rounded-lg border shadow-sm bg-white dark:bg-gray-900">
          <h2 className="text-lg font-semibold mb-3">
            {t("pendingSellers", { defaultValue: "Pending Sellers" })}
          </h2>
          {sellersError === "not_available" ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("sellersApiMissing", {
                defaultValue:
                  "Seller API not available yet. Hook up /api/sellers to enable this section.",
              })}
            </p>
          ) : pendingSellers.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("none", { defaultValue: "None" })}
            </p>
          ) : (
            <ul className="space-y-3">
              {pendingSellers.map((s) => (
                <li
                  key={s.id}
                  className="p-3 rounded border bg-gray-50 dark:bg-gray-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{s.companyName}</div>
                    <div className="text-sm text-gray-600">
                      {s.user?.email || s.email}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveSeller(s.id)}
                      className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      {t("approve", { defaultValue: "Approve" })}
                    </button>
                    <button
                      onClick={() => rejectSeller(s.id)}
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      {t("reject", { defaultValue: "Reject" })}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Products Queue card (unchanged) */}
        <AdminProductsQueue />

        {/* NEW: Artisan Gallery tools (seed) */}
        <div className="p-4 rounded-lg border shadow-sm bg-white dark:bg-gray-900">
          <h2 className="text-lg font-semibold mb-2">
            {t("artisanGallery", { defaultValue: "Artisan Gallery" })}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {t("seedInfo", {
              defaultValue:
                "Seed the starter images from /public/images/gallery into the database.",
            })}
          </p>
          <button
            onClick={seedGallery}
            disabled={seedLoading}
            className={`px-3 py-2 rounded text-white ${
              seedLoading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {seedLoading
              ? t("seeding", { defaultValue: "Seeding…" })
              : t("seedButton", { defaultValue: "Seed Artisan Gallery" })}
          </button>
          {seedMsg && (
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
              {seedMsg}
            </p>
          )}
        </div>
      </div>

      {/* Approved sellers */}
      <div className="p-4 rounded-lg border shadow-sm bg-white dark:bg-gray-900 mb-10">
        <h2 className="text-lg font-semibold mb-3">
          {t("approvedSellers", { defaultValue: "Approved Sellers" })}
        </h2>
        {sellersError === "not_available" ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("sellersApiMissing", {
              defaultValue:
                "Seller API not available yet. Hook up /api/sellers to enable this section.",
            })}
          </p>
        ) : approvedSellers.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("none", { defaultValue: "None" })}
          </p>
        ) : (
          <ul className="space-y-2">
            {approvedSellers.map((s) => (
              <li
                key={s.id}
                className="p-3 rounded border bg-gray-50 dark:bg-gray-800"
              >
                <div className="font-medium">{s.companyName}</div>
                <div className="text-sm text-gray-600">
                  {s.user?.email || s.email}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent activity */}
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
                  <span className="font-medium">{a.type}</span>
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
