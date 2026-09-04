import { navGroups, pageByPath, site } from "../data/routes.mjs";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const localizedPath = (path, language) => {
  const page = pageByPath.get(path);
  if (!page) return path;
  return language === "hu" && page.language === "en" ? (page.counterpartPath || path) : path;
};

const localizedNav = (language) => navGroups.map((group) => ({
  ...group,
  links: group.links.map(([path, label]) => [localizedPath(path, language), label])
}));

const introFor = (page) => {
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

const serviceLinks = (page) => {
  const links = localizedNav(page.language).flatMap((group) => group.links)
    .filter(([path]) => path !== page.path)
    .slice(0, 4);
  return links.map(([path, label]) => `<a class="text-link" href="${path}">${escapeHtml(label)}</a>`).join("");
};

const renderHome = (page) => {
  const hu = page.language === "hu";
  return `
    <section class="hero hero--home">
      <div>
        <p class="eyebrow">${hu ? "budapesti fotóstúdió" : "photo studio in Budapest"}</p>
        <h1>${escapeHtml(page.h1)}</h1>
        <p class="hero-lead">${escapeHtml(introFor(page))}</p>
        <div class="actions"><a class="button" data-gtag-event="booking_click" data-gtag-location="home" href="${site.bookingUrl}">${hu ? "stúdió foglalása" : "book the studio"}</a><a class="text-link" href="${hu ? "/hu/studio" : "/studio"}">${hu ? "többet a stúdióról" : "more about the studio"}</a></div>
      </div>
      <div class="hero-mark" aria-hidden="true"><span>aether</span><i>art space</i></div>
    </section>
    <section class="intro-grid">
      <div><p class="eyebrow">${hu ? "a kedvenc fotóstúdiód" : "your new favourite photostudio"}</p><h2>${hu ? "A kreatív folyamat minden részletéhez" : "A space for creating art"}</h2></div>
      <div><p>${hu ? "A stúdiót úgy alakítottuk ki, hogy a fotózásokhoz, workshopokhoz és önálló alkotáshoz szükséges tér, fények, kellékek és segítség egy helyen legyenek." : "Whether you're a professional photographer or an amateur looking for a space to capture your vision, our studio is built to nurture the creative process."}</p><a class="text-link" href="${hu ? "/hu/equipment" : "/equipment"}">${hu ? "felszerelés megtekintése" : "check out our equipment"}</a></div>
    </section>
    <section class="feature-grid">
      ${[
        [hu ? "tágas stúdió" : "spacious studio", hu ? "Alkoss saját projekteden, vagy kérj segítséget a helyszínen." : "Rent our studio for creative projects and workshops." , hu ? "/hu/studio" : "/studio"],
        [hu ? "egyedi bútorok és kellékek" : "unique furniture & props", hu ? "Székek, asztalok, ruhák és kellékek a különleges ötletekhez." : "Chairs, tables, wardrobe and props to give every shoot its own character.", hu ? "/hu/props" : "/props"],
        [hu ? "rezidens alkotók" : "resident artists", hu ? "Fotósok, modellek, sminkesek és stylistok egy helyen." : "Photographers, models, make-up artists and stylists available in-house.", hu ? "/hu/photographers-budapest" : "/photographers-budapest"]
        ].map(([title, copy, href], index) => `<article class="feature"><span class="feature-number">0${index + 1}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(copy)}</p><a class="text-link" href="${href}">${hu ? "felfedezem" : "learn more"}</a></article>`).join("")}
    </section>
    <section class="callout"><p class="eyebrow">${hu ? "első alkalom a stúdióban?" : "first time in a studio?"}</p><h2>${hu ? "Megmutatjuk, hogyan használd a felszerelést." : "We will show you around and teach you how to use our equipment."}</h2><a class="button button--dark" href="${site.bookingUrl}">${hu ? "foglalás" : "book now"}</a></section>`;
};

const renderBooking = (page) => {
  const hu = page.language === "hu";
  return `<section class="hero"><p class="eyebrow">${hu ? "foglalás" : "booking"}</p><h1>${escapeHtml(page.h1)}</h1><p class="hero-lead">${escapeHtml(introFor(page))}</p><div class="actions"><a class="button" data-gtag-event="booking_click" data-gtag-location="booking" href="${site.bookingUrl}">${hu ? "fotóstúdió foglalása" : "book the photo studio"}</a><a class="button button--outline" data-gtag-event="selfie_booking_click" data-gtag-location="booking" href="${site.selfieBookingUrl}">${hu ? "szelfi stúdió foglalása" : "book the selfie studio"}</a></div></section><section class="price-grid"><article><p class="eyebrow">studio rent</p><h2>7.000 HUF / hour</h2><p>${hu ? "A fotóstúdió használata felszereléssel és helyszíni segítséggel." : "Studio rental for your photoshoot, workshop or creative project."}</p></article><article><p class="eyebrow">photoshoots</p><h2>from 39.000 HUF</h2><p>${hu ? "Fotózási csomagok különböző méretű projektekhez." : "Photoshoot packages for projects of different sizes and purposes."}</p></article><article><p class="eyebrow">selfie studio</p><h2>private session</h2><p>${hu ? "Privát fotózás saját tempóban." : "A private, self-directed photo session."}</p></article></section><p class="audit-note">${hu ? "A végleges árlistát és foglalási feltételeket a cutover előtti forrásellenőrzés során kell rögzíteni." : "Final prices and booking terms must be confirmed during the pre-cutover source audit."}</p>`;
};

const renderFaq = (page) => {
  const hu = page.language === "hu";
  const items = hu ? [
    ["Mikor használható a stúdió?", "Időpont-egyeztetéssel hétköznap 09:00–22:00, hétvégén 10:00–22:00 között."],
    ["Kezdők is foglalhatnak?", "Igen. A helyszínen megmutatjuk az alapvető felszerelés használatát."],
    ["Hogyan foglalhatok?", "A foglalási oldalon válaszd ki a megfelelő időpontot, vagy írj nekünk e-mailt."]
  ] : [
    ["When can I use the studio?", "By appointment: Monday to Friday 09:00–22:00 and weekends 10:00–22:00."],
    ["Can first-time creatives book?", "Yes. We will show you the basics of using the studio equipment on site."],
    ["How do I book?", "Choose a suitable time on the booking page, or email us with your idea."]
  ];
  return `<section class="hero"><p class="eyebrow">${hu ? "gyakori kérdések" : "frequently asked questions"}</p><h1>${escapeHtml(page.h1)}</h1><p class="hero-lead">${escapeHtml(introFor(page))}</p></section><section class="faq-list">${items.map(([q, a]) => `<details><summary>${escapeHtml(q)}</summary><p>${escapeHtml(a)}</p></details>`).join("")}</section><p class="audit-note">${hu ? "A csomagárakat, lemondási szabályokat és elérhetőségeket a forrásaudit után kell véglegesíteni." : "Package prices, cancellation rules and contact details must be finalized after the source audit."}</p>`;
};

const renderLegal = (page) => {
  const hu = page.language === "hu";
  return `<section class="hero"><p class="eyebrow">${hu ? "jogi információ" : "legal information"}</p><h1>${escapeHtml(page.h1)}</h1><p class="hero-lead">${escapeHtml(introFor(page))}</p></section><section class="legal-copy"><h2>${hu ? "Adatkezelés" : "Data processing"}</h2><p>${hu ? "Az oldalon küldött üzeneteket és foglalási adatokat kizárólag a megkeresés megválaszolásához és a szolgáltatás teljesítéséhez használjuk." : "Messages and booking information submitted through the site are used to respond to enquiries and provide the requested service."}</p><h2>${hu ? "Kapcsolat" : "Contact"}</h2><p>${escapeHtml(site.email)}<br>${escapeHtml(site.publicAddress)}</p><p class="audit-note">${hu ? "A teljes jogi szöveg és a hivatalos szolgáltatói cím közzététel előtt jogi ellenőrzést igényel." : "The complete legal text and official provider address require legal review before publication."}</p></section>`;
};

const renderService = (page) => {
  const hu = page.language === "hu";
  const purpose = escapeHtml(page.purpose.toLowerCase());
  const lead = page.section === "service" ? introFor(page) : "";
  return `<section class="hero"><p class="eyebrow">${escapeHtml(page.purpose)}</p><h1>${escapeHtml(page.h1)}</h1><p class="hero-lead">${escapeHtml(lead)}</p><div class="actions"><a class="button" data-gtag-event="booking_click" data-gtag-location="service" href="${site.bookingUrl}">${hu ? "érdekel a foglalás" : "check availability"}</a><a class="text-link" href="${hu ? "/hu/packages" : "/packages"}">${hu ? "csomagok megtekintése" : "view photography packages"}</a></div></section><section class="split-copy"><div class="visual-card"><span>${hu ? "budapest" : "budapest"}</span><strong>aether<br>art space</strong></div><div><p class="eyebrow">${hu ? "a lehetőségek" : "made for the process"}</p><h2>${escapeHtml(page.h1)}</h2><p>${hu ? `Az ${purpose} szolgáltatást a budapesti aether art space-ben úgy alakítottuk ki, hogy az alkotáshoz szükséges tér és figyelem egy helyen legyen.` : `Our ${purpose} offering is built around a calm, flexible studio environment with the space and attention your project needs.`}</p><p>${hu ? "A pontos részletekért, elérhetőségért és személyre szabott ajánlatért írj nekünk." : "Contact us for details, availability and a tailored recommendation."}</p><a class="text-link" href="mailto:${site.email}">${hu ? "írj nekünk" : "send us a message"}</a></div></section><section class="related"><p class="eyebrow">${hu ? "kapcsolódó oldalak" : "continue exploring"}</p><div class="related-links">${serviceLinks(page)}</div></section>`;
};

const renderLegacy = (page) => {
  const hu = page.language === "hu";
  return `<section class="hero"><p class="eyebrow">${escapeHtml(page.purpose)}</p><h1>${escapeHtml(page.h1)}</h1><p class="hero-lead">${hu ? "Gyakorlati és személyes támogatás fotósoknak digitális és analóg munkafolyamatokhoz." : "Practical and personal support for photographers working across digital and analogue processes."}</p><div class="actions"><a class="button" href="mailto:${site.email}">${hu ? "kapcsolat" : "get in touch"}</a><a class="text-link" href="${page.path === "/mentoring" ? "/photographer-mentoring-budapest" : "/photographer-mentoring-budapest"}">${hu ? "a mentorálás oldala" : "current mentoring page"}</a></div></section><section class="split-copy"><div><h2>${hu ? "Közös munka, világos következő lépések" : "A clear next step for your photography"}</h2><p>${hu ? "A mentorálás oldalt jelenleg megőrizzük, amíg a Search Console és backlink adatok alapján véglegesítjük a legacy URL sorsát." : "This page is kept during migration while Search Console and backlink data determine the final legacy-URL disposition."}</p></div><div class="audit-note">${escapeHtml(page.action)}</div></section>`;
};

const renderProfile = (page) => `<section class="hero"><p class="eyebrow">photographer profile</p><h1>${escapeHtml(page.h1)}</h1><p class="hero-lead">Dániel Z. Aczél is a photographer and the founder of aether art space in Budapest.</p><div class="actions"><a class="button" href="mailto:${site.email}">contact the studio</a><a class="text-link" href="/photographers-budapest">resident photographers</a></div></section><section class="split-copy"><div><h2>Photography, teaching and a shared studio</h2><p>This indexed profile is kept during migration because it is discoverable outside the primary navigation. Its final preserve-or-redirect decision is intentionally deferred until Search Console and backlink review.</p></div><div class="audit-note">${escapeHtml(page.action)}</div></section>`;

const bodyFor = (page) => {
  if (page.section === "home") return renderHome(page);
  if (page.section === "booking") return renderBooking(page);
  if (page.section === "faq") return renderFaq(page);
  if (page.section === "legal") return renderLegal(page);
  if (page.path === "/mentoring" || page.path === "/photographer-mentoring-budapest" || page.path === "/hu/photographer-mentoring-budapest") return renderLegacy(page);
  if (page.path === "/photographer-daniel") return renderProfile(page);
  return renderService(page);
};

const jsonLdFor = (page) => {
  const languageName = page.language === "hu" ? "Hungarian" : "English";
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${site.domain}${page.path}#webpage`,
    name: page.title,
    url: `${site.domain}${page.path}`,
    inLanguage: languageName,
    isPartOf: { "@id": `${site.domain}/#website` }
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: page.language === "hu" ? "Kezdőlap" : "Home", item: `${site.domain}${page.language === "hu" ? "/hu" : "/"}` },
      ...(page.path !== "/" && page.path !== "/hu" ? [{ "@type": "ListItem", position: 2, name: page.h1, item: `${site.domain}${page.path}` }] : [])
    ]
  };
  const graph = [
    { "@context": "https://schema.org", "@type": "WebSite", "@id": `${site.domain}/#website`, name: site.name, url: site.domain, inLanguage: ["en", "hu"] },
    { "@context": "https://schema.org", "@type": "ProfessionalService", "@id": `${site.domain}/#business`, name: site.name, url: site.domain, email: site.email, telephone: site.phone, address: { "@type": "PostalAddress", streetAddress: "Lónyay utca 60.", postalCode: "1093", addressLocality: "Budapest", addressCountry: "HU" } },
    pageSchema,
    breadcrumb
  ];
  return graph.map((entry) => `<script type="application/ld+json">${JSON.stringify(entry)}</script>`).join("");
};

const headFor = (page) => {
  const alternate = page.counterpartPath ? pageByPath.get(page.counterpartPath) : null;
  const xDefaultPath = page.language === "en" ? page.path : (alternate?.language === "en" ? alternate.path : "/");
  const links = [
    `<link rel="canonical" href="${site.domain}${page.path}">`,
    `<link rel="alternate" hreflang="${page.language}" href="${site.domain}${page.path}">`,
    ...(alternate ? [`<link rel="alternate" hreflang="${alternate.language}" href="${site.domain}${alternate.path}">`] : []),
    `<link rel="alternate" hreflang="x-default" href="${site.domain}${xDefaultPath}">`
  ].join("");
  const tracking = site.tracking.googleTagId || site.tracking.ga4Id || site.tracking.googleAdsId
    ? `<script>window.siteTracking=${JSON.stringify(site.tracking)}</script><script async src="https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(site.tracking.googleTagId || site.tracking.ga4Id || site.tracking.googleAdsId)}"></script><script src="/assets/tracking.js" defer></script>`
    : "";
  return `<title>${escapeHtml(page.title)}</title><meta name="description" content="${escapeHtml(page.description)}"><meta name="robots" content="index,follow"><meta property="og:title" content="${escapeHtml(page.title)}"><meta property="og:description" content="${escapeHtml(page.description)}"><meta property="og:type" content="website"><meta property="og:url" content="${site.domain}${page.path}">${links}${jsonLdFor(page)}${tracking}`;
};

export const renderPage = (page) => {
  const hu = page.language === "hu";
  const groups = localizedNav(page.language);
  const languageHref = page.counterpartPath || (hu ? "/" : "/hu");
  return `<!doctype html>
<html lang="${page.language}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${headFor(page)}
    <link rel="stylesheet" href="/assets/site.css">
  </head>
  <body>
    <a class="skip-link" href="#main">${hu ? "Ugrás a tartalomhoz" : "Skip to content"}</a>
    <header class="site-header">
      <a class="brand" href="${hu ? "/hu" : "/"}" aria-label="${site.name}"><span>aether</span><small>art space</small></a>
      <nav class="header-actions" aria-label="${hu ? "Oldal és nyelv" : "Page and language"}"><a href="${languageHref}">${hu ? "EN" : "HU"}</a><a class="header-book" data-gtag-event="booking_click" data-gtag-location="header" href="${site.bookingUrl}">${hu ? "foglalás" : "book"}</a></nav>
    </header>
    <div class="site-shell">
      <aside class="site-nav" aria-label="${hu ? "Fő navigáció" : "Primary navigation"}">
        ${groups.map((group) => `<div class="nav-group"><p>${escapeHtml(group.label)}</p>${group.links.map(([path, label]) => `<a href="${path}">${escapeHtml(label)}</a>`).join("")}</div>`).join("")}
        <a class="nav-standalone" href="${hu ? "/hu/photographer-mentoring-budapest" : "/photographer-mentoring-budapest"}">${hu ? "mentorálás" : "mentoring"}</a>
        <a class="nav-standalone" href="${hu ? "/hu/booking" : "/booking"}">${hu ? "árak és foglalás" : "prices & booking"}</a>
      </aside>
      <main id="main">${bodyFor(page)}</main>
    </div>
    <footer class="site-footer">
      <div><p class="eyebrow">${hu ? "kapcsolat" : "contact"}</p><a href="mailto:${site.email}">${site.email}</a><br><a href="tel:+36703861739">${site.phone}</a></div>
      <div><p class="eyebrow">${hu ? "nyitvatartás" : "opening hours"}</p><p>APPOINTMENT ONLY<br>Mon–Fri 09:00–22:00<br>Sat–Sun 10:00–22:00</p></div>
      <div><p class="eyebrow">${hu ? "cím" : "address"}</p><p>${site.publicAddress}</p><a href="${hu ? "/hu/faq" : "/faq"}">${hu ? "GYIK" : "FAQ"}</a> · <a href="${hu ? "/hu/privacy-policy" : "/privacy-policy"}">${hu ? "Adatvédelem" : "Privacy"}</a></div>
    </footer>
  </body>
</html>`;
};
