import { navGroups, pageByPath, site } from "../data/routes.mjs";

export const siteUrl = () => (import.meta.env.PUBLIC_SITE_URL || site.domain).replace(/\/+$/, "");

export const absoluteUrl = (path) => new URL(path, `${siteUrl()}/`).toString();

export const localizedPath = (path, language) => {
  const page = pageByPath.get(path);
  if (!page) return path;
  return language === "hu" && page.language === "en" ? (page.counterpartPath || path) : path;
};

export const localizedNav = (language) => navGroups.map((group) => ({
  ...group,
  links: group.links.map(([path, label]) => [localizedPath(path, language), label])
}));

export const introFor = (page) => {
  if (page.section === "home") {
    return page.language === "hu"
      ? "Profiknak és első alkalommal érkezőknek is kialakított alkotótér Budapesten."
      : "A creative studio in Budapest, made for professionals and first-time creatives alike.";
  }
  if (page.section === "booking") {
    return page.language === "hu"
      ? "Foglalj időpontot fotózáshoz, workshophoz vagy privát szelfi élményhez."
      : "Book the studio for a photoshoot, workshop or private selfie session.";
  }
  if (page.section === "faq") {
    return page.language === "hu"
      ? "Válaszok a stúdióról, felszerelésről, foglalásról és fotózásokról."
      : "Answers about the studio, equipment, bookings and photoshoots.";
  }
  if (page.section === "legal") {
    return page.language === "hu"
      ? "Az aether art space adatkezelési tájékoztatója."
      : "Privacy information for aether art space.";
  }
  return page.language === "hu"
    ? `Fedezd fel az ${page.purpose.toLowerCase()} lehetőségeit az aether art space budapesti stúdiójában.`
    : `Explore ${page.purpose.toLowerCase()} at aether art space in Budapest.`;
};

export const faqItemsFor = (page) => page.language === "hu" ? [
  ["Mikor használható a stúdió?", "Időpont-egyeztetéssel hétköznap 09:00–22:00, hétvégén 10:00–22:00 között."],
  ["Kezdők is foglalhatnak?", "Igen. A helyszínen megmutatjuk az alapvető felszerelés használatát."],
  ["Hogyan foglalhatok?", "A foglalási oldalon válaszd ki a megfelelő időpontot, vagy írj nekünk e-mailt."]
] : [
  ["When can I use the studio?", "By appointment: Monday to Friday 09:00–22:00 and weekends 10:00–22:00."],
  ["Can first-time creatives book?", "Yes. We will show you the basics of using the studio equipment on site."],
  ["How do I book?", "Choose a suitable time on the booking page, or email us with your idea."]
];

export { navGroups, pageByPath, site };
