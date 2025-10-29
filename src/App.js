import React, { useEffect, useState } from "react";

function App() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const domain = window.location.hostname;

    if (domain.includes("tropinord.se")) {
      setLang("sv");
    } else {
      setLang("en");
    }
  }, []);

  return (
    <div>
      {lang === "sv" ? (
        <h1>Välkommen till Tropinord</h1>
      ) : (
        <h1>Welcome to Tropinord</h1>
      )}
    </div>
  );
}

export default App;
