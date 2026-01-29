// src/pages/PaymentPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../utils/api";
import { routeMap } from "../routes/routeMap";
import { getRecaptchaToken } from "../utils/recaptcha";
import { useCurrency } from "../shared/ui/CurrencyProvider";

// ✅ PayPal
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// ✅ PayPal client id from Vite env
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";

// Custom SVG Icons as fallback
const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const CopyIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
);

// Image-based icon components with full white space coverage
const StripeLogo = () => (
  <div className="relative w-14 h-14 flex items-center justify-center bg-white rounded-xl overflow-hidden">
    <img
      src="/images/stripeLogo1.png"
      alt="Stripe"
      className="w-full h-full object-contain p-2"
      onError={(e) => {
        e.target.style.display = "none";
        e.target.parentElement.innerHTML = `
          <svg class="w-full h-full p-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.713 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.002z"/>
          </svg>
        `;
      }}
    />
  </div>
);

// UPDATED: allow sizing via className, default remains w-14 h-14 (no functionality change)
const SwishLogo = ({ className = "w-14 h-14" }) => (
  <div
    className={`relative ${className} flex items-center justify-center bg-white rounded-full overflow-hidden`}
  >
    <img
      src="/images/swishLogo11.png"
      alt="Swish"
      className="w-full h-full object-contain"
      onError={(e) => {
        e.target.style.display = "none";
        e.target.parentElement.innerHTML = `
          <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#D4AF37"/>
            <rect x="6.5" y="6.5" width="11" height="11" rx="1" fill="white"/>
            <rect x="9" y="10" width="2" height="4" fill="#D4AF37" rx="0.5"/>
            <rect x="13" y="10" width="2" height="4" fill="#D4AF37" rx="0.5"/>
          </svg>
        `;
      }}
    />
  </div>
);

const PayPalLogo = () => (
  <div className="relative w-14 h-14 flex items-center justify-center bg-white rounded-xl overflow-hidden">
    <img
      src="/images/paypal011.jpeg"
      alt="PayPal"
      className="w-full h-full object-contain p-2"
      onError={(e) => {
        e.target.style.display = "none";
        e.target.parentElement.innerHTML = `
          <svg class="w-full h-full p-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.5 20.5H5.2a.8.8 0 0 1-.8-.95L6.7 4.2A1.6 1.6 0 0 1 8.27 2.8h6.2c3.45 0 5.53 1.6 5.53 4.58 0 3.8-2.63 6.1-6.84 6.1h-2.2l-.63 4.2a1.6 1.6 0 0 1-1.58 1.36H8.4l-.44 2.96c-.06.33-.35.5-.46.5z"/>
          </svg>
        `;
      }}
    />
  </div>
);

export default function PaymentPage() {
  const { t, i18n } = useTranslation(["order", "products", "payment"]);
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isPaymentStarted, setIsPaymentStarted] = useState(false);
  const [formData, setFormData] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const [manualMethod, setManualMethod] = useState(null);
  const [showManual, setShowManual] = useState(false);

  // PayPal UI state
  const [paypalBusy, setPaypalBusy] = useState(false);

  // Swish verification state
  const [swishPaymentStatus, setSwishPaymentStatus] = useState("pending");
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [qrError, setQrError] = useState(false);
  const [swishDeeplink, setSwishDeeplink] = useState("");
  const [qrPayloadDebug, setQrPayloadDebug] = useState("");
  const verificationInterval = useRef(null);

  const swishNumber = import.meta.env.VITE_SWISH_NUMBER || "1230558973";

  const { currency, priceFor, format, convert } = useCurrency();

  // Load data from storage
  const loadStateFromStorage = () => {
    const savedFormData = JSON.parse(
      localStorage.getItem("checkout-form") || "{}",
    );
    const initialFormData = location.state || savedFormData;
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

    const totalSek = cartItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
      0,
    );

    setFormData(initialFormData);
    setCart(cartItems);
    setCartTotal(totalSek);

    setTimeout(() => {
      validateData(initialFormData, cartItems);
    }, 0);
  };

  useEffect(() => {
    loadStateFromStorage();
  }, []);

  useEffect(() => {
    loadStateFromStorage();
  }, [i18n.language]);

  const validateData = (data, cartItems) => {
    const requiredFields = [
      "name",
      "email",
      "phone",
      "street",
      "postal",
      "city",
      "country",
    ];
    const missing = requiredFields.filter((f) => !data?.[f]);

    if (missing.length > 0) {
      toast.error(t("payment.missingFields", { fields: missing.join(", ") }));
      return false;
    }
    if (!Array.isArray(cartItems)) {
      toast.error(
        t("payment.cartError", { defaultValue: "Failed to load your cart" }),
      );
      return false;
    }
    if (cartItems.length === 0) {
      toast.error(
        t("payment.cartEmpty", {
          defaultValue: "Your cart is empty. Please go back and add items.",
        }),
      );
      return false;
    }
    return true;
  };

  const goToThankYouAfterManual = () => {
    const amountInSek = cartTotal.toFixed(2);
    const lang = (i18n.language || "en").slice(0, 2);
    const thankYou = `/${lang}/${routeMap.thankYou[lang]}`;
    navigate(
      `${thankYou}?method=${manualMethod}&reference=${encodeURIComponent(
        formData.email,
      )}&amount=${amountInSek}`,
    );
  };

  // Verify Swish payment with better error handling
  const verifySwishPayment = async () => {
    if (!formData?.email || !cartTotal) return;

    try {
      setSwishPaymentStatus("verifying");

      const response = await fetch(`${API_BASE}/verify-swish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference: formData.email,
          amount: cartTotal.toFixed(2),
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
        }),
      });

      // Always try to parse the response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.warn("Failed to parse response:", parseError);
        data = { ok: false, verified: false };
      }

      if (data.ok && data.verified) {
        // Payment verified!
        setSwishPaymentStatus("paid");

        if (verificationInterval.current) {
          clearInterval(verificationInterval.current);
        }

        // Navigate to thank you page
        setTimeout(() => {
          goToThankYouAfterManual();
        }, 1500);
      } else if (data.ok && !data.verified) {
        // Still pending
        setSwishPaymentStatus("pending");
        setVerificationAttempts((prev) => prev + 1);

        if (verificationAttempts > 10) {
          setSwishPaymentStatus("timeout");
          if (verificationInterval.current) {
            clearInterval(verificationInterval.current);
          }
        }
      } else {
        // API error
        console.warn("Verification API error:", data?.error);
        setSwishPaymentStatus("pending");
        setVerificationAttempts((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setSwishPaymentStatus("pending");

      // Don't stop polling on network errors
      if (verificationAttempts > 15) {
        setSwishPaymentStatus("timeout");
        if (verificationInterval.current) {
          clearInterval(verificationInterval.current);
        }
      }
    }
  };

  // Swish QR lock mask: 0 = fields locked (recommended for fixed payee/amount/message)
  const SWISH_LOCK_MASK = 0;

  // Fetch Swish deeplink + QR payload from backend (keeps mobile link consistent with QR)
  useEffect(() => {
    const fetchSwishDebug = async () => {
      if (!showManual || manualMethod !== "swish") return;
      if (!formData?.email || !cartTotal) return;

      try {
        const amount = cartTotal.toFixed(2);
        const reference = formData.email;

        const url = `${API_BASE}/qr?amount=${encodeURIComponent(
          amount,
        )}&reference=${encodeURIComponent(
          reference,
        )}&lockMask=${SWISH_LOCK_MASK}&debug=true`;

        const r = await fetch(url);
        const j = await r.json();

        if (j?.deeplink) setSwishDeeplink(j.deeplink);
        if (j?.qrData) setQrPayloadDebug(j.qrData);
      } catch (e) {
        console.warn("Failed to fetch Swish debug payload:", e);
      }
    };

    fetchSwishDebug();
  }, [showManual, manualMethod, formData?.email, cartTotal]);

  // Fallback deeplink (client-side) if backend debug endpoint isn't reachable
  const generateFallbackDeeplink = () => {
    const amount = cartTotal.toFixed(2);
    const reference = formData?.email || "";

    // NOTE: Deeplink formats vary; this matches your previous implementation
    const swishData = {
      payee: swishNumber.replace(/\D/g, ""),
      amount: Math.round(parseFloat(amount) * 100),
      message: reference.substring(0, 50),
      currency: "SEK",
    };

    const encodedData = btoa(JSON.stringify(swishData));
    return `swish://payment?data=${encodeURIComponent(encodedData)}`;
  };

  // Handle mobile deeplink click with fallback
  const handleOpenSwish = () => {
    const deeplink = swishDeeplink || generateFallbackDeeplink();

    // Try to open Swish app
    window.location.href = deeplink;

    // Fallback: if user stays on page, send to store
    setTimeout(() => {
      if (!document.hidden) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);

        if (isIOS) {
          window.location.href =
            "https://apps.apple.com/se/app/swish/id725347659";
        } else if (isAndroid) {
          window.location.href =
            "https://play.google.com/store/apps/details?id=se.bankgirot.swish";
        }
      }
    }, 1000);
  };

  // Copy to clipboard helper
  const copyToClipboard = (text, label) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${label} copied to clipboard`);
      })
      .catch((err) => {
        console.error("Copy failed:", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  const handlePayment = async (method = "stripe") => {
    if (isPaymentStarted) return;
    setIsPaymentStarted(true);
    setLoading(true);

    if (!validateData(formData, cart)) {
      setLoading(false);
      setIsPaymentStarted(false);
      return;
    }

    // Manual methods
    if (method === "swish") {
      setManualMethod(method);
      setShowManual(true);
      setLoading(false);
      setIsPaymentStarted(false);

      // Start verification polling for Swish
      setSwishPaymentStatus("pending");
      setVerificationAttempts(0);

      // Clear any existing interval
      if (verificationInterval.current) {
        clearInterval(verificationInterval.current);
      }

      // Start polling every 10 seconds
      verificationInterval.current = setInterval(() => {
        verifySwishPayment();
      }, 10000);

      // First check immediately
      setTimeout(() => verifySwishPayment(), 1000);

      return;
    }

    // Stripe flow
    try {
      const token = await getRecaptchaToken("checkout");

      if (token) {
        const vr = await fetch(`${API_BASE}/recaptcha-verify`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ recaptchaToken: token, action: "checkout" }),
        });
        const vj = await vr.json();
        if (!vr.ok || vj?.ok !== true) {
          toast.error(
            vj?.error === "low_score"
              ? t("payment.recaptchaLowScore", {
                  defaultValue:
                    "reCAPTCHA flagged this as suspicious. Please try again.",
                })
              : t("payment.recaptchaFailed", {
                  defaultValue:
                    "reCAPTCHA verification failed. Reload and try again.",
                }),
          );
          setLoading(false);
          setIsPaymentStarted(false);
          return;
        }
      }

      const totalSek = cartTotal;
      const totalInCur = convert(cartTotal, currency);

      const response = await fetch(`${API_BASE}/create-checkout-session`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          currency: "SEK",
          items: cart,
          total: totalSek,
          chargeCurrency: currency,
          chargeAmount: totalInCur,
          paymentMethod: method,
          useStripe: true,
          locale: i18n.language?.startsWith("sv") ? "sv" : "en",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data?.details) {
          const names = data.details.map((d) => d.name || d.id).join(", ");
          toast.error(
            t("payment.itemsMissingPrices", {
              defaultValue: `Some items have no price: ${names}. Please update prices or use Swish.`,
            }),
          );
        } else {
          toast.error(
            data?.error ||
              t("payment.paymentFailed", { defaultValue: "Payment failed" }),
          );
        }
        setLoading(false);
        setIsPaymentStarted(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error(
          t("payment.sessionFailed", {
            defaultValue: "Payment session could not be started",
          }),
        );
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error(
        err.message ||
          t("payment.paymentError", {
            defaultValue: "Payment processing failed",
          }),
      );
    } finally {
      setLoading(false);
      setIsPaymentStarted(false);
    }
  };

  const getTranslatedLabel = (item) => {
    return item.slug
      ? t(`agro.items.${item.slug}.title`, {
          defaultValue: item.label || "Unnamed Product",
        })
      : t(`${item.id}.label`, {
          defaultValue: item.label || "Unnamed Product",
        });
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (verificationInterval.current) {
        clearInterval(verificationInterval.current);
      }
    };
  }, []);

  if (!formData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
        <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
          {t("payment.loadingPaymentDetails", {
            defaultValue: "Loading your payment details...",
          })}
        </p>
      </div>
    );
  }

  const amountDisplaySek = cartTotal.toFixed(2);
  const amountInCur = convert(cartTotal, currency);
  const reference = formData.email;
  const lang = (i18n.language || "en").slice(0, 2);
  const checkoutPath = `/${lang}/${routeMap.checkout[lang]}`;

  // Build correct QR code format for debugging
  const encodedMsg = encodeURIComponent(
    reference.substring(0, 50).replace(/;/g, ""),
  );
  const qrFormatDebug = `C${swishNumber};${amountDisplaySek.replace(
    ".",
    ",",
  )};${encodedMsg};${SWISH_LOCK_MASK}`;

  // Updated for golden palette
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800";
      case "verifying":
        return "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800";
      case "pending":
        return "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800";
      case "timeout":
        return "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border border-gray-200 dark:border-gray-700";
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border border-gray-200 dark:border-gray-700";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "paid":
        return "text-amber-800 dark:text-amber-300";
      case "verifying":
        return "text-yellow-800 dark:text-yellow-300";
      case "pending":
        return "text-amber-800 dark:text-amber-300";
      case "timeout":
        return "text-gray-800 dark:text-gray-300";
      default:
        return "text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckIcon />;
      case "verifying":
        return <LoadingSpinner />;
      case "pending":
        return <div className="w-3 h-3 bg-amber-500 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>;
    }
  };

  // ✅ PayPal SDK options (currency must match the buyer’s selected currency)
  const paypalOptions = {
    "client-id": PAYPAL_CLIENT_ID,
    currency: currency || "SEK",
    intent: "capture",
  };

  // ✅ Payload sent to backend so it can create/capture using cart + customer details
  const buildPayPalPayload = () => ({
    items: cart,
    currency: currency || "SEK",
    locale: i18n.language?.startsWith("sv") ? "sv" : "en",
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    street: formData.street,
    postal: formData.postal,
    city: formData.city,
    country: formData.country,
    // Optional (helpful for totals/validation on backend)
    baseCurrency: "SEK",
    baseTotal: cartTotal,
    displayTotal: amountInCur,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "dark:bg-gray-800 dark:text-white",
          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#333",
          },
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          {/* UPDATED: real card image (creditCard.png) + strip emoji from translation to avoid the missing-glyph box */}
          <div className="flex items-center justify-center gap-4">
            <img
              src="/images/creditCard.png"
              alt="Credit card"
              className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-sm select-none"
              draggable="false"
            />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t("payment.chooseMethod", {
                defaultValue: "Complete Your Payment",
              })
                .replace("💳", "")
                .trim()}
            </h1>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t("payment.selectPayment", {
              defaultValue: "Select your preferred payment method",
            })}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Order Summary */}
          {/* UPDATED: reorder when manual swish is active so the Swish card sits on the right side (and appears first on mobile) */}
          <div
            className={`md:col-span-2 ${
              showManual && manualMethod === "swish"
                ? "order-2 md:order-1"
                : "order-1"
            }`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Back Button */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => navigate(checkoutPath)}
                  className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors group"
                >
                  <BackArrowIcon />
                  {t("payment.backToCheckout", {
                    defaultValue: "Back to Checkout",
                  })}
                </button>
              </div>

              {/* Order Summary */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("payment.orderSummary", {
                      defaultValue: "Order Summary",
                    })}
                  </h2>
                  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm font-medium rounded-full">
                    {cart.length} {cart.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  {cart.map((item, idx) => {
                    const lineKey =
                      item._lineId ||
                      item.key ||
                      [
                        item.id,
                        item.variant,
                        item.size,
                        item.length,
                        item.option,
                        item.note,
                      ]
                        .filter(Boolean)
                        .join("|") ||
                      `${item.id || "item"}|${idx}`;

                    const qty = item.quantity || 1;
                    const unitCur = priceFor(item, currency);
                    const lineCur = unitCur * qty;
                    const productCode =
                      item.productCode ||
                      item.sku ||
                      item.id ||
                      `ITEM-${idx + 1}`;

                    return (
                      <div
                        key={lineKey}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 dark:text-green-300 font-semibold">
                              {qty}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-800 dark:text-gray-200 block">
                              {getTranslatedLabel(item)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Product Code: {productCode}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900 dark:text-white block">
                            {format(lineCur, currency)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {format(unitCur, currency)} each
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t("payment.total", { defaultValue: "Total Amount:" })}
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {format(amountInCur, currency)}
                      </div>
                      {currency !== "SEK" && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          ≈ {amountDisplaySek} SEK
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Info - Fixed for Dark Mode */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t("payment.shippingTo", {
                      defaultValue: "Shipping Information",
                    })}
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          Name
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white mt-1">
                          {formData.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          Email
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white mt-1">
                          {formData.email}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                          Address
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white mt-1">
                          {formData.street}, {formData.postal} {formData.city},{" "}
                          {formData.country}
                        </p>
                      </div>
                      {formData.phone && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                            Phone
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white mt-1">
                            {formData.phone}
                          </p>
                        </div>
                      )}
                      {formData.company && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                            Company
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white mt-1">
                            {formData.company}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods - Only show when not in manual mode */}
            {!showManual && (
              <div className="mt-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    {t("payment.selectPaymentMethod", {
                      defaultValue: "Select Payment Method",
                    })}
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Stripe Button */}
                    <button
                      onClick={() => handlePayment("stripe")}
                      className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                      disabled={loading || paypalBusy}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 flex items-center justify-center bg-white rounded-xl group-hover:scale-105 transition-transform">
                          <StripeLogo />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xl">
                            Credit / Debit Card
                          </div>
                          <div className="text-gray-300 mt-1">
                            Visa, Mastercard, American Express
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <LoadingSpinner />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <div className="text-sm px-4 py-2 bg-white/20 rounded-full font-medium">
                            Secure Payment
                          </div>
                        )}
                      </div>
                    </button>

                    {/* PayPal Block (Buttons render here) */}
                    <div className="p-6 bg-gradient-to-r from-[#003087] to-[#009cde] text-white rounded-xl shadow-lg border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 flex items-center justify-center bg-white rounded-xl">
                            <PayPalLogo />
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-xl">PayPal</div>
                            <div className="text-blue-100 mt-1">
                              Pay with PayPal (SEK / EUR / USD)
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm px-4 py-2 bg-white/20 rounded-full font-medium">
                            Buyer Protection
                          </div>
                        </div>
                      </div>

                      {!PAYPAL_CLIENT_ID ? (
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="font-semibold mb-1">
                            PayPal not configured
                          </div>
                          <div className="text-sm text-blue-100">
                            Set <code>VITE_PAYPAL_CLIENT_ID</code> in your
                            frontend .env and restart the dev server.
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl p-4">
                          <PayPalScriptProvider
                            options={paypalOptions}
                            // key forces PayPal SDK reload when currency changes
                            key={`${PAYPAL_CLIENT_ID}-${currency}`}
                          >
                            <PayPalButtons
                              style={{ layout: "vertical", shape: "pill" }}
                              disabled={loading}
                              forceReRender={[
                                currency,
                                cartTotal,
                                cart.length,
                                formData?.email,
                              ]}
                              onInit={() => setPaypalBusy(false)}
                              onClick={() => {
                                if (!validateData(formData, cart)) {
                                  throw new Error("Invalid checkout data");
                                }
                              }}
                              createOrder={async () => {
                                setPaypalBusy(true);
                                try {
                                  // (Optional) reCAPTCHA like Stripe (keeps abuse low)
                                  const token =
                                    await getRecaptchaToken("checkout");
                                  if (token) {
                                    const vr = await fetch(
                                      `${API_BASE}/recaptcha-verify`,
                                      {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                          "Content-Type": "application/json",
                                          Accept: "application/json",
                                        },
                                        body: JSON.stringify({
                                          recaptchaToken: token,
                                          action: "checkout",
                                        }),
                                      },
                                    );
                                    const vj = await vr.json();
                                    if (!vr.ok || vj?.ok !== true) {
                                      toast.error(
                                        vj?.error === "low_score"
                                          ? t("payment.recaptchaLowScore", {
                                              defaultValue:
                                                "reCAPTCHA flagged this as suspicious. Please try again.",
                                            })
                                          : t("payment.recaptchaFailed", {
                                              defaultValue:
                                                "reCAPTCHA verification failed. Reload and try again.",
                                            }),
                                      );
                                      throw new Error("recaptcha_failed");
                                    }
                                  }

                                  const r = await fetch(
                                    `${API_BASE}/paypal/create-order`,
                                    {
                                      method: "POST",
                                      credentials: "include",
                                      headers: {
                                        "Content-Type": "application/json",
                                        Accept: "application/json",
                                      },
                                      body: JSON.stringify(
                                        buildPayPalPayload(),
                                      ),
                                    },
                                  );
                                  const j = await r.json();
                                  if (!r.ok || !j?.id) {
                                    throw new Error(
                                      j?.error || "PayPal create-order failed",
                                    );
                                  }
                                  return j.id;
                                } finally {
                                  setPaypalBusy(false);
                                }
                              }}
                              onApprove={async (data) => {
                                setPaypalBusy(true);
                                try {
                                  const r = await fetch(
                                    `${API_BASE}/paypal/capture-order`,
                                    {
                                      method: "POST",
                                      credentials: "include",
                                      headers: {
                                        "Content-Type": "application/json",
                                        Accept: "application/json",
                                      },
                                      body: JSON.stringify({
                                        orderID: data.orderID,
                                        ...buildPayPalPayload(),
                                      }),
                                    },
                                  );
                                  const j = await r.json();
                                  if (!r.ok || !j?.ok) {
                                    throw new Error(
                                      j?.error || "PayPal capture failed",
                                    );
                                  }

                                  const lang2 = (i18n.language || "en").slice(
                                    0,
                                    2,
                                  );
                                  const thankYou = `/${lang2}/${routeMap.thankYou[lang2]}`;
                                  navigate(
                                    `${thankYou}?method=paypal&order_id=${encodeURIComponent(
                                      data.orderID,
                                    )}`,
                                  );
                                } catch (e) {
                                  console.error("PayPal approve error:", e);
                                  toast.error(
                                    e?.message ||
                                      t("payment.paymentFailed", {
                                        defaultValue: "Payment failed",
                                      }),
                                  );
                                } finally {
                                  setPaypalBusy(false);
                                }
                              }}
                              onCancel={() => {
                                toast(
                                  t("payment.paymentCancelled", {
                                    defaultValue: "Payment cancelled",
                                  }),
                                );
                              }}
                              onError={(err) => {
                                console.error("PayPal error:", err);
                                toast.error(
                                  t("payment.paymentError", {
                                    defaultValue: "PayPal payment error",
                                  }),
                                );
                              }}
                            />
                          </PayPalScriptProvider>
                        </div>
                      )}
                    </div>

                    {/* Swish Button */}
                    <button
                      onClick={() => handlePayment("swish")}
                      className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:via-amber-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                      disabled={loading || paypalBusy}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full group-hover:scale-105 transition-transform">
                          <SwishLogo />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xl">Swish</div>
                          <div className="text-yellow-100 mt-1">
                            Mobile payment (Sweden)
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <LoadingSpinner />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <div className="text-sm px-4 py-2 bg-white/20 rounded-full font-medium">
                            Fast & Secure
                          </div>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Security Badges */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          256-bit SSL Encryption
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          PCI DSS Compliant
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          No Card Data Stored
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Swish Manual Payment */}
          {showManual && manualMethod === "swish" && (
            <div
              className={`md:col-span-1 ${
                showManual && manualMethod === "swish"
                  ? "order-1 md:order-2"
                  : "order-2"
              }`}
            >
              <div className="bg-gradient-to-b from-amber-50 via-yellow-50 to-white dark:from-gray-900 dark:via-amber-900/10 dark:to-gray-800 rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800/30 sticky top-8 overflow-hidden">
                {/* Golden accent strip */}
                <div className="h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600"></div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-xl">
                      <SwishLogo className="w-20 h-20" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Swish Payment
                      </h3>
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Mobile payment method
                      </p>
                    </div>
                  </div>

                  {/* Payment Details Card */}
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4 mb-6 border border-amber-200 dark:border-amber-800/30">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          Amount:
                        </span>
                        <span className="font-bold text-lg text-amber-700 dark:text-amber-300">
                          {amountDisplaySek} SEK
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          To:
                        </span>
                        <span className="font-mono font-semibold text-amber-800 dark:text-amber-300">
                          {swishNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          Reference:
                        </span>
                        <div className="mt-1 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-amber-100 dark:border-amber-800/30">
                          <code className="font-mono text-sm break-all text-amber-900 dark:text-amber-200">
                            {reference}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-center">
                      Scan QR Code
                    </h4>
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="p-4 bg-white rounded-2xl shadow-lg border border-amber-200">
                          {!qrLoaded && !qrError && (
                            <div className="w-64 h-64 flex items-center justify-center">
                              <LoadingSpinner />
                            </div>
                          )}
                          {qrError ? (
                            <div className="w-64 h-64 flex items-center justify-center bg-amber-50 rounded-xl">
                              <div className="text-center">
                                <div className="text-red-600 font-medium mb-2">
                                  QR Error
                                </div>
                                <button
                                  onClick={() => {
                                    setQrLoaded(false);
                                    setQrError(false);
                                  }}
                                  className="text-sm text-amber-600 hover:underline"
                                >
                                  Retry
                                </button>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={`${API_BASE}/qr?amount=${amountDisplaySek}&reference=${encodeURIComponent(
                                reference,
                              )}&lockMask=${SWISH_LOCK_MASK}&t=${Date.now()}`}
                              alt={`Swish QR Code: ${amountDisplaySek} SEK to ${swishNumber}`}
                              className="w-64 h-64 rounded-lg"
                              onLoad={() => {
                                setQrLoaded(true);
                                setQrError(false);
                              }}
                              onError={() => {
                                setQrLoaded(true);
                                setQrError(true);
                              }}
                            />
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            LIVE
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-amber-600 dark:text-amber-400 mt-3">
                      Open Swish app and scan the code
                    </p>
                  </div>

                  {/* Open Swish Button */}
                  <button
                    onClick={handleOpenSwish}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-white font-bold rounded-xl hover:from-yellow-600 hover:via-amber-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl mb-4 group"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full overflow-hidden p-1 group-hover:scale-110 transition-transform">
                      <img
                        src="/images/swishLogo11.png"
                        alt="Swish"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `
                            <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="12" fill="#D4AF37"/>
                              <rect x="6.5" y="6.5" width="11" height="11" rx="1" fill="white"/>
                              <rect x="9" y="10" width="2" height="4" fill="#D4AF37" rx="0.5"/>
                              <rect x="13" y="10" width="2" height="4" fill="#D4AF37" rx="0.5"/>
                            </svg>
                          `;
                        }}
                      />
                    </div>
                    Open Swish App
                  </button>

                  {/* Payment Status */}
                  <div className="mb-6">
                    <div
                      className={`p-4 rounded-xl ${getStatusColor(
                        swishPaymentStatus,
                      )}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(swishPaymentStatus)}
                        <span
                          className={`font-medium ${getStatusTextColor(
                            swishPaymentStatus,
                          )}`}
                        >
                          {swishPaymentStatus === "paid" && "Payment Verified!"}
                          {swishPaymentStatus === "verifying" &&
                            "Verifying Payment..."}
                          {swishPaymentStatus === "pending" &&
                            "Waiting for Payment"}
                          {swishPaymentStatus === "timeout" &&
                            "Verification Taking Longer"}
                        </span>
                      </div>
                      <div className="w-full bg-white/30 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width:
                              swishPaymentStatus === "paid"
                                ? "100%"
                                : swishPaymentStatus === "verifying"
                                  ? "60%"
                                  : `${Math.min(
                                      verificationAttempts * 8,
                                      40,
                                    )}%`,
                            background:
                              swishPaymentStatus === "paid"
                                ? "linear-gradient(to right, #f59e0b, #d97706)"
                                : swishPaymentStatus === "verifying"
                                  ? "linear-gradient(to right, #fbbf24, #f59e0b)"
                                  : "linear-gradient(to right, #fbbf24, #f59e0b)",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Copy Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      onClick={() =>
                        copyToClipboard(swishNumber, "Swish number")
                      }
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-800/30 dark:hover:to-yellow-800/30 border border-amber-200 dark:border-amber-800/30 rounded-lg transition-all duration-300"
                    >
                      <CopyIcon />
                      <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Copy Number
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        copyToClipboard(amountDisplaySek, "Amount")
                      }
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-800/30 dark:hover:to-yellow-800/30 border border-amber-200 dark:border-amber-800/30 rounded-lg transition-all duration-300"
                    >
                      <CopyIcon />
                      <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Copy Amount
                      </span>
                    </button>
                  </div>

                  {/* Already Paid Button */}
                  <button
                    onClick={() => goToThankYouAfterManual()}
                    className="w-full p-3 text-center text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors font-medium border border-amber-200 dark:border-amber-800/30 hover:border-amber-300 dark:hover:border-amber-700"
                  >
                    I've already paid → Continue
                  </button>

                  {/* Debug Info */}
                  <details className="mt-6">
                    <summary className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 cursor-pointer">
                      Advanced Details
                    </summary>
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/30">
                      <code className="text-xs font-mono break-all text-amber-800 dark:text-amber-300">
                        {qrPayloadDebug || qrFormatDebug}
                      </code>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
