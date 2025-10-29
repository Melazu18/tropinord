import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import "./i18n";
import App from "./App.jsx";
import i18n from "i18next";
import { CartProvider } from "./contexts/CartContext.jsx";
import "./index.css";

// History for HistoryRouter
const history = createBrowserHistory();

// Error boundary for graceful error handling
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
    document.documentElement.dir = i18n.dir(i18n.language || "en");
  }, []);

  return children;
}

// ✅ Final render (only once)
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <DirectionWrapper>
        <CartProvider>
          <HistoryRouter
            history={history}
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <App />
          </HistoryRouter>
        </CartProvider>
      </DirectionWrapper>
    </ErrorBoundary>
  </React.StrictMode>
);
