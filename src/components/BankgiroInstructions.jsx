import React from "react";

export default function BankgiroInstructions({ amount, reference }) {
  const bankgiroNumber = "5015-1935";

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="mt-6 text-center">
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        Betala via Bankgiro
      </h3>
      <p className="text-gray-700 dark:text-gray-300 text-sm">
        Vänligen överför <strong>{amount} kr</strong> till:
      </p>
      <p
        className="text-lg font-bold mt-2 select-all cursor-pointer"
        onClick={() => handleCopy(bankgiroNumber)}
        title="Klicka för att kopiera"
      >
        {bankgiroNumber}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        Referens:{" "}
        <span
          className="italic select-all cursor-pointer"
          onClick={() => handleCopy(reference)}
          title="Klicka för att kopiera"
        >
          {reference}
        </span>
      </p>
    </div>
  );
}
