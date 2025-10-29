import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function ShopifyBuyButton({ productId = "10021379211603" }) {
  const ref = useRef(null);
  const { t } = useTranslation(["order", "cart"]);

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
      script.onload = initShopifyBuy;
      document.body.appendChild(script);
    };

    const initShopifyBuy = () => {
      if (!window.ShopifyBuy) return;

      const client = window.ShopifyBuy.buildClient({
        domain: "k5vzvt-6d.myshopify.com",
        storefrontAccessToken: "9c85ad0e00eaac6b194b5786424bbed8",
      });

      window.ShopifyBuy.UI.onReady(client).then((ui) => {
        ui.createComponent("product", {
          id: productId,
          node: ref.current,
          moneyFormat: "%7B%7Bamount%7D%7D kr",
          options: {
            product: {
              layout: "classic",
              buttonDestination: "cart",
              styles: {
                product: {
                  fontFamily: "'Inter', sans-serif",
                  textAlign: "center",
                },
                button: {
                  backgroundColor: "#047857",
                  color: "#ffffff",
                  fontWeight: "600",
                  fontSize: "16px",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  ":hover": {
                    backgroundColor: "#065f46",
                  },
                },
              },
              text: {
                button: t("order.addToCart", { defaultValue: "Add to cart" }),
              },
            },
            cart: {
              startOpen: false,
              popup: true,
              styles: {
                button: {
                  backgroundColor: "#047857",
                  color: "#ffffff",
                  fontWeight: "600",
                  borderRadius: "10px",
                  ":hover": {
                    backgroundColor: "#065f46",
                  },
                },
              },
              text: {
                title: t("cart.yourCart", { defaultValue: "Your Cart" }),
                total: t("order.total", { defaultValue: "Total" }),
                button: t("order.proceedToCheckout", {
                  defaultValue: "Proceed to Checkout",
                }),
              },
            },
          },
        });
      });
    };

    if (window.ShopifyBuy) {
      initShopifyBuy();
    } else {
      loadScript();
    }
  }, [productId, t]);

  return <div ref={ref} />;
}
