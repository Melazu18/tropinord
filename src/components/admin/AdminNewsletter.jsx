import React, { useEffect, useState } from "react";

export default function AdminNewsletter() {
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [segment, setSegment] = useState("all");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [counts, setCounts] = useState(null);

  async function fetchCounts() {
    try {
      const res = await fetch("/api/newsletter/segments", {
        credentials: "include",
      });
      const j = await res.json();
      if (res.ok && j.ok) setCounts(j.counts);
    } catch {}
  }
  useEffect(() => {
    fetchCounts();
  }, []);

  async function send(dryRun = false) {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, html, segment, dryRun }),
      });
      const j = await res.json();
      if (!res.ok || j.ok === false)
        throw new Error(j.error || `HTTP ${res.status}`);
      setMsg(
        dryRun
          ? `Dry-run: would send to ${j.recipients} recipients.`
          : `Sent: ${j.sent} / ${j.requested}`
      );
    } catch (e) {
      setMsg(`Failed: ${e.message}`);
    } finally {
      setLoading(false);
      fetchCounts();
    }
  }

  return (
    <div className="p-4 rounded-lg border shadow-sm bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Newsletter</h2>
        {counts && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Segments — All: {counts.all} • News: {counts.news} • Deals:{" "}
            {counts.deals}
          </div>
        )}
      </div>

      <div className="grid gap-3">
        <input
          className="border rounded p-2"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <select
          className="border rounded p-2 w-48"
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
        >
          <option value="all">All verified</option>
          <option value="news">News only</option>
          <option value="deals">Deals only</option>
        </select>
        <textarea
          className="border rounded p-2 min-h-[160px]"
          placeholder="HTML content (body)"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={() => send(true)}
            disabled={loading || !subject || !html}
            className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-800"
          >
            {loading ? "…" : "Dry Run"}
          </button>
          <button
            onClick={() => send(false)}
            disabled={loading || !subject || !html}
            className="px-3 py-2 rounded bg-emerald-600 text-white"
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
        {msg && (
          <p className="text-sm text-gray-700 dark:text-gray-300">{msg}</p>
        )}
      </div>
    </div>
  );
}
