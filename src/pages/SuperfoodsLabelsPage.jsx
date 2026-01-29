import React from "react";
import SuperfoodsLabelSheet from "../components/SuperfoodsLabelSheet";

export default function SuperfoodsLabelsPage() {
  return (
    <main className="pt-24 px-4 py-8 max-w-5xl mx-auto">
      {/* print isolate root */}
      <div id="print-root">
        <SuperfoodsLabelSheet />
      </div>
    </main>
  );
}