import React from "react";
import OilsLabelSheet from "../components/OilsLabelSheet";

export default function OilsLabelsPage() {
  return (
    <main className="pt-24 px-4 py-8 max-w-5xl mx-auto">
      {/* print isolate root */}
      <div id="print-root">
        <OilsLabelSheet />
      </div>
    </main>
  );
}
