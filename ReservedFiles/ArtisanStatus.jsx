import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMe } from "../hooks/useMe";
import { artisanAPI } from "../services/api";
import { getLocalizedPath } from "../utils/getLocalizedPath";

export default function ArtisanStatus() {
  const { t, i18n } = useTranslation("artisan");
  const { me, loading: meLoading } = useMe();
  const [profile, setProfile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function load() {
    setBusy(true);
    setErr(null);
    try {
      const res = await artisanAPI.getStatus(); // GET /api/artisan/me
      setProfile(res.data?.profile || res.data || null);
    } catch (e) {
      setErr("Failed to load status.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!meLoading) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meLoading]);

  if (meLoading) return null; // let auth resolve

  // If not logged in, bounce to login with next=…
  if (!me) {
    const lang = (i18n.language || "en").slice(0, 2);
    const login = getLocalizedPath("login", lang);
    const here = location.pathname + location.search + location.hash;
    location.replace(`${login}?next=${encodeURIComponent(here)}`);
    return null;
  }

  const status = profile?.status || "NONE";

  const chip = (text, classes) => (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${classes}`}
    >
      {text}
    </span>
  );

  const StatusBadge = () => {
    if (status === "APPROVED")
      return chip(
        t("status.approved", "Approved"),
        "bg-green-100 text-green-800"
      );
    if (status === "PENDING")
      return chip(
        t("status.pending", "Pending review"),
        "bg-yellow-100 text-yellow-800"
      );
    if (status === "REJECTED")
      return chip(t("status.rejected", "Rejected"), "bg-red-100 text-red-700");
    return chip(
      t("status.none", "No application"),
      "bg-gray-100 text-gray-700"
    );
    // You can add DRAFT, NEEDS_INFO etc if your model uses them
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          {t("status.title", "Artisan Application Status")}
        </h1>
        <button
          onClick={load}
          disabled={busy}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {busy
            ? t("status.refreshing", "Refreshing…")
            : t("status.refresh", "Refresh")}
        </button>
      </div>

      {err && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">
          {err}
        </div>
      )}

      <div className="p-4 rounded border bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">
              {t("status.current", "Current status")}
            </div>
            <div className="mt-1">
              <StatusBadge />
            </div>
          </div>
          {status === "NONE" && (
            <a
              href={getLocalizedPath(
                "apply",
                (i18n.language || "en").slice(0, 2)
              )}
              className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {t("status.applyNow", "Apply Now")}
            </a>
          )}
          {status === "REJECTED" && (
            <a
              href={getLocalizedPath(
                "apply",
                (i18n.language || "en").slice(0, 2)
              )}
              className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {t("status.reapply", "Re-apply")}
            </a>
          )}
          {status === "APPROVED" && (
            <a
              href={getLocalizedPath(
                "dashboard",
                (i18n.language || "en").slice(0, 2)
              )}
              className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              {t("status.goToDashboard", "Go to Seller Dashboard")}
            </a>
          )}
        </div>

        {profile && (
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">
                {t("form.companyName", "Business Name")}:
              </span>{" "}
              {profile.companyName || "—"}
            </div>
            <div>
              <span className="text-gray-500">
                {t("form.country", "Country")}:
              </span>{" "}
              {profile.country || "—"}
            </div>
            <div>
              <span className="text-gray-500">
                {t("status.submitted", "Submitted")}:
              </span>{" "}
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleString()
                : "—"}
            </div>
            <div>
              <span className="text-gray-500">
                {t("status.reviewed", "Reviewed")}:
              </span>{" "}
              {profile.reviewedAt
                ? new Date(profile.reviewedAt).toLocaleString()
                : "—"}
            </div>
            {profile.reviewNote && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">
                  {t("status.note", "Reviewer note")}:
                </span>{" "}
                {profile.reviewNote}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
