// Studio rental prices shared by pricing cards, homepage and FAQ copy.
export const studioPricing = Object.freeze({ standard: 9000, discounted: 8000, pass: 70000, passHours: 10, savingsPercent: 22 });

export function studioPriceLabels(language = "en") {
  const locale = language === "hu" ? "hu-HU" : language === "de" ? "de-DE" : "en-US";
  const money = (amount) => {
    const number = new Intl.NumberFormat(locale).format(amount).replace(/\u00a0/g, " ");
    return language === "hu" ? `${number} Ft` : language === "de" ? `${number} HUF` : `HUF ${number}`;
  };
  const hour = language === "hu" ? "/óra" : language === "de" ? "/Stunde" : "/hour";
  return {
    discounted: money(studioPricing.discounted) + hour,
    standard: money(studioPricing.standard) + hour,
    pass: money(studioPricing.pass),
    savings: language === "hu" ? `Akár ${studioPricing.savingsPercent}% kedvezmény` : language === "de" ? `Bis zu ${studioPricing.savingsPercent} % sparen` : `Save up to ${studioPricing.savingsPercent}%`
  };
}
