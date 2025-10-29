// src/pages/Privacy.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  // Using default namespace (common). Works with your current en/common.json.
  const { t } = useTranslation();

  // --- helpers --------------------------------------------------------------

  // normalize any value to an array so .map never crashes
  const toList = (val) => {
    if (Array.isArray(val)) return val;
    if (val && typeof val === "object") return Object.values(val);
    if (typeof val === "string" && val.trim()) return [val];
    return [];
  };

  // i18next returns the key itself when a key is missing; detect that and try fallback
  const pick = (key, fallbackKey) => {
    const primary = t(key, { returnObjects: true });
    if (primary !== key) return primary; // found
    const fallback = t(fallbackKey, { returnObjects: true });
    return fallback !== fallbackKey ? fallback : undefined;
  };

  // string getter with optional fallback and default
  const str = (key, fallbackKey, def = "") => {
    const v = t(key, { defaultValue: undefined });
    if (v !== undefined && v !== key) return v;
    const f = t(fallbackKey, { defaultValue: undefined });
    if (f !== undefined && f !== fallbackKey) return f;
    return def;
  };

  // array getter with fallback
  const arr = (key, fallbackKey) => toList(pick(key, fallbackKey));

  // --- content reads (supports BOTH old/new structures) ---------------------

  const title = str("privacy.title", "", "Privacy Policy");
  const effectiveDate = str("privacy.effectiveDate", "privacy.lastUpdated", "");

  // Section 1 – collection
  const section1Title = str(
    "privacy.section1.title",
    "privacy.collectionTitle"
  );
  const section1Items = arr("privacy.section1.items", "privacy.infoCollected");

  // Section 2 – usage
  const section2Title = str("privacy.section2.title", "privacy.usageTitle");
  const section2Uses = arr("privacy.section2.uses", "privacy.infoUsage");

  // Section 3 – cookies/tracking
  const section3Title = str("privacy.section3.title", "privacy.cookiesTitle");
  const section3Desc = str(
    "privacy.section3.description",
    "privacy.cookiesIntro"
  );

  // Section 4 – sharing
  const section4Title = str("privacy.section4.title", "privacy.sharingTitle");
  const section4Desc = str(
    "privacy.section4.description",
    "privacy.sharingIntro"
  );

  // Section 5 – rights
  const section5Title = str("privacy.section5.title", "privacy.rightsTitle");
  const section5Intro = str("privacy.section5.intro", "privacy.rightsIntro");
  const section5Rights = arr("privacy.section5.rights", "privacy.dataRights");
  const section5Contact = str("privacy.section5.contact", "privacy.contact");

  // Section 6 – security
  const section6Title = str("privacy.section6.title", "privacy.securityTitle");
  const section6Desc = str(
    "privacy.section6.description",
    "privacy.securityIntro"
  );

  // Section 7 – transfers
  const section7Title = str("privacy.section7.title", "privacy.transfersTitle");
  const section7Desc = str(
    "privacy.section7.description",
    "privacy.transfersIntro"
  );

  // Section 8 – changes
  const section8Title = str("privacy.section8.title", "privacy.changesTitle");
  const section8Desc = str(
    "privacy.section8.description",
    "privacy.changesIntro"
  );

  // Section 9 – contact (HTML allowed)
  const section9Title = str("privacy.section9.title", "privacy.contactTitle");
  const section9ContactHtml = str(
    "privacy.section9.contact",
    "privacy.contactHtml"
  );

  // --- render ---------------------------------------------------------------

  return (
    <main className="pt-36 px-4 pb-8 max-w-5xl mx-auto text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-6">
        {title}
      </h1>

      {effectiveDate && (
        <p className="mb-8 text-gray-600 dark:text-gray-300">{effectiveDate}</p>
      )}

      {/* Section 1 */}
      {(section1Title || section1Items.length > 0) && (
        <section className="mb-8">
          {section1Title && (
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
              {section1Title}
            </h2>
          )}
          {section1Items.length > 0 && (
            <ul className="list-disc list-inside space-y-2">
              {section1Items.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Section 2 */}
      {(section2Title || section2Uses.length > 0) && (
        <section className="mb-8">
          {section2Title && (
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
              {section2Title}
            </h2>
          )}
          {section2Uses.length > 0 && (
            <ul className="list-disc list-inside space-y-2">
              {section2Uses.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Section 3 */}
      {(section3Title || section3Desc) && (
        <section className="mb-8">
          {section3Title && (
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
              {section3Title}
            </h2>
          )}
          {section3Desc && <p>{section3Desc}</p>}
        </section>
      )}

      {/* Section 4 */}
      {(section4Title || section4Desc) && (
        <section className="mb-8">
          {section4Title && (
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
              {section4Title}
            </h2>
          )}
          {section4Desc && <p>{section4Desc}</p>}
        </section>
      )}

      {/* Section 5 */}
      {(section5Title ||
        section5Intro ||
        section5Rights.length > 0 ||
        section5Contact) && (
        <section className="mb-8">
          {section5Title && (
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
              {section5Title}
            </h2>
          )}
          {section5Intro && <p className="mb-4">{section5Intro}</p>}
          {section5Rights.length > 0 && (
            <ul className="list-disc list-inside space-y-2">
              {section5Rights.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          )}
          {section5Contact && <p className="mt-4">{section5Contact}</p>}
        </section>
      )}

      {/* Section 6 */}
      {(section6Title || section6Desc) && (
        <section className="mb-8">
          {section6Title && (
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
              {section6Title}
            </h2>
          )}
          {section6Desc && <p>{section6Desc}</p>}
        </section>
      )}

      {/* Section 7 */}
      {(section7Title || section7Desc) && (
        <section className="mb-8">
          {section7Title && (
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
              {section7Title}
            </h2>
          )}
          {section7Desc && <p>{section7Desc}</p>}
        </section>
      )}

      {/* Section 8 */}
      {(section8Title || section8Desc) && (
        <section className="mb-8">
          {section8Title && (
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
              {section8Title}
            </h2>
          )}
          {section8Desc && <p>{section8Desc}</p>}
        </section>
      )}

      {/* Section 9 */}
      {(section9Title || section9ContactHtml) && (
        <section>
          {section9Title && (
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
              {section9Title}
            </h2>
          )}
          {section9ContactHtml && (
            <p dangerouslySetInnerHTML={{ __html: section9ContactHtml }} />
          )}
        </section>
      )}
    </main>
  );
};

export default PrivacyPolicy;
