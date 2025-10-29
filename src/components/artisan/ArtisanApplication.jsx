// src/components/artisan/ArtisanApplication.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ProductCategories from "./ProductCategories";
import SubscribeToggles from "../account/SubscribeToggles";
import { sellersAPI } from "../../services/api";
import { COUNTRIES_BY_CONTINENT } from "../../data/countriesByContinent";

// ✅ If the image is in /public/images:
const ARTISAN_LOGO = "/images/artisanLogo.png";
// If instead it lives in src/assets/...:
// import ARTISAN_LOGO from "../../assets/artisanLogo.png";

const SKILL_LEVELS = ["BEGINNER", "INTERMEDIATE", "PROFESSIONAL"];
const CRAFT_FREQ = [
  "WEEKLY",
  "BIWEEKLY",
  "MONTHLY",
  "TWO_MONTHS",
  "QUARTERLY",
  "SEMI_ANNUAL",
  "YEARLY",
];

const ArtisanApplication = ({ onSuccess }) => {
  const { t: tArtisan } = useTranslation("artisan");
  const { t: tButtons } = useTranslation("buttons");

  const [formData, setFormData] = useState({
    type: "ARTISAN", // ARTISAN | SELLER
    companyName: "",
    website: "",
    country: "",
    description: "",
    productCategories: [],
    skillLevel: "BEGINNER", // artisan only
    craftFrequency: "MONTHLY", // artisan only
    dateOfBirth: "", // YYYY-MM-DD
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isArtisan = useMemo(() => formData.type === "ARTISAN", [formData.type]);

  const upd = (key, val) =>
    setFormData((prev) => ({
      ...prev,
      [key]: val,
    }));

  const toggleCategory = (cat) => {
    setFormData((prev) => ({
      ...prev,
      productCategories: prev.productCategories.includes(cat)
        ? prev.productCategories.filter((c) => c !== cat)
        : [...prev.productCategories, cat],
    }));
  };

  const getAge = (isoDate) => {
    if (!isoDate) return null;
    const today = new Date();
    const dob = new Date(isoDate);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Age validation (≤ 20)
    const age = getAge(formData.dateOfBirth);
    if (age == null || Number.isNaN(age)) {
      setError(
        tArtisan("apply.form.errors.dobRequired", {
          defaultValue: "Please enter your date of birth.",
        })
      );
      return;
    }
    if (age > 20) {
      setError(
        tArtisan("apply.form.errors.ageLimit", {
          defaultValue:
            "Sorry, this program is limited to applicants aged 20 or under.",
        })
      );
      return;
    }

    if (formData.productCategories.length === 0) {
      setError(
        tArtisan("apply.form.errors.categoriesRequired", {
          defaultValue: "Please select at least one product category.",
        })
      );
      return;
    }

    setLoading(true);
    try {
      // Only send artisan-only fields when type = SELLER
      const payload = { ...formData };
      if (!isArtisan) {
        delete payload.skillLevel;
        delete payload.craftFrequency;
      }

      const res = await sellersAPI.apply(payload);
      onSuccess?.(res.data);
    } catch (err) {
      const apiErr =
        err?.response?.data?.error ||
        err?.message ||
        tArtisan("apply.error", {
          defaultValue: "Failed to submit application.",
        });
      setError(
        typeof apiErr === "string"
          ? apiErr
          : tArtisan("apply.error", { defaultValue: "Submission error." })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="artisan-application max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      {/* Top-centre logo */}
      <div className="w-full flex items-center justify-center pt-2">
        <img
          src={ARTISAN_LOGO}
          alt="Artisan"
          className="mx-auto mb-4 h-16 w-auto md:h-20 drop-shadow"
          loading="eager"
          decoding="async"
        />
      </div>

      <h2 className="text-2xl font-bold mb-2">{tArtisan("apply.title")}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        {tArtisan("apply.subtitle", {
          defaultValue:
            "All approved users appear with an anonymous display name under their profile photo.",
        })}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {tArtisan("apply.form.typeLabel", {
              defaultValue: "I am applying as *",
            })}
          </label>
          <select
            value={formData.type}
            onChange={(e) => upd("type", e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
            disabled={loading}
          >
            <option value="ARTISAN">
              {tArtisan("apply.form.type.artisan", { defaultValue: "Artisan" })}
            </option>
            <option value="SELLER">
              {tArtisan("apply.form.type.seller", {
                defaultValue: "Seller / Marketer",
              })}
            </option>
          </select>
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {tArtisan("apply.form.companyName")} *
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => upd("companyName", e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
            required
            minLength={2}
            placeholder={tArtisan("apply.form.placeholder.companyName")}
            disabled={loading}
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {tArtisan("apply.form.website")}
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => upd("website", e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
            placeholder={tArtisan("apply.form.placeholder.website")}
            disabled={loading}
          />
        </div>

        {/* Country (grouped by continent) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {tArtisan("apply.form.country")} *
          </label>
          <select
            value={formData.country}
            onChange={(e) => upd("country", e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
            required
            aria-label={tArtisan("apply.form.country")}
            disabled={loading}
          >
            <option value="" disabled>
              —{" "}
              {tArtisan("apply.form.placeholder.country", {
                defaultValue: "Select country",
              })}
              —
            </option>
            {Object.entries(COUNTRIES_BY_CONTINENT).map(
              ([continent, countries]) => (
                <optgroup key={continent} label={continent}>
                  {countries.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </optgroup>
              )
            )}
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {tArtisan("apply.form.dob", { defaultValue: "Date of Birth" })} *
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => upd("dateOfBirth", e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
            required
            disabled={loading}
            max={new Date().toISOString().slice(0, 10)} // no future dates
          />
          <p className="text-xs text-gray-500 mt-1">
            {tArtisan("apply.form.dobHint", {
              defaultValue:
                "Applicants must be 20 or under at time of application.",
            })}
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {tArtisan("apply.form.description")} *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => upd("description", e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
            required
            minLength={50}
            placeholder={tArtisan("apply.form.placeholder.description")}
            rows={4}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            {tArtisan("apply.form.descriptionHint")}
          </p>
        </div>

        {/* Artisan-only fields */}
        {isArtisan && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skill level */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {tArtisan("apply.form.skillLevelLabel", {
                  defaultValue: "Skill level *",
                })}
              </label>
              <select
                value={formData.skillLevel}
                onChange={(e) => upd("skillLevel", e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
                disabled={loading}
              >
                {SKILL_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {tArtisan(`apply.form.skill.${lvl.toLowerCase()}`, {
                      defaultValue: lvl,
                    })}
                  </option>
                ))}
              </select>
              <p className="text-xs mt-1 text-gray-500">
                {tArtisan("apply.form.skillHint", {
                  defaultValue: "Higher level can unlock premium pricing.",
                })}
              </p>
            </div>

            {/* Craft frequency */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {tArtisan("apply.form.craftFrequencyLabel", {
                  defaultValue: "Craft frequency *",
                })}
              </label>
              <select
                value={formData.craftFrequency}
                onChange={(e) => upd("craftFrequency", e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
                disabled={loading}
              >
                {CRAFT_FREQ.map((f) => (
                  <option key={f} value={f}>
                    {tArtisan(`apply.form.freq.${f.toLowerCase()}`, {
                      defaultValue: f.replace("_", " "),
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Product Categories */}
        <ProductCategories
          selectedCategories={formData.productCategories}
          onCategoryChange={toggleCategory}
        />

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-md disabled:opacity-50"
        >
          {loading ? tButtons("submitting") : tButtons("submitApplication")}
        </button>

        {/* Small note about anonymity */}
        <p className="text-xs text-gray-500 mt-3">
          {tArtisan("apply.form.anonNote", {
            defaultValue:
              "Note: Your public profile will show an anonymous display name after approval.",
          })}
        </p>
      </form>

      {/* Subscriptions */}
      <div className="mt-8">
        <SubscribeToggles />
      </div>

      {/* Guidelines */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
        <h3 className="font-medium mb-2">
          {tArtisan("apply.guidelines.title")}
        </h3>
        <ul className="text-sm space-y-1">
          <li>• {tArtisan("apply.guidelines.quality")}</li>
          <li>• {tArtisan("apply.guidelines.originality")}</li>
          <li>• {tArtisan("apply.guidelines.description")}</li>
          <li>• {tArtisan("apply.guidelines.categories")}</li>
        </ul>
      </div>
    </div>
  );
};

export default ArtisanApplication;
