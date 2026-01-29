// src/components/artisan/ApplicationStatus.jsx
import React, { useState, useEffect } from "react";
import { artisanAPI } from "../../services/api";
import { useTranslation } from "react-i18next";
import { getLocalizedPath } from "../../utils/getLocalizedPath";

const ApplicationStatus = () => {
  const { t, i18n } = useTranslation(["artisan", "buttons"]);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const lang = (i18n?.language || "en").slice(0, 2);
  const go = (routeKey) => {
    window.location.href = getLocalizedPath(routeKey, lang);
  };

  useEffect(() => {
    loadApplicationStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadApplicationStatus = async () => {
    try {
      const response = await artisanAPI.getStatus();
      setApplication(response.data.application);
    } catch (err) {
      if (err.response?.status === 404) {
        setApplication(null); // No application found
      } else {
        setError(t("status.error", { ns: "artisan" }));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>{t("status.loading", { ns: "artisan" })}</div>;
  if (error) return <div className="error-message">{error}</div>;

  if (!application) {
    return (
      <div className="no-application">
        <h3>{t("status.noApplication", { ns: "artisan" })}</h3>
        <p>{t("status.notApplied", { ns: "artisan" })}</p>
        <button onClick={() => go("apply")}>
          {t("applyNow", { ns: "buttons" })}
        </button>
      </div>
    );
  }

  return (
    <div className="application-status">
      <h3>{t("apply.viewStatus", { ns: "artisan" })}</h3>

      <div className="status-card">
        <div
          className={`status-badge status-${String(
            application.status || ""
          ).toLowerCase()}`}
        >
          {t(`status.${String(application.status || "").toLowerCase()}`, {
            ns: "artisan",
          })}
        </div>

        <div className="application-details">
          <p>
            <strong>{t("status.businessName", { ns: "artisan" })}:</strong>{" "}
            {application.companyName}
          </p>
          <p>
            <strong>{t("apply.form.country", { ns: "artisan" })}:</strong>{" "}
            {application.country}
          </p>
          {application.website && (
            <p>
              <strong>{t("apply.form.website", { ns: "artisan" })}:</strong>{" "}
              <a
                href={application.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {application.website}
              </a>
            </p>
          )}
          <p>
            <strong>{t("apply.form.description", { ns: "artisan" })}:</strong>{" "}
            {application.description}
          </p>

          {application.productCategories &&
            application.productCategories.length > 0 && (
              <p>
                <strong>
                  {t("apply.form.productCategories", { ns: "artisan" })}:
                </strong>{" "}
                {application.productCategories.join(", ")}
              </p>
            )}

          <p>
            <strong>{t("status.appliedOn", { ns: "artisan" })}:</strong>{" "}
            {new Date(application.createdAt).toLocaleDateString()}
          </p>

          {application.reviewedAt && (
            <p>
              <strong>{t("status.reviewedOn", { ns: "artisan" })}:</strong>{" "}
              {new Date(application.reviewedAt).toLocaleDateString()}
            </p>
          )}

          {application.reviewNotes && (
            <p>
              <strong>{t("status.reviewNotes", { ns: "artisan" })}:</strong>{" "}
              {application.reviewNotes}
            </p>
          )}
        </div>
      </div>

      {application.status === "PENDING" && (
        <div className="pending-notice">
          <p>{t("status.pendingNotice", { ns: "artisan" })}</p>
        </div>
      )}

      {application.status === "REJECTED" && (
        <div className="rejected-notice">
          <p>{t("status.rejectedNotice", { ns: "artisan" })}</p>
          <button onClick={() => go("apply")}>
            {t("reapply", { ns: "buttons" })}
          </button>
        </div>
      )}

      {application.status === "APPROVED" && (
        <div className="approved-notice">
          <h4>{t("status.approvedNotice", { ns: "artisan" })}</h4>
          <p>{t("status.approvedMessage", { ns: "artisan" })}</p>
          <button onClick={() => go("dashboard")}>
            {t("goToDashboard", { ns: "buttons" })}
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;
