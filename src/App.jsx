// src/App.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// ✅ Only use Routes/Route here — no Router wrapper
import { Routes, Route } from "react-router-dom";

import WelcomeLanding from "./pages/WelcomeLanding";
import MobileHeader from "./components/MobileHeader";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import WhatsAppChat from "./components/ui/WhatsAppChat";
import FloatingScrollNav from "./components/ui/FloatingScrollNav";
import { getRegionFromHost } from "./utils/getRegion";
import LocalizedRoutes from "./LocalizedRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import ChatWidget from "./components/chat/ChatWidget";

// Shared currency provider (for Oil/Tea pages)
import { CurrencyProvider } from "./shared/ui/CurrencyProvider";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || "en";
  // kept in case it’s referenced elsewhere
  const region = getRegionFromHost(); // eslint-disable-line no-unused-vars

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isDark = saved === "dark" || (!saved && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <AuthProvider>
      <CurrencyProvider>
        {/* The one and only Router should be in main.jsx */}
        <ChatWidget />
        <div className="flex flex-col min-h-screen font-sans bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
          <MobileHeader />
          <div className="hidden md:block">
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>

          <main className="flex-grow pt-4 md:pt-36 px-4 md:px-8 py-6">
            <Routes>
              <Route path="/" element={<WelcomeLanding />} />
              <Route path="/*" element={<LocalizedRoutes />} />
            </Routes>
          </main>

          <Footer darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <WhatsAppChat />
          <FloatingScrollNav />
        </div>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
