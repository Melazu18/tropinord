// src/pages/TeaLabelsPage.jsx
import React from "react";
import TeaPrepSheet from "../components/TeaPrepSheet";

export default function TeaLabelsPage() {
  return (
    <main className="pt-24 px-4 py-8 max-w-5xl mx-auto">
      {/* print isolate root */}
      <div id="print-root">
        <TeaPrepSheet />
      </div>
    </main>
  );
}
