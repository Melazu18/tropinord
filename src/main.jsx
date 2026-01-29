import React, { useEffect } from "react";
import * as ReactDOMClient from "react-dom/client";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import "./i18n";
import App from "./App.jsx";
import i18n from "i18next";
import { CartProvider } from "./contexts/CartContext.jsx";
import { WishlistProvider } from "./contexts/WishlistContext.jsx"; // ✅ NEW
import { ReviewsProvider } from "./contexts/ReviewsContext.jsx"; // ✅ NEW
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { loadRecaptcha } from "./utils/loadRecaptcha";
import { CurrencyProvider } from "./shared/ui/CurrencyProvider";

const history = createBrowserHistory();

// Error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("Uncaught error:", error, info);
  }
  render() {
    return this.state.hasError ? (
      <h1>Something went wrong.</h1>
    ) : (
      this.props.children
    );
  }
}

// Language direction wrapper
function DirectionWrapper({ children }) {
  useEffect(() => {
    const applyDir = (lng) => {
      document.documentElement.dir = i18n.dir(lng || "en");
    };
    applyDir(i18n.language);
    i18n.on("languageChanged", applyDir);
    return () => i18n.off("languageChanged", applyDir);
  }, []);
  return children;
}

// Optional: avoid double init in StrictMode by moving reCAPTCHA here
function RecaptchaBoot({ children }) {
  useEffect(() => {
    loadRecaptcha();
  }, []);
  return children;
}

// Idempotent root creation (prevents “createRoot called twice” on HMR)
const container = document.getElementById("root");
const root =
  container._reactRoot ||
  (container._reactRoot = ReactDOMClient.createRoot(container));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <DirectionWrapper>
          <RecaptchaBoot>
            <CartProvider>
              <WishlistProvider>
                <ReviewsProvider>
                  <CurrencyProvider initial="SEK">
                    <HistoryRouter
                      history={history}
                      future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                      }}
                    >
                      <App />
                    </HistoryRouter>
                  </CurrencyProvider>
                </ReviewsProvider>
              </WishlistProvider>
            </CartProvider>
          </RecaptchaBoot>
        </DirectionWrapper>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
