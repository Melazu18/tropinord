import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

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
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Web Vitals Reporting (optional)
function sendToAnalytics(metric) {
  console.log(metric);
  // Send metrics to your analytics service
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to measure performance in your app
if (process.env.NODE_ENV === 'production') {
  import('web-vitals').then(({ getCLS, getFID, getLCP, getFCP, getTTFB }) => {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getLCP(sendToAnalytics);
    getFCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  });
}