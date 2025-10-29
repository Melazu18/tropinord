import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LeaveReview from "../components/LeaveReview";

export default function ReviewPage() {
  const { t } = useTranslation("review");
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const email = searchParams.get("email");

  if (!orderId || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">
          ❌{" "}
          {t(
            "missingOrder",
            "Missing order information. Cannot leave a review."
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <LeaveReview productId={productId} orderId={orderId} email={email} />
    </div>
  );
}
