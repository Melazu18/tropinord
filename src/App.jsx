import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import ChatbotWidget from "./components/ChatbotWidget";
import WhatsAppChat from "./components/ui/WhatsAppChat";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Explore from "./pages/Explore";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import OrderForm from "./pages/OrderForm";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState({ email: "", total: 0 });

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow px-4 md:px-8 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/order" element={<OrderForm />} />
            <Route
              path="/products/:slug"
              element={
                <ProductDetail
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              }
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <ChatbotWidget />
        <WhatsAppChat />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
