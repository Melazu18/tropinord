import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from "./App.jsx";
import "./i18n";
import i18n from "i18next";
import "./index.css";

// History for HistoryRouter
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
    return this.state.hasError ? <h1>Something went wrong.</h1> : this.props.children;
  }
}

// Language direction wrapper
function DirectionWrapper({ children }) {
  useEffect(() => {
    document.documentElement.dir = i18n.dir(i18n.language || "en");
  }, []);
  return children;
}

// Render
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <DirectionWrapper>
        <HistoryRouter
          history={history}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <App />
        </HistoryRouter>
      </DirectionWrapper>
    </ErrorBoundary>
  </React.StrictMode>
);
