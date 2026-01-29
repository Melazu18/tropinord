import React from "react";
import CoffeeLabelSheet from "../components/CoffeeLabelSheet";

export default function CoffeeLabelsPage() {
  return (
    <main className="pt-24 px-4 py-8 max-w-5xl mx-auto">
      {/* print isolate root */}
      <div id="print-root">
        <CoffeeLabelSheet />
      </div>
    </main>
  );
}