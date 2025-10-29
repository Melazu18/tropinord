import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import WelcomeLanding from "./pages/WelcomeLanding";

import MobileHeader from "./components/MobileHeader";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import ChatbotWidget from "./components/ChatbotWidget";
import WhatsAppChat from "./components/ui/WhatsAppChat";
import TidioChat from "./components/TidioChat";
import FloatingScrollNav from "./components/ui/FloatingScrollNav";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Explore from "./pages/Explore";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import SelectProducts from "./pages/SelectProducts";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYou from "./pages/ThankYou";
import Cancel from "./pages/Cancel";
import Shipping from "./pages/Shipping";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Faq from "./pages/Faq";
import ProductList from "./pages/ProductList";
import ProductListByCategory from "./pages/ProductListByCategory";
import CartPage from "./pages/Cart";
import SpecialOffersPage from "./pages/SpecialOffersPage";
import PaymentPage from "./pages/PaymentPage";
import OrderStatus from "./pages/OrderStatus";
import TrackOrder from "./pages/TrackOrder";
import ManualPaymentConfirmation from "./pages/ManualPaymentConfirmation";
import BlogPost from "./pages/BlogPost";
import Blog from "./pages/BlogIndex";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BlackSoapLanding from "./pages/BlackSoapLanding";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || "en";

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
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
    <>
      <TidioChat language={currentLanguage} />
      <div className="flex flex-col min-h-screen font-sans bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <MobileHeader />
        <div className="hidden md:block">
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
        <main className="flex-grow pt-36 px-4 md:px-8 py-6">
          <Routes>
            <Route path="/" element={<WelcomeLanding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/order" element={<SelectProducts />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/products" element={<Explore />} />
            <Route path="/offers" element={<SpecialOffersPage />} />
            <Route path="/order-status" element={<OrderStatus />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/products/black-soap" element={<BlackSoapLanding />} />
            <Route
              path="/manual-confirmation"
              element={<ManualPaymentConfirmation />}
            />
            <Route
              path="/products/category/:category"
              element={<ProductListByCategory />}
            />
            <Route path="/products/detail/:slug" element={<ProductDetail />} />
          </Routes>
        </main>
        <Footer darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <ChatbotWidget />
        <WhatsAppChat />
        <FloatingScrollNav />
      </div>
    </>
  );
}

export default App;
