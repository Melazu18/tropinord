import React, { useEffect, useState } from "react";

export default function SubscribeToggles() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [wantsDeals, setWantsDeals] = useState(true);
  const [wantsNews, setWantsNews] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  async function fetchJSON(url, opts) {
    const res = await fetch(url, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchJSON("/api/subscribe/me");
        if (data?.subscription) {
          setWantsDeals(!!data.subscription.wantsDeals);
          setWantsNews(!!data.subscription.wantsNews);
        }
      } catch {
        setError("Failed to load preferences");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await fetchJSON("/api/subscribe/me", {
        method: "PATCH",
        body: JSON.stringify({ wantsDeals, wantsNews }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 rounded-lg border shadow-sm bg-white dark:bg-gray-900">
        <div className="animate-pulse h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border shadow-sm bg-white dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-3">Subscriptions</h2>

      {error && (
        <div className="mb-3 rounded border border-red-300 bg-red-50 text-red-700 px-3 py-2">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={wantsNews}
            onChange={(e) => setWantsNews(e.target.checked)}
          />
          <span>Subscribe to updates</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={wantsDeals}
            onChange={(e) => setWantsDeals(e.target.checked)}
          />
          <span>Get discounts</span>
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {saved && <span className="text-sm text-green-600">Saved ✓</span>}
      </div>
    </div>
  );
}
