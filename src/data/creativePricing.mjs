// Shared starting prices for creative extras and their package cards, in HUF.
export const creativePrices = { makeup: 19000, makeupAndHair: 39000, editorial: 59000, styling: 10000, team: 48000 };
export const creativePrice = (key, language = "en") => `${String(creativePrices[key]).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${language === "hu" ? "Ft" : "HUF"}`;
export const creativePriceFrom = (key, language = "en") => language === "hu"
  ? `${creativePrice(key, language)}-tól`
  : `${language === "de" ? "ab" : "from"} ${creativePrice(key, language)}`;
