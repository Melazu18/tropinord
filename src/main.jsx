import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./i18n"; // Loads i18n config
import i18n from "./i18n"; // ⬅️ Needed for RTL direction
import "./index.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Set text direction based on language
function DirectionWrapper({ children }) {
  useEffect(() => {
    document.documentElement.dir = i18n.dir(i18n.language || "en");
  }, []);

  return children;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <DirectionWrapper>
        <App />
      </DirectionWrapper>
    </ErrorBoundary>
  </React.StrictMode>
);
