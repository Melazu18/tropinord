import { useEffect } from "react";

export default function ChatbotWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//code.tidio.co/dnl2phhmisljdoefgclng1nwuusxf55k.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
