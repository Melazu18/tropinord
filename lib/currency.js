import fallbackRates from "./fallbackRates.json";

export function convertEURto(currencyCode, amountInEUR) {
  const rate = fallbackRates["SEK"] || 1;
  return amountInEUR * rate;
}
