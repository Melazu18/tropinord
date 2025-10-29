// src/pages/ArtisansTouch.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button";
import { API_BASE } from "../utils/api";

const TIME_SLOTS = ["10:00", "12:00", "14:00", "16:00", "18:00"];

const SERVICES = {
  hair: {
    labelKey: "services.hair",
    styles: [
      {
        id: "knotless",
        nameKey: "styles.knotless",
        variants: [
          { id: "small", labelKey: "sizes.small", price: 1200 },
          { id: "medium", labelKey: "sizes.medium", price: 900 },
          { id: "large", labelKey: "sizes.large", price: 700 },
        ],
        length: [
          { id: "shoulder", labelKey: "lengths.shoulder", add: 0 },
          { id: "midback", labelKey: "lengths.midback", add: 200 },
          { id: "waist", labelKey: "lengths.waist", add: 400 },
        ],
      },
      {
        id: "box",
        nameKey: "styles.box",
        variants: [
          { id: "small", labelKey: "sizes.small", price: 1100 },
          { id: "medium", labelKey: "sizes.medium", price: 850 },
          { id: "large", labelKey: "sizes.large", price: 650 },
        ],
        length: [
          { id: "shoulder", labelKey: "lengths.shoulder", add: 0 },
          { id: "midback", labelKey: "lengths.midback", add: 200 },
          { id: "waist", labelKey: "lengths.waist", add: 400 },
        ],
      },
      {
        id: "cornrows",
        nameKey: "styles.cornrows",
        variants: [
          { id: "basic", labelKey: "sizes.basic", price: 500 },
          { id: "design", labelKey: "sizes.design", price: 750 },
        ],
        length: [
          { id: "shoulder", labelKey: "lengths.shoulder", add: 0 },
          { id: "midback", labelKey: "lengths.midback", add: 150 },
          { id: "waist", labelKey: "lengths.waist", add: 300 },
        ],
      },
    ],
  },
  nails: {
    labelKey: "services.nails",
    styles: [
      {
        id: "classic",
        nameKey: "styles.classicMani",
        variants: [
          { id: "basic", labelKey: "sizes.basic", price: 350 },
          { id: "gel", labelKey: "sizes.gel", price: 550 },
        ],
      },
      {
        id: "french",
        nameKey: "styles.french",
        variants: [
          { id: "standard", labelKey: "sizes.standard", price: 600 },
          { id: "gel", labelKey: "sizes.gel", price: 750 },
        ],
      },
      {
        id: "chrome",
        nameKey: "styles.chrome",
        variants: [{ id: "gel", labelKey: "sizes.gel", price: 850 }],
      },
    ],
  },
};

function makeDays(n = 21) {
  const out = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    d.setHours(12, 0, 0, 0);
    out.push(d);
  }
  return out;
}

export default function ArtisansTouch() {
  const { t, i18n } = useTranslation(["artisans", "buttons"]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  });
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState("");

  // Modal
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [service, setService] = useState("hair");
  const [styleId, setStyleId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [lengthId, setLengthId] = useState("");

  // Availability
  const days = useMemo(() => makeDays(21), []);
  const [busyMap, setBusyMap] = useState(new Map());
  const [fullyBooked, setFullyBooked] = useState(new Set());

  const fmtDateKey = (d) => d.toISOString().slice(0, 10);
  const fmt = (d) =>
    d.toLocaleDateString(i18n.language?.startsWith("sv") ? "sv-SE" : "en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

  useEffect(() => {
    const from = fmtDateKey(days[0]);
    const to = fmtDateKey(days[days.length - 1]);
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/bookings/availability?from=${from}&to=${to}`
        );
        if (!res.ok) throw new Error("availability failed");
        const data = await res.json();
        const map = new Map();
        Object.entries(data.dates || {}).forEach(([k, arr]) => {
          map.set(k, new Set(arr));
        });
        setBusyMap(map);
        setFullyBooked(new Set(data.fullyBooked || []));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [API_BASE]); // eslint-disable-line

  const isBusy = (d, time) => busyMap.get(fmtDateKey(d))?.has(time);
  const isFullyBooked = (d) => fullyBooked.has(fmtDateKey(d));

  const currentService = SERVICES[service];
  const currentStyle = currentService.styles.find((s) => s.id === styleId);
  const currentVariant = currentStyle?.variants?.find(
    (v) => v.id === variantId
  );
  const currentLength = currentStyle?.length?.find((l) => l.id === lengthId);
  const estimate = (currentVariant?.price || 0) + (currentLength?.add || 0);

  const canOpenModal =
    selectedDate &&
    selectedTime &&
    !isBusy(selectedDate, selectedTime) &&
    !isFullyBooked(selectedDate);

  const canContinueStep1 =
    service && styleId && variantId && (service === "nails" || lengthId);

  const canSubmit =
    form.name && form.phone && selectedDate && selectedTime && canContinueStep1;

  // Submit → hold + stripe checkout
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      const date = fmtDateKey(selectedDate);

      // 1) check
      const checkRes = await fetch(
        `${API_BASE}/bookings/check?date=${date}&time=${encodeURIComponent(
          selectedTime
        )}`
      );
      if (!checkRes.ok) throw new Error("check failed");
      const check = await checkRes.json();
      if (check.status !== "AVAILABLE") {
        setOk("failed");
        setSubmitting(false);
        return;
      }

      // 2) hold
      const holdRes = await fetch(`${API_BASE}/bookings/hold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time: selectedTime,
          customer: { ...form },
          selection: {
            service,
            styleId,
            variantId,
            lengthId: service === "hair" ? lengthId : null,
            estimate,
          },
        }),
      });
      if (!holdRes.ok) throw new Error("hold failed");
      const hold = await holdRes.json();

      // 3) stripe deposit
      const depositAmount = Math.max(Math.round(estimate * 0.2), 100);
      const sessionRes = await fetch(
        `${API_BASE}/payments/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            holdId: hold.holdId,
            amount: depositAmount,
            currency: "SEK",
            success_url: `${
              window.location.origin
            }/booking/success?holdId=${encodeURIComponent(hold.holdId)}`,
            cancel_url: `${
              window.location.origin
            }/booking/cancel?holdId=${encodeURIComponent(hold.holdId)}`,
          }),
        }
      );
      if (!sessionRes.ok) throw new Error("session failed");
      const session = await sessionRes.json();
      if (session.url) {
        window.location.assign(session.url);
        return;
      }
      throw new Error("missing session url");
    } catch (err) {
      console.error(err);
      setOk("failed");
    } finally {
      setSubmitting(false);
    }
  };

  const gallery = [
    { src: "/images/nailsDesigns12.jpg", title: t("gallery.pearlOmbre") },
    { src: "/images/nailsDesigns13.jpg", title: t("gallery.classicFrench") },
    { src: "/images/nailsDesigns11.jpg", title: t("gallery.roseQuartz") },
    { src: "/images/nailsDesigns06.jpg", title: t("gallery.emeraldTips") },
    { src: "/images/nailsDesigns02.jpg", title: t("gallery.blushAlmond") },
    { src: "/images/nailsDesigns10.jpg", title: t("gallery.chromeShine") },
    { src: "/images/hairStyle02.png", title: t("gallery.knotlessMedium") },
    { src: "/images/hairStyle01.png", title: t("gallery.cornrowsFeedIn") },
    { src: "/images/hairStyle03.png", title: t("gallery.boxSmall") },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-12">
      {/* Hero */}
      <section className="relative rounded-2xl overflow-hidden shadow">
        <div className="h-72 sm:h-96 w-full">
          <img
            src="/images/hairNailsArtisans.png"
            alt={t("hero.alt")}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="p-6 sm:p-10 text-white">
            <h1 className="text-2xl sm:text-4xl font-bold">
              {t("hero.title")}
            </h1>
            <p className="mt-2 text-sm sm:text-base max-w-2xl">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Booking + Contact */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold mb-2">{t("booking.heading")}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {t("booking.lead")}
          </p>

          {/* Calendar */}
          <div className="mb-6">
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
              {days.map((d) => {
                const key = fmtDateKey(d);
                const active = key === fmtDateKey(selectedDate);
                const disabled = isFullyBooked(d);
                return (
                  <button
                    key={key}
                    onClick={() => !disabled && setSelectedDate(d)}
                    disabled={disabled}
                    className={`px-2 py-3 rounded-lg border text-sm ${
                      disabled
                        ? "cursor-not-allowed border-blue-600 bg-blue-100 text-blue-700"
                        : active
                        ? "border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    aria-pressed={active}
                  >
                    {fmt(d)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map((slot) => {
                const busy =
                  isBusy(selectedDate, slot) || isFullyBooked(selectedDate);
                const active = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    disabled={busy}
                    onClick={() => setSelectedTime(slot)}
                    className={`px-3 py-2 rounded-lg text-sm border ${
                      busy
                        ? "cursor-not-allowed border-blue-600 bg-blue-100 text-blue-700"
                        : active
                        ? "border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    aria-pressed={active}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">{t("booking.note")}</p>
          </div>

          {/* Quick contact */}
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <a
              href="tel:+46700711713"
              className="px-3 py-2 rounded-md border border-green-600 text-green-700 hover:bg-green-50"
            >
              {t("contact.call")} +46 70 071 1713
            </a>
            <a
              href="https://wa.me/46700711713"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-md border border-green-600 text-green-700 hover:bg-green-50"
            >
              WhatsApp: +46 70 071 1713
            </a>
            <a
              href="mailto:support@tropinord.com"
              className="px-3 py-2 rounded-md border border-green-600 text-green-700 hover:bg-green-50"
            >
              support@tropinord.com
            </a>
          </div>

          {/* Primary CTA (opens modal) */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button
              type="button"
              onClick={() => {
                if (!canOpenModal) return;
                setOpen(true);
                setStep(1);
              }}
              disabled={!canOpenModal}
              aria-disabled={!canOpenModal}
              className={`bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition ${
                !canOpenModal ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {t("cta.primary")}
            </button>

            <span className="text-sm">
              {t("cta.secondaryPrefix")}{" "}
              <a
                href="mailto:support@tropinord.com?subject=Personal%20Consultation"
                className="underline text-green-700"
              >
                {t("cta.secondaryLink")}
              </a>
              .
            </span>
          </div>

          {ok === "reserved" && (
            <p className="mt-3 text-green-700">{t("booking.success")}</p>
          )}
          {ok === "failed" && (
            <p className="mt-3 text-red-600">{t("booking.error")}</p>
          )}
        </div>

        {/* Contact Card */}
        <aside className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
          <h3 className="text-lg font-semibold mb-2">{t("contact.heading")}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {t("contact.copy")}
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>{t("contact.phone")}:</strong>{" "}
              <a className="underline" href="tel:+46700711713">
                +46 70 071 1713
              </a>
            </li>
            <li>
              <strong>WhatsApp:</strong>{" "}
              <a
                className="underline"
                href="https://wa.me/46700711713"
                target="_blank"
                rel="noopener noreferrer"
              >
                +46 70 071 1713
              </a>
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <a className="underline" href="mailto:support@tropinord.com">
                support@tropinord.com
              </a>
            </li>
          </ul>
        </aside>
      </section>

      {/* Gallery */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t("gallery.heading")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {[
            {
              src: "/images/nailsDesigns12.jpg",
              title: t("gallery.pearlOmbre"),
            },
            {
              src: "/images/nailsDesigns13.jpg",
              title: t("gallery.classicFrench"),
            },
            {
              src: "/images/nailsDesigns11.jpg",
              title: t("gallery.roseQuartz"),
            },
            {
              src: "/images/nailsDesigns06.jpg",
              title: t("gallery.emeraldTips"),
            },
            {
              src: "/images/nailsDesigns02.jpg",
              title: t("gallery.blushAlmond"),
            },
            {
              src: "/images/nailsDesigns10.jpg",
              title: t("gallery.chromeShine"),
            },
            {
              src: "/images/hairStyle02.png",
              title: t("gallery.knotlessMedium"),
            },
            {
              src: "/images/hairStyle01.png",
              title: t("gallery.cornrowsFeedIn"),
            },
            { src: "/images/hairStyle03.png", title: t("gallery.boxSmall") },
          ].map((g, i) => (
            <figure
              key={i}
              className="rounded-xl overflow-hidden shadow bg-gray-100 dark:bg-gray-800"
            >
              <div className="h-56 w-full overflow-hidden">
                <img
                  src={g.src}
                  alt={g.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <figcaption className="p-3 text-sm font-medium">
                {g.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Two-step modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold">
                {step === 1 ? t("modal.step1Title") : t("modal.step2Title")}
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {step === 1 && (
              <div className="p-4 space-y-6">
                {/* Service */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("modal.service")}
                  </label>
                  <div className="flex gap-2">
                    {["hair", "nails"].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setService(s);
                          setStyleId("");
                          setVariantId("");
                          setLengthId("");
                        }}
                        className={`px-3 py-2 rounded border ${
                          service === s
                            ? "border-green-600 bg-green-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {t(SERVICES[s].labelKey)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Styles */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("modal.style")}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentService.styles.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          setStyleId(st.id);
                          setVariantId("");
                          setLengthId("");
                        }}
                        className={`p-3 rounded border text-left ${
                          styleId === st.id
                            ? "border-green-600 bg-green-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {t(st.nameKey)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variants */}
                {currentStyle && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("modal.sizeOrType")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {currentStyle.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setVariantId(v.id)}
                          className={`px-3 py-2 rounded border ${
                            variantId === v.id
                              ? "border-green-600 bg-green-50"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {t(v.labelKey)} • {t("currency", { value: v.price })}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Length (hair only) */}
                {currentStyle?.length && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("modal.length")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {currentStyle.length.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => setLengthId(l.id)}
                          className={`px-3 py-2 rounded border ${
                            lengthId === l.id
                              ? "border-green-600 bg-green-50"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {t(l.labelKey)}{" "}
                          {l.add ? `+ ${t("currency", { value: l.add })}` : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary + continue */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <div>
                      {t("modal.selectedService")}:{" "}
                      <strong>{t(SERVICES[service].labelKey)}</strong>
                    </div>
                    {currentStyle && (
                      <div>
                        {t("modal.selectedStyle")}:{" "}
                        <strong>{t(currentStyle.nameKey)}</strong>
                      </div>
                    )}
                    {currentVariant && (
                      <div>
                        {t("modal.selectedVariant")}:{" "}
                        <strong>{t(currentVariant.labelKey)}</strong>
                      </div>
                    )}
                    {service === "hair" && currentLength && (
                      <div>
                        {t("modal.selectedLength")}:{" "}
                        <strong>{t(currentLength.labelKey)}</strong>
                      </div>
                    )}
                    <div className="mt-1">
                      {t("modal.estimate")}:{" "}
                      <strong>{t("currency", { value: estimate })}</strong>
                    </div>
                  </div>

                  {/* ⬇️ changed to native button to guarantee click works */}
                  <button
                    type="button"
                    disabled={!canContinueStep1}
                    onClick={() => setStep(2)}
                    className={`bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg ${
                      !canContinueStep1 ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {t("modal.continue")}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={onSubmit} className="p-4 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("modal.step2Lead")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    className="p-2 border rounded-md dark:bg-gray-900"
                    placeholder={t("modal.yourName")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <input
                    className="p-2 border rounded-md dark:bg-gray-900"
                    type="tel"
                    placeholder={t("modal.phone")}
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                  />
                  <input
                    className="p-2 border rounded-md dark:bg-gray-900"
                    type="email"
                    placeholder={t("modal.emailOptional")}
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                  <input
                    className="p-2 border rounded-md dark:bg-gray-900"
                    placeholder={t("modal.messageOptional")}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="underline"
                  >
                    {t("modal.back")}
                  </button>
                  <Button
                    disabled={!canSubmit || submitting}
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                  >
                    {submitting
                      ? t("modal.submitting")
                      : t("modal.confirmReserve")}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
