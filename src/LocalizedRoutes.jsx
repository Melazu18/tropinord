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
import SearchResults from "./pages/SearchResults";
import CoffeePage from "./pages/CoffeePage";
import SuperfoodsPage from "./pages/SuperfoodsPage";
import OrdersAdmin from "./pages/OrdersAdmin";
import AdminProducts from "./pages/AdminProducts";
import Profile from "./pages/Profile";

// Origin pages
import OriginTea from "./pages/OriginTea";
import OriginOils from "./pages/OriginOils";
import FxRatesPage from "./pages/FxRatesPage";
import WholesalePage from "./pages/WholesalePage";

// Labels pages
import TeaLabelsPage from "./pages/TeaLabelsPage";
import TeaAdminLabelsPage from "./pages/TeaAdminLabelsPage";

import CoffeeProductDetail from "./pages/CoffeeProductDetail";
import OilsProductDetail from "./pages/OilsProductDetail";
import SuperfoodsProductDetail from "./pages/SuperfoodsProductDetail";

import CoffeeLabelsPage from "./pages/CoffeeLabelsPage";
import CoffeeAdminLabelsPage from "./pages/CoffeeAdminLabelsPage";

// Oils + Superfoods labels pages (public + admin)
import OilsLabelsPage from "./pages/OilsLabelsPage";
import OilsAdminLabelsPage from "./pages/OilsAdminLabelsPage";
import SuperfoodsLabelsPage from "./pages/SuperfoodsLabelsPage";
import SuperfoodsAdminLabelsPage from "./pages/SuperfoodsAdminLabelsPage";

// languages we support as URL segments
const SUPPORTED = ["en", "sv", "fr", "es"];

/** Helper: build "/{lang}/{slug}" from routeMap */
const p = (key, lang) => `/${lang}/${routeMap[key][lang]}`;

// Legacy URL redirect: /products/organic-oils → localized oils listing
function LegacyOrganicOilsRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const prefer = (localStorage.getItem("lang") || "").slice(0, 2);
    const region = getRegionFromHost();
    const lang = SUPPORTED.includes(prefer) ? prefer : region === "se" ? "sv" : "en";
    navigate(p("oils", lang), { replace: true });
  }, [navigate]);

  return null;
}

export default function LocalizedRoutes() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const region = getRegionFromHost();

  // derive the lang segment from URL safely
  const urlLang = (location.pathname.split("/")[1] || "").toLowerCase();
  const currentLang = urlLang.slice(0, 2);

  // keep i18n in sync with URL segment
  useEffect(() => {
    if (SUPPORTED.includes(currentLang) && i18n.language.slice(0, 2) !== currentLang) {
      i18n.changeLanguage(currentLang);
      localStorage.setItem("lang", currentLang);
    }
  }, [currentLang, i18n]);

  // Root → localized home
  useEffect(() => {
    if (location.pathname === "/") {
      const prefer = (localStorage.getItem("lang") || "").slice(0, 2);
      const lang = SUPPORTED.includes(prefer) ? prefer : region === "se" ? "sv" : "en";
      navigate(p("home", lang), { replace: true });
    }
  }, [location.pathname, navigate, region]);

  const mustSync =
    SUPPORTED.includes(currentLang) &&
    i18n.isInitialized &&
    i18n.language.slice(0, 2) !== currentLang;

  if (!i18n.isInitialized || mustSync) return null;

  return (
    <Routes key={i18n.language.slice(0, 2)}>
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
      <Route path={p("teaLabels", "en")} element={<TeaLabelsPage />} />
      <Route path={p("coffeeLabels", "en")} element={<CoffeeLabelsPage />} />
      <Route path={p("oilsLabels", "en")} element={<OilsLabelsPage />} />
      <Route path={p("superfoodsLabels", "en")} element={<SuperfoodsLabelsPage />} />

      <Route path={p("wholesale", "en")} element={<WholesalePage />} />
      <Route path={p("originTea", "en")} element={<OriginTea />} />
      <Route path={p("originOils", "en")} element={<OriginOils />} />
      <Route path={p("products", "en")} element={<Products />} />
      <Route path={`/en/${routeMap.products.en}/category/:category`} element={<Products />} />
      <Route path={`/en/${routeMap.products.en}/detail/:slug`} element={<ProductDetailRouter />} />

      <Route path={`/en/${routeMap.teaDetail.en}/:slug`} element={<TeaProductDetail />} />
      <Route path={`/en/${routeMap.coffeeDetail.en}/:slug`} element={<CoffeeProductDetail />} />
      <Route path={`/en/${routeMap.oilsDetail.en}/:slug`} element={<OilsProductDetail />} />
      <Route path={`/en/${routeMap.superfoodsDetail.en}/:slug`} element={<SuperfoodsProductDetail />} />

      {/* Checkout flow */}
      <Route path={p("thankYou", "en")} element={<ThankYou />} />
      <Route path={p("cancel", "en")} element={<Cancel />} />
      <Route path={p("shipping", "en")} element={<Shipping />} />
      <Route path={p("payment", "en")} element={<PaymentPage />} />
      <Route path={p("fx", "en")} element={<FxRatesPage />} />
      <Route path={p("offers", "en")} element={<SpecialOffersPage />} />
      <Route path={p("manualConfirmation", "en")} element={<ManualPaymentConfirmation />} />

      {/* Blog */}
      <Route path={p("blog", "en")} element={<Blog />} />
      <Route path={`/en/${routeMap.blog.en}/:slug`} element={<BlogPost />} />

      {/* Accounts */}
      <Route
        path={p("profile", "en")}
        element={
          <RequireAuth>
            <Profile />
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
      <Route
        path={`${p("admin", "en")}/orders`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <OrdersAdmin />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "en")}/products`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <AdminProducts />
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

      {/* Admin labels */}
      <Route
        path={`${p("admin", "en")}/${routeMap.teaAdminLabels.en}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <TeaAdminLabelsPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "en")}/${routeMap.coffeeAdminLabels.en}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <CoffeeAdminLabelsPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "en")}/${routeMap.oilsAdminLabels.en}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <OilsAdminLabelsPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "en")}/${routeMap.superfoodsAdminLabels.en}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <SuperfoodsAdminLabelsPage />
          </RequireAuth>
        }
      />

      <Route path={p("search", "en")} element={<SearchResults />} />
      <Route path={p("coffee", "en")} element={<CoffeePage />} />
      <Route path={p("superfoods", "en")} element={<SuperfoodsPage />} />

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
      <Route path={p("teaLabels", "sv")} element={<TeaLabelsPage />} />
      <Route path={p("coffeeLabels", "sv")} element={<CoffeeLabelsPage />} />
      <Route path={p("oilsLabels", "sv")} element={<OilsLabelsPage />} />
      <Route path={p("superfoodsLabels", "sv")} element={<SuperfoodsLabelsPage />} />

      <Route path={p("wholesale", "sv")} element={<WholesalePage />} />
      <Route path={p("originTea", "sv")} element={<OriginTea />} />
      <Route path={p("originOils", "sv")} element={<OriginOils />} />
      <Route path={p("products", "sv")} element={<Products />} />
      <Route path={`/sv/${routeMap.products.sv}/kategori/:category`} element={<Products />} />
      <Route path={`/sv/${routeMap.products.sv}/detail/:slug`} element={<ProductDetailRouter />} />

      <Route path={`/sv/${routeMap.teaDetail.sv}/:slug`} element={<TeaProductDetail />} />
      <Route path={`/sv/${routeMap.coffeeDetail.sv}/:slug`} element={<CoffeeProductDetail />} />
      <Route path={`/sv/${routeMap.oilsDetail.sv}/:slug`} element={<OilsProductDetail />} />
      <Route path={`/sv/${routeMap.superfoodsDetail.sv}/:slug`} element={<SuperfoodsProductDetail />} />

      {/* Checkout flow */}
      <Route path={p("thankYou", "sv")} element={<ThankYou />} />
      <Route path={p("cancel", "sv")} element={<Cancel />} />
      <Route path={p("shipping", "sv")} element={<Shipping />} />
      <Route path={p("payment", "sv")} element={<PaymentPage />} />
      <Route path={p("fx", "sv")} element={<FxRatesPage />} />
      <Route path={p("offers", "sv")} element={<SpecialOffersPage />} />
      <Route path={p("manualConfirmation", "sv")} element={<ManualPaymentConfirmation />} />

      {/* Accounts */}
      <Route
        path={p("profile", "sv")}
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path={p("admin", "sv")}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <AdminDashboard />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "sv")}/orders`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <OrdersAdmin />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "sv")}/products`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <AdminProducts />
          </RequireAuth>
        }
      />
      <Route path={p("account", "sv")} element={<AccountSecurity />} />
      <Route
        path={p("orderHistory", "sv")}
        element={
          <RequireAuth>
            <OrderHistory />
          </RequireAuth>
        }
      />
      <Route
        path={`/sv/${routeMap.reviews.sv}/:productId`}
        element={
          <RequireAuth>
            <ReviewPage />
          </RequireAuth>
        }
      />

      {/* Blog */}
      <Route path={p("blog", "sv")} element={<Blog />} />
      <Route path={`/sv/${routeMap.blog.sv}/:slug`} element={<BlogPost />} />
      <Route
        path="/sv/blog/:slug"
        element={<RouteRedirector to={p("blog", "sv") + "/:slug"} />}
        replace
      />

      {/* Admin labels */}
      <Route
        path={`${p("admin", "sv")}/${routeMap.teaAdminLabels.sv}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <TeaAdminLabelsPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "sv")}/${routeMap.coffeeAdminLabels.sv}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <CoffeeAdminLabelsPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "sv")}/${routeMap.oilsAdminLabels.sv}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <OilsAdminLabelsPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "sv")}/${routeMap.superfoodsAdminLabels.sv}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <SuperfoodsAdminLabelsPage />
          </RequireAuth>
        }
      />

      <Route path={p("search", "sv")} element={<SearchResults />} />
      <Route path={p("coffee", "sv")} element={<CoffeePage />} />
      <Route path={p("superfoods", "sv")} element={<SuperfoodsPage />} />

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
      <Route path={p("teaLabels", "fr")} element={<TeaLabelsPage />} />
      <Route path={p("coffeeLabels", "fr")} element={<CoffeeLabelsPage />} />
      <Route path={p("oilsLabels", "fr")} element={<OilsLabelsPage />} />
      <Route path={p("superfoodsLabels", "fr")} element={<SuperfoodsLabelsPage />} />

      <Route path={p("wholesale", "fr")} element={<WholesalePage />} />
      <Route path={p("originTea", "fr")} element={<OriginTea />} />
      <Route path={p("originOils", "fr")} element={<OriginOils />} />
      <Route path={p("products", "fr")} element={<Products />} />
      <Route path={`/fr/${routeMap.products.fr}/categorie/:category`} element={<Products />} />
      <Route path={`/fr/${routeMap.products.fr}/detail/:slug`} element={<ProductDetailRouter />} />

      <Route path={`/fr/${routeMap.teaDetail.fr}/:slug`} element={<TeaProductDetail />} />
      <Route path={`/fr/${routeMap.coffeeDetail.fr}/:slug`} element={<CoffeeProductDetail />} />
      <Route path={`/fr/${routeMap.oilsDetail.fr}/:slug`} element={<OilsProductDetail />} />
      <Route path={`/fr/${routeMap.superfoodsDetail.fr}/:slug`} element={<SuperfoodsProductDetail />} />

      {/* Checkout flow */}
      <Route path={p("thankYou", "fr")} element={<ThankYou />} />
      <Route path={p("cancel", "fr")} element={<Cancel />} />
      <Route path={p("shipping", "fr")} element={<Shipping />} />
      <Route path={p("payment", "fr")} element={<PaymentPage />} />
      <Route path={p("fx", "fr")} element={<FxRatesPage />} />
      <Route path={p("offers", "fr")} element={<SpecialOffersPage />} />
      <Route path={p("manualConfirmation", "fr")} element={<ManualPaymentConfirmation />} />

      {/* Blog */}
      <Route path={p("blog", "fr")} element={<Blog />} />
      <Route path={`/fr/${routeMap.blog.fr}/:slug`} element={<BlogPost />} />
      <Route path="/fr/explorer" element={<RouteRedirector to={p("explore", "fr")} />} />

      {/* Accounts */}
      <Route
        path={p("profile", "fr")}
        element={
          <RequireAuth>
            <Profile />
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
        path={`${p("admin", "fr")}/orders`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <OrdersAdmin />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "fr")}/products`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <AdminProducts />
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

      {/* Admin labels */}
      <Route
        path={`${p("admin", "fr")}/${routeMap.teaAdminLabels.fr}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <TeaAdminLabelsPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "fr")}/${routeMap.coffeeAdminLabels.fr}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <CoffeeAdminLabelsPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "fr")}/${routeMap.oilsAdminLabels.fr}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <OilsAdminLabelsPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "fr")}/${routeMap.superfoodsAdminLabels.fr}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <SuperfoodsAdminLabelsPage />
          </RequireAuth>
        }
      />

      <Route path={p("search", "fr")} element={<SearchResults />} />
      <Route path={p("coffee", "fr")} element={<CoffeePage />} />
      <Route path={p("superfoods", "fr")} element={<SuperfoodsPage />} />

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
      <Route path={p("teaLabels", "es")} element={<TeaLabelsPage />} />
      <Route path={p("coffeeLabels", "es")} element={<CoffeeLabelsPage />} />
      <Route path={p("oilsLabels", "es")} element={<OilsLabelsPage />} />
      <Route path={p("superfoodsLabels", "es")} element={<SuperfoodsLabelsPage />} />

      <Route path={p("wholesale", "es")} element={<WholesalePage />} />
      <Route path={p("originTea", "es")} element={<OriginTea />} />
      <Route path={p("originOils", "es")} element={<OriginOils />} />
      <Route path={p("products", "es")} element={<Products />} />
      <Route path={`/es/${routeMap.products.es}/categoria/:category`} element={<Products />} />
      <Route path={`/es/${routeMap.products.es}/detalle/:slug`} element={<ProductDetailRouter />} />

      <Route path={`/es/${routeMap.teaDetail.es}/:slug`} element={<TeaProductDetail />} />
      <Route path={`/es/${routeMap.coffeeDetail.es}/:slug`} element={<CoffeeProductDetail />} />
      <Route path={`/es/${routeMap.oilsDetail.es}/:slug`} element={<OilsProductDetail />} />
      <Route path={`/es/${routeMap.superfoodsDetail.es}/:slug`} element={<SuperfoodsProductDetail />} />

      {/* Checkout flow */}
      <Route path={p("thankYou", "es")} element={<ThankYou />} />
      <Route path={p("cancel", "es")} element={<Cancel />} />
      <Route path={p("shipping", "es")} element={<Shipping />} />
      <Route path={p("payment", "es")} element={<PaymentPage />} />
      <Route path={p("fx", "es")} element={<FxRatesPage />} />
      <Route path={p("offers", "es")} element={<SpecialOffersPage />} />
      <Route path={p("manualConfirmation", "es")} element={<ManualPaymentConfirmation />} />

      {/* Blog */}
      <Route path={p("blog", "es")} element={<Blog />} />
      <Route path={`/es/${routeMap.blog.es}/:slug`} element={<BlogPost />} />
      <Route path="/es/sobre-nosotros" element={<RouteRedirector to={p("about", "es")} />} />
      <Route path="/es/olvido-contrasena" element={<RouteRedirector to={p("forgotPassword", "es")} />} />

      {/* Accounts */}
      <Route
        path={p("profile", "es")}
        element={
          <RequireAuth>
            <Profile />
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
        path={`${p("admin", "es")}/orders`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <OrdersAdmin />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "es")}/products`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <AdminProducts />
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

      {/* Admin labels */}
      <Route
        path={`${p("admin", "es")}/${routeMap.teaAdminLabels.es}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <TeaAdminLabelsPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "es")}/${routeMap.coffeeAdminLabels.es}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <CoffeeAdminLabelsPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "es")}/${routeMap.oilsAdminLabels.es}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <OilsAdminLabelsPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${p("admin", "es")}/${routeMap.superfoodsAdminLabels.es}`}
        element={
          <RequireAuth roles={["ADMIN"]}>
            <SuperfoodsAdminLabelsPage />
          </RequireAuth>
        }
      />

      <Route path={p("search", "es")} element={<SearchResults />} />
      <Route path={p("coffee", "es")} element={<CoffeePage />} />
      <Route path={p("superfoods", "es")} element={<SuperfoodsPage />} />

      {/* Legacy non-localized URL: /products/organic-oils */}
      <Route path="/products/organic-oils" element={<LegacyOrganicOilsRedirect />} />

      {/* Non-localized catcher → smart redirector (e.g. /contact) */}
      <Route path=":maybeRouteKey" element={<RouteRedirector />} />

      {/* 404 */}
      <Route path="*" element={<div className="p-6 text-red-600">404 – Page Not Found</div>} />
    </Routes>
  );
}
