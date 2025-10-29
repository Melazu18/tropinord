// src/LocalizedRoutes.jsx
import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getRegionFromHost } from "./utils/getRegion";
import { routeMap } from "./routes/routeMap";

// Core pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Explore from "./pages/Explore";
import Faq from "./pages/Faq";
import CartPage from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AccountSecurity from "./pages/AccountSecurity";
import RequireAuth from "./routes/RequireAuth";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import ResetPassword from "./pages/ResetPassword";
import CheckoutPage from "./pages/CheckoutPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Products from "./pages/Products";
import TeaPage from "./pages/TeaPage";
import OilsPage from "./pages/OilsPage";
import ProductDetailRouter from "./pages/ProductDetailRouter";
import Blog from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import ThankYou from "./pages/ThankYou";
import Cancel from "./pages/Cancel";
import Shipping from "./pages/Shipping";
import PaymentPage from "./pages/PaymentPage";
import SpecialOffersPage from "./pages/SpecialOffersPage";
import ManualPaymentConfirmation from "./pages/ManualPaymentConfirmation";
import ReviewPage from "./pages/ReviewPage";
import OrderHistory from "./pages/OrderHistory";
import TeaProductDetail from "./pages/TeaProductDetail";
import RouteRedirector from "./routes/RouteRedirector";
import SelectProducts from "./pages/SelectProducts";
import Dashboard from "./pages/Dashboard";
import CreatorDashboard from "./pages/CreatorDashboard";

// Origin pages
import OriginTea from "./pages/OriginTea";
import OriginOils from "./pages/OriginOils";

/** Helper: build "/{lang}/{slug}" from routeMap */
const p = (key, lang) => `/${lang}/${routeMap[key][lang]}`;

export default function LocalizedRoutes() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const region = getRegionFromHost();

  const currentLang = location.pathname.split("/")[1] || "";

  useEffect(() => {
    if (["en", "sv", "fr", "es"].includes(currentLang)) {
      i18n.changeLanguage(currentLang);
      localStorage.setItem("lang", currentLang);
    }
  }, [currentLang, i18n]);

  // Root → localized home
  useEffect(() => {
    if (location.pathname === "/") {
      const lang = region === "se" ? "sv" : "en";
      navigate(p("home", lang), { replace: true });
    }
  }, [location.pathname, navigate, region]);

  return (
    <Routes>
      {/* ---------------- EN ---------------- */}
      <Route path={p("home", "en")} element={<Home />} />
      <Route path={p("about", "en")} element={<About />} />
      <Route path={p("contact", "en")} element={<Contact />} />
      <Route path={p("services", "en")} element={<Services />} />
      <Route path={p("explore", "en")} element={<Explore />} />
      <Route path={p("faq", "en")} element={<Faq />} />
      <Route path={p("cart", "en")} element={<CartPage />} />
      <Route path={p("login", "en")} element={<Login />} />
      <Route path={p("register", "en")} element={<Register />} />
      <Route path={p("forgotPassword", "en")} element={<RequestPasswordReset />} />
      <Route path={p("resetPassword", "en")} element={<ResetPassword />} />
      <Route path={p("checkout", "en")} element={<CheckoutPage />} />
      <Route path={p("privacy", "en")} element={<Privacy />} />
      <Route path={p("terms", "en")} element={<Terms />} />

      {/* Catalog */}
      <Route path={p("oils", "en")} element={<OilsPage />} />
      <Route path={p("tea", "en")} element={<TeaPage />} />
      <Route path={p("originTea", "en")} element={<OriginTea />} />
      <Route path={p("originOils", "en")} element={<OriginOils />} />
      <Route path={p("products", "en")} element={<Products />} />
      <Route path={`/en/${routeMap.products.en}/category/:category`} element={<Products />} />
      <Route path={`/en/${routeMap.products.en}/detail/:slug`} element={<ProductDetailRouter />} />
      <Route path={`/en/detail-product/:slug`} element={<TeaProductDetail />} />
      <Route path={p("order", "en")} element={<SelectProducts />} />

      {/* Checkout flow */}
      <Route path={p("thankYou", "en")} element={<ThankYou />} />
      <Route path={p("cancel", "en")} element={<Cancel />} />
      <Route path={p("shipping", "en")} element={<Shipping />} />
      <Route path={p("payment", "en")} element={<PaymentPage />} />
      <Route path={p("offers", "en")} element={<SpecialOffersPage />} />
      <Route path={p("manualConfirmation", "en")} element={<ManualPaymentConfirmation />} />

      {/* Blog */}
      <Route path={p("blog", "en")} element={<Blog />} />
      <Route path={`/en/${routeMap.blog.en}/:slug`} element={<BlogPost />} />

      {/* Accounts */}
      <Route
        path={p("dashboard", "en")}
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path={p("admin", "en")}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <AdminDashboard />
          </RequireAuth>
        }
      />
      <Route path={p("account", "en")} element={<AccountSecurity />} />
      <Route
        path={p("orderHistory", "en")}
        element={
          <RequireAuth>
            <OrderHistory />
          </RequireAuth>
        }
      />
      <Route
        path={`/en/${routeMap.reviews.en}/:productId`}
        element={
          <RequireAuth>
            <ReviewPage />
          </RequireAuth>
        }
      />
      <Route path="/en/creator" element={<CreatorDashboard />} />

      {/* ---------------- SV ---------------- */}
      <Route path={p("home", "sv")} element={<Home />} />
      <Route path={p("about", "sv")} element={<About />} />
      <Route path={p("contact", "sv")} element={<Contact />} />
      <Route path={p("services", "sv")} element={<Services />} />
      <Route path={p("explore", "sv")} element={<Explore />} />
      <Route path={p("faq", "sv")} element={<Faq />} />
      <Route path={p("cart", "sv")} element={<CartPage />} />
      <Route path={p("login", "sv")} element={<Login />} />
      <Route path={p("register", "sv")} element={<Register />} />
      <Route path={p("forgotPassword", "sv")} element={<RequestPasswordReset />} />
      <Route path={p("resetPassword", "sv")} element={<ResetPassword />} />
      <Route path={p("checkout", "sv")} element={<CheckoutPage />} />
      <Route path={p("privacy", "sv")} element={<Privacy />} />
      <Route path={p("terms", "sv")} element={<Terms />} />

      {/* Catalog */}
      <Route path={p("oils", "sv")} element={<OilsPage />} />
      <Route path={p("tea", "sv")} element={<TeaPage />} />
      <Route path={p("originTea", "sv")} element={<OriginTea />} />
      <Route path={p("originOils", "sv")} element={<OriginOils />} />
      <Route path={p("products", "sv")} element={<Products />} />
      <Route path={`/sv/${routeMap.products.sv}/kategori/:category`} element={<Products />} />
      <Route path={`/sv/${routeMap.products.sv}/detail/:slug`} element={<ProductDetailRouter />} />
      <Route path="/sv/produktdetalj/:slug" element={<TeaProductDetail />} />
      <Route path={p("order", "sv")} element={<SelectProducts />} />

      {/* Checkout flow */}
      <Route path={p("thankYou", "sv")} element={<ThankYou />} />
      <Route path={p("cancel", "sv")} element={<Cancel />} />
      <Route path={p("shipping", "sv")} element={<Shipping />} />
      <Route path={p("payment", "sv")} element={<PaymentPage />} />
      <Route path={p("offers", "sv")} element={<SpecialOffersPage />} />
      <Route path={p("manualConfirmation", "sv")} element={<ManualPaymentConfirmation />} />

      {/* Blog (plus legacy redirect already in your old file) */}
      <Route path={p("blog", "sv")} element={<Blog />} />
      <Route path={`/sv/${routeMap.blog.sv}/:slug`} element={<BlogPost />} />
      <Route path="/sv/blog/:slug" element={<RouteRedirector to={p("blog", "sv") + "/:slug"} />} replace />

      {/* ---------------- FR ---------------- */}
      <Route path={p("home", "fr")} element={<Home />} />
      <Route path={p("about", "fr")} element={<About />} />
      <Route path={p("contact", "fr")} element={<Contact />} />
      <Route path={p("services", "fr")} element={<Services />} />
      <Route path={p("explore", "fr")} element={<Explore />} />
      <Route path={p("faq", "fr")} element={<Faq />} />
      <Route path={p("cart", "fr")} element={<CartPage />} />
      <Route path={p("login", "fr")} element={<Login />} />
      <Route path={p("register", "fr")} element={<Register />} />
      <Route path={p("forgotPassword", "fr")} element={<RequestPasswordReset />} />
      <Route path={p("resetPassword", "fr")} element={<ResetPassword />} />
      <Route path={p("checkout", "fr")} element={<CheckoutPage />} />
      <Route path={p("privacy", "fr")} element={<Privacy />} />
      <Route path={p("terms", "fr")} element={<Terms />} />

      {/* Catalog */}
      <Route path={p("oils", "fr")} element={<OilsPage />} />
      <Route path={p("tea", "fr")} element={<TeaPage />} />
      <Route path={p("originTea", "fr")} element={<OriginTea />} />
      <Route path={p("originOils", "fr")} element={<OriginOils />} />
      <Route path={p("products", "fr")} element={<Products />} />
      <Route path={`/fr/${routeMap.products.fr}/categorie/:category`} element={<Products />} />
      <Route path={`/fr/${routeMap.products.fr}/detail/:slug`} element={<ProductDetailRouter />} />
      <Route path="/fr/detail-produit/:slug" element={<TeaProductDetail />} />
      <Route path={p("order", "fr")} element={<SelectProducts />} />

      {/* Checkout flow */}
      <Route path={p("thankYou", "fr")} element={<ThankYou />} />
      <Route path={p("cancel", "fr")} element={<Cancel />} />
      <Route path={p("shipping", "fr")} element={<Shipping />} />
      <Route path={p("payment", "fr")} element={<PaymentPage />} />
      <Route path={p("offers", "fr")} element={<SpecialOffersPage />} />
      <Route path={p("manualConfirmation", "fr")} element={<ManualPaymentConfirmation />} />

      {/* Blog */}
      <Route path={p("blog", "fr")} element={<Blog />} />
      <Route path={`/fr/${routeMap.blog.fr}/:slug`} element={<BlogPost />} />

      {/* Accounts */}
      <Route
        path={p("dashboard", "fr")}
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path={p("admin", "fr")}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <AdminDashboard />
          </RequireAuth>
        }
      />
      <Route
        path={p("orderHistory", "fr")}
        element={
          <RequireAuth>
            <OrderHistory />
          </RequireAuth>
        }
      />
      <Route
        path={`/fr/${routeMap.reviews.fr}/:productId`}
        element={
          <RequireAuth>
            <ReviewPage />
          </RequireAuth>
        }
      />

      {/* Legacy FR redirect: /fr/explorer → /fr/decouvrir */}
      <Route path="/fr/explorer" element={<RouteRedirector to={p("explore", "fr")} />} />

      {/* ---------------- ES ---------------- */}
      <Route path={p("home", "es")} element={<Home />} />
      <Route path={p("about", "es")} element={<About />} />
      <Route path={p("contact", "es")} element={<Contact />} />
      <Route path={p("services", "es")} element={<Services />} />
      <Route path={p("explore", "es")} element={<Explore />} />
      <Route path={p("faq", "es")} element={<Faq />} />
      <Route path={p("cart", "es")} element={<CartPage />} />
      <Route path={p("login", "es")} element={<Login />} />
      <Route path={p("register", "es")} element={<Register />} />
      <Route path={p("forgotPassword", "es")} element={<RequestPasswordReset />} />
      <Route path={p("resetPassword", "es")} element={<ResetPassword />} />
      <Route path={p("checkout", "es")} element={<CheckoutPage />} />
      <Route path={p("privacy", "es")} element={<Privacy />} />
      <Route path={p("terms", "es")} element={<Terms />} />

      {/* Catalog */}
      <Route path={p("oils", "es")} element={<OilsPage />} />
      <Route path={p("tea", "es")} element={<TeaPage />} />
      <Route path={p("originTea", "es")} element={<OriginTea />} />
      <Route path={p("originOils", "es")} element={<OriginOils />} />
      <Route path={p("products", "es")} element={<Products />} />
      <Route path={`/es/${routeMap.products.es}/categoria/:category`} element={<Products />} />
      <Route path={`/es/${routeMap.products.es}/detalle/:slug`} element={<ProductDetailRouter />} />
      <Route path="/es/detalle-producto/:slug" element={<TeaProductDetail />} />
      <Route path={p("order", "es")} element={<SelectProducts />} />

      {/* Checkout flow */}
      <Route path={p("thankYou", "es")} element={<ThankYou />} />
      <Route path={p("cancel", "es")} element={<Cancel />} />
      <Route path={p("shipping", "es")} element={<Shipping />} />
      <Route path={p("payment", "es")} element={<PaymentPage />} />
      <Route path={p("offers", "es")} element={<SpecialOffersPage />} />
      <Route path={p("manualConfirmation", "es")} element={<ManualPaymentConfirmation />} />

      {/* Blog */}
      <Route path={p("blog", "es")} element={<Blog />} />
      <Route path={`/es/${routeMap.blog.es}/:slug`} element={<BlogPost />} />

      {/* Accounts */}
      <Route
        path={p("dashboard", "es")}
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path={p("admin", "es")}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <AdminDashboard />
          </RequireAuth>
        }
      />
      <Route
        path={p("orderHistory", "es")}
        element={
          <RequireAuth>
            <OrderHistory />
          </RequireAuth>
        }
      />
      <Route
        path={`/es/${routeMap.reviews.es}/:productId`}
        element={
          <RequireAuth>
            <ReviewPage />
          </RequireAuth>
        }
      />

      {/* Legacy ES redirects */}
      <Route path="/es/sobre-nosotros" element={<RouteRedirector to={p("about", "es")} />} />
      <Route path="/es/olvido-contrasena" element={<RouteRedirector to={p("forgotPassword", "es")} />} />

      {/* Non-localized catcher → smart redirector (e.g. /contact) */}
      <Route path=":maybeRouteKey" element={<RouteRedirector />} />

      {/* 404 */}
      <Route path="*" element={<div className="p-6 text-red-600">404 – Page Not Found</div>} />
    </Routes>
  );
}
