const base = "https://www.studioaether.com";

const route = (path, language, purpose, title, h1, counterpartPath, options = {}) => ({
  path,
  url: `${base}${path}`,
  language,
  purpose,
  title,
  h1,
  counterpartPath,
  nav: options.nav ?? true,
  priority: options.priority ?? "High",
  action: options.action ?? "KEEP EXACT URL",
  verification: options.verification ?? "live crawl + source-level head audit",
  disposition: options.disposition ?? "preserve",
  redirectTo: options.redirectTo ?? null,
  description: options.description ?? `${h1} in Budapest at aether art space. Explore the studio, services and booking options.`,
  section: options.section ?? "service"
});

export const site = {
  name: "aether art space",
  domain: base,
  email: "photostudio.aether@gmail.com",
  phone: "+36 70 386 17 39",
  publicAddress: "Lónyay utca 60., 1093 Budapest, Hungary",
  bookingUrl: "https://cal.com/aether-studio/booking",
  selfieBookingUrl: "https://cal.com/aether-studio/selfie-shoot",
  instagramUrl: "https://www.instagram.com/aether.art.space/",
  facebookUrl: "https://www.facebook.com/aetherbudapest",
  mapsUrl: "https://www.google.com/maps/place/aether+art+space/@47.4815598,19.066554,858m/data=!3m2!1e3!4b1!4m6!3m5!1s0x4741dde41b60a103:0x197de13c0a70664f!8m2!3d47.4815598!4d19.066554!16s%2Fg%2F11lmf_6403",
  tracking: {
    googleTagId: process.env.PUBLIC_GOOGLE_TAG_ID || "",
    ga4Id: process.env.PUBLIC_GA4_ID || "",
    googleAdsId: process.env.PUBLIC_GOOGLE_ADS_ID || ""
  }
};

export const pages = [
  route("/", "en", "Homepage", "Photo Studio in Budapest | aether art space", "photostudio in Budapest tailored for creation - both for pros and first timers", "/hu", { priority: "Critical", section: "home", description: "aether art space is a creative photo studio in the heart of Budapest, built for portraits, commercial shoots, self photo sessions, and first-time creators." }),
  route("/hu", "hu", "Homepage", "aether art space - kreatív fotóstúdió Budapesten", "fotóstúdió Budapesten az alkotáshoz kialakítva - profiknak és első alkalmasoknak is", "/", { priority: "Critical", section: "home", description: "Az aether art space kreatív fotóstúdió Budapest szívében portré-, reklám-, szelfi- és első alkalmas fotózásokhoz." }),

  route("/studio", "en", "Studio rental / space", "Photo Studio Rental in Budapest | Equipped Creative Studio | aether", "the Studio", "/hu/studio", { priority: "Critical", description: "Rent a creative photo studio in Budapest with strobes, modifiers, paper backdrops, cameras, furniture, outfits, and props for professional photoshoots." }),
  route("/hu/studio", "hu", "Studio rental / space", "Fotóstúdió bérlés Budapesten | Felszerelt kreatív stúdió | aether", "a stúdió", "/studio", { priority: "Critical", description: "Bérelhető fotóstúdió Budapesten vakukkal, fényformálókkal, papírhátterekkel, kamerákkal, bútorokkal és kellékekkel fotózásokhoz." }),
  route("/selfie-studio-budapest", "en", "Selfie studio", "Self Photo Studio in Budapest | Private Selfie Photoshoot | aether", "Aether Selfie Studio", "/hu/selfie-studio-budapest", { priority: "Critical" }),
  route("/hu/selfie-studio-budapest", "hu", "Selfie studio", "Szelfi stúdió Budapesten | aether art space", "Aether Szelfi Studio", "/selfie-studio-budapest", { priority: "Critical" }),
  route("/equipment", "en", "Equipment / camera rental", "Photo Studio Equipment in Budapest | aether art space", "equipment", "/hu/equipment"),
  route("/hu/equipment", "hu", "Equipment / camera rental", "Fotóstúdió felszerelés Budapesten | aether art space", "felszerelés", "/equipment"),
  route("/props", "en", "Props, wardrobe, furniture", "Photo Props & Furniture in Budapest | aether art space", "props", "/hu/props"),
  route("/hu/props", "hu", "Props, wardrobe, furniture", "Fotós kellékek és bútorok Budapesten | aether art space", "kellékek", "/props"),

  route("/photographers-budapest", "en", "Resident photographers", "Photographers in Budapest | aether art space", "resident photographers", "/hu/photographers-budapest"),
  route("/hu/photographers-budapest", "hu", "Resident photographers", "Fotósok Budapesten | aether art space", "rezidens fotósok", "/photographers-budapest"),
  route("/models-budapest", "en", "Resident models", "Models in Budapest | aether art space", "trusted models", "/hu/models-budapest", { description: "Meet models available for photo shoots, campaigns, creative projects, and portfolio work at aether art space in Budapest." }),
  route("/hu/models-budapest", "hu", "Resident models", "Modellek Budapesten | aether art space", "kedvenc modelleink", "/models-budapest", { description: "Ismerd meg az aether art space modelljeit budapesti fotózásokhoz, kreatív projektekhez, kampányokhoz és portfólióépítéshez." }),
  route("/stylists", "en", "Stylists / brand designers", "Stylists & Brand Designers in Budapest | aether art space", "stylists / brand designers", "/hu/stylists", { priority: "Medium" }),
  route("/hu/stylists", "hu", "Stylists / brand designers", "Stylistok és énmárka tervezők Budapesten | aether art space", "stylistok / énmárka tervezők", "/stylists", { priority: "Medium" }),
  route("/make-up-artists", "en", "Make-up / hair artists", "Make-up Artists & Hair Stylists in Budapest | aether art space", "make-up artists / hair stylists", "/hu/make-up-artists", { priority: "Medium" }),
  route("/hu/make-up-artists", "hu", "Make-up / hair artists", "Sminkesek és fodrászok Budapesten | aether art space", "sminkesek / fodrászok", "/make-up-artists", { priority: "Medium" }),

  route("/packages", "en", "Photography packages", "Photography Packages in Budapest | aether art space", "all packages and services", "/hu/packages", { priority: "Critical", description: "Book portrait, business, glamour, boudoir, model polaroid, pet, and creative photography packages in Budapest with the resident photographers at aether art space." }),
  route("/hu/packages", "hu", "Photography packages", "Fotózás csomagok Budapesten | aether art space", "fotózás és kombinált csomagjaink", "/packages", { priority: "Critical", description: "Foglalj portré, üzleti, glamour, boudoir, modell polaroid, kisállat és kreatív fotózás csomagokat Budapesten az aether art space rezidens csapatával." }),
  route("/commercial-photography-budapest", "en", "Commercial photography", "Commercial Photography in Budapest | aether art space", "Commercial Photography in Budapest", "/hu/commercial-photography-budapest", { priority: "Critical", description: "Discover Aether Art Space in Budapest – your partner for high-end commercial photography. Our professional studio delivers polished visuals for product launches, corporate campaigns, and social media, helping brands stand out and build trust." }),
  route("/hu/commercial-photography-budapest", "hu", "Commercial photography", "Reklámfotózás Budapesten | aether art space", "Reklámfotózás Budapesten", "/commercial-photography-budapest", { priority: "Critical", description: "Professzionális reklámfotózás Budapesten termékbevezetésekhez, kampányokhoz, márkaépítéshez és közösségi média tartalmakhoz." }),
  route("/corporate-photography-budapest", "en", "Corporate photography", "Corporate Photography in Budapest: Headshots & Team Photos | aether", "Corporate Photography in Budapest", "/hu/corporate-photography-budapest", { priority: "Critical", description: "Corporate headshots, team photos, and brand images in Budapest, shot in our studio or at your office. Professional photography for small and large teams." }),
  route("/hu/corporate-photography-budapest", "hu", "Corporate photography", "Vállalati fotózás Budapesten: céges portré és csapatfotó | aether", "Vállalati fotózás Budapesten", "/corporate-photography-budapest", { priority: "Critical", description: "Céges portrék, csapatfotók és arculati képek Budapesten, stúdióban vagy irodai helyszínen. Profi fotózás kis és nagy csapatoknak." }),
  route("/portrait-photography-budapest", "en", "Portrait photography", "Portrait Photography in Budapest | Headshots, Dating & Creative Portraits | aether", "Portrait Photography in Budapest", "/hu/portrait-photography-budapest", { priority: "Critical", description: "Professional portrait photography in Budapest for headshots, dating photos, personal branding, lifestyle portraits, and creative studio images." }),
  route("/hu/portrait-photography-budapest", "hu", "Portrait photography", "Portréfotózás Budapesten | üzleti és lifestyle portré | aether", "Portré Fotózás Budapesten", "/portrait-photography-budapest", { priority: "Critical", action: "KEEP EXACT URL; improve only after parity", description: "Professzionális portréfotózás Budapesten üzleti portrékhoz, lifestyle képekhez, társkereső profilfotókhoz és kreatív személyes képekhez." }),
  route("/fitness", "en", "Fitness & yoga photography", "Fitness & Yoga Photography in Budapest | Athlete Branding Photos | aether", "Fitness & Yoga Photography in Budapest", "/hu/fitness", { priority: "Critical", description: "Fitness and yoga photoshoots in Budapest for trainers, athletes, instructors, and wellness brands. Studio or on-location images for marketing and personal branding." }),
  route("/hu/fitness", "hu", "Fitness & yoga photography", "Fitness és jóga fotózás Budapesten | aether art space", "Fitness és Jóga Fotózás Budapesten", "/fitness", { priority: "Critical", action: "KEEP URL; title corrected from audited Wix baseline", description: "Fitness, jóga és mozgásfotózás Budapesten edzőknek, oktatóknak, márkáknak és sportolóknak kreatív stúdiókörnyezetben." }),
  route("/glamour-boudoir-photography-budapest", "en", "Glamour / boudoir / fine-art nude", "Glamour, Boudoir & Fine Art Nude Photography | aether art space", "Glamour, Boudoir and Fine Art Photography in Budapest", "/hu/glamour-boudoir-photography-budapest", { priority: "Critical", description: "Professional glamour, boudoir, and fine art nude photography in Budapest with elegant, confidence-led portraits in a private creative studio." }),
  route("/hu/glamour-boudoir-photography-budapest", "hu", "Glamour / boudoir / fine-art nude", "Glamour, Boudoir és Művészi Fotózás Budapesten | aether art space", "Glamour, Boudoir és Művészi Fotózás Budapesten", "/glamour-boudoir-photography-budapest", { priority: "Critical", description: "Glamour, boudoir és fine art akt fotózás Budapesten, privát kreatív stúdióban, elegáns és önbizalmat adó portrékkal." }),
  route("/model-polaroids-budapest", "en", "Model polaroids / digitals", "Model Polaroids in Budapest | aether art space", "Model Polaroids / Digitals and Portfolio Photoshoot in Budapest", "/hu/model-polaroids-budapest", { description: "At Aether Art Space in Budapest, we create agency-standard model polaroids, digitals, and full portfolio shoots. Perfect for aspiring and professional models ready to take the first or even next step in their career." }),
  route("/hu/model-polaroids-budapest", "hu", "Model polaroids / digitals", "Modell Polaroidok / Digitalok és Portfólió Építő Fotózás | Aether Art Space", "Modell Polaroidok / Digitalok és Modell Portfólió Fotózás Budapesten", "/model-polaroids-budapest", { description: "Modell polaroid és digitals fotózás Budapesten ügynökségi jelentkezéshez, portfóliófrissítéshez és professzionális bemutatkozó képekhez." }),
  route("/pet-photography-budapest", "en", "Pet photography", "Pet Photography in Budapest | aether art space", "Pet Photography in Budapest", "/hu/pet-photography-budapest", { priority: "Medium", description: "Capture your pet’s unique personality at Aether Art Space in Budapest. Our professional pet photography studio offers a calm, pet-friendly environment with expert lighting, fresh water bowls, and a nearby park for walks — creating natural, heartfelt portraits you’ll cherish." }),
  route("/hu/pet-photography-budapest", "hu", "Pet photography", "Kisállat fotózás Budapesten | aether art space", "Kisállat Fotózás Budapesten", "/pet-photography-budapest", { priority: "Medium", description: "Kreatív kisállat fotózás Budapesten kutyákkal, macskákkal és más kedvencekkel, barátságos stúdióban profi világítással." }),
  route("/id-photo", "en", "Passport / ID photos", "Passport & ID Photo in Budapest | Fast Prints & Digital Copy | aether", "Quick ID or Passport photos", "/hu/id-photo", { description: "Professional passport, visa, ID, and document photos in Budapest. Fast studio session with high-quality prints and digital copies at aether art space." }),
  route("/hu/id-photo", "hu", "Passport / ID photos", "Igazolványkép Budapesten | aether art space", "Gyors igazolvány- vagy útlevélkép készítés", "/id-photo", { description: "Igazolványkép készítés Budapesten hivatalos dokumentumokhoz, önéletrajzhoz, LinkedInhez és professzionális profilképekhez." }),
  route("/photographer-mentoring-budapest", "en", "Photography mentoring - current nav URL", "Photography Mentoring in Budapest | aether art space", "Photography Mentoring in Budapest", "/hu/photographer-mentoring-budapest", { action: "KEEP EXACT URL; investigate legacy duplicate", disposition: "preserve-pending-search-console" }),
  route("/hu/photographer-mentoring-budapest", "hu", "Photography mentoring - current nav URL", "Fotós mentorálás Budapesten | aether art space", "Fotós mentorálás Budapesten", "/photographer-mentoring-budapest", { disposition: "preserve-pending-search-console" }),
  route("/booking", "en", "Studio pricing / booking", "Booking & Prices | aether art space Budapest", "Booking & Prices", "/hu/booking", { priority: "Critical", section: "booking" }),
  route("/hu/booking", "hu", "Studio pricing / booking", "Foglalás és árak | aether art space fotóstúdió Budapest", "Foglalás és árak", "/booking", { priority: "Critical", section: "booking" }),
  route("/faq", "en", "FAQ", "Photo Studio FAQ in Budapest | Booking, Equipment & Photoshoots | aether", "Frequently Asked Questions", "/hu/faq", { nav: false, priority: "High", action: "KEEP EXACT URL; audit stale content", section: "faq" }),
  route("/hu/faq", "hu", "FAQ", "GYIK | Aether Art Space", "Gyakran Idézett Kérdések", "/faq", { nav: false, priority: "High", action: "KEEP EXACT URL; audit stale content", section: "faq" }),
  route("/privacy-policy", "en", "Privacy policy", "Privacy Policy | aether art space", "Privacy Policy", "/hu/privacy-policy", { nav: false, priority: "High", action: "KEEP EXACT URL; legal review", section: "legal" }),
  route("/hu/privacy-policy", "hu", "Privacy policy", "Privacy Policy | Aether Art Space", "Privacy Policy", "/privacy-policy", { nav: false, priority: "High", action: "KEEP EXACT URL; legal review", section: "legal" }),
  route("/mentoring", "en", "LEGACY mentoring URL", "Digital and Analogue Photography Mentoring | Aether Art Space", "Photography Mentoring in Budapest", null, { nav: false, priority: "High", action: "DIRECT 301 TO CURRENT MENTORING URL", disposition: "redirect", redirectTo: "/photographer-mentoring-budapest" }),
  route("/photographer-daniel", "en", "Photographer profile - Dániel", "Dániel Z. Aczél Photographer in Budapest | aether art space", "Photographer profile", "/hu/photographer-daniel", { nav: false, priority: "Medium", action: "PRESERVE; sitemap-discovered counterpart", disposition: "preserve-pending-search-console" }),

  // Sitemap-discovered pages not present in the supplied navigation inventory.
  route("/christmas-photoshoot", "en", "Christmas photoshoot", "Christmas Themed Photography | Aether Art Space", "Christmas Photoshoot", "/hu/christmas-photoshoot", { nav: false, priority: "Medium", action: "PRESERVE URL; content review before cutover", disposition: "preserve-pending-content-review" }),
  route("/hu/christmas-photoshoot", "hu", "Christmas photoshoot", "Karácsonyi fotózás Budapesten | aether art space", "Karácsonyi Fotózás", "/christmas-photoshoot", { nav: false, priority: "Medium", action: "PRESERVE URL; content review before cutover", disposition: "preserve-pending-content-review" }),
  route("/christmas-studio", "en", "Christmas studio", "Christmas Studio in Budapest | aether art space", "Capture the Holiday Spirit in Our Christmas-Themed Studio!", "/hu/christmas-studio", { nav: false, priority: "Medium", action: "PRESERVE URL; seasonal content review before cutover", disposition: "preserve-pending-content-review" }),
  route("/hu/christmas-studio", "hu", "Christmas studio", "Karácsonyi fotóstúdió Budapesten | aether art space", "Ragadd meg az ünnep hangulatát karácsonyi tematikájú stúdiónkban!", "/christmas-studio", { nav: false, priority: "Medium", action: "PRESERVE URL; seasonal content review before cutover", disposition: "preserve-pending-content-review" }),
  route("/post-booking", "en", "Post-booking confirmation", "post-booking | Aether Art Space", "Thanks for booking!", "/hu/post-booking", { nav: false, priority: "High", action: "PRESERVE URL; conversion-flow review", disposition: "preserve-pending-content-review", section: "booking" }),
  route("/hu/post-booking", "hu", "Post-booking confirmation", "Poszt-foglalás | Aether Art Space", "Köszönjük foglalásod!", "/post-booking", { nav: false, priority: "High", action: "PRESERVE URL; conversion-flow review", disposition: "preserve-pending-content-review", section: "booking" }),
  route("/wedding-photography", "en", "Wedding photography", "Wedding Photographer Budapest | Natural & Elegant Wedding Photography | aether", "Wedding Photography in Budapest & Across Hungary", "/hu/wedding-photography", { nav: false, priority: "Medium", action: "PRESERVE URL; content/title review before cutover", disposition: "preserve-pending-content-review" }),
  route("/hu/wedding-photography", "hu", "Wedding photography", "Glamour, Boudoir és Művészi Akt Fotózás | Aether Art Space", "Esküvő és jegyes fotózás", "/wedding-photography", { nav: false, priority: "Medium", action: "PRESERVE URL; live title/content appears mismatched; review before cutover", disposition: "preserve-pending-content-review" }),
  route("/hu/photographer-daniel", "hu", "Photographer profile - Dániel", "Dániel Z. Aczél fotós Budapesten | aether art space", "Dániel Z. Aczél", "/photographer-daniel", { nav: false, priority: "Medium", action: "PRESERVE; sitemap-discovered counterpart", disposition: "preserve-pending-search-console" })
];

export const pageByPath = new Map(pages.map((page) => [page.path, page]));

export const navGroups = [
  { label: "the studio", links: [["/studio", "photo studio"], ["/selfie-studio-budapest", "selfie studio"], ["/equipment", "lights & equipment"], ["/props", "furniture & props"]] },
  { label: "resident artists", links: [["/photographers-budapest", "photographers"], ["/models-budapest", "models"], ["/stylists", "stylists & brand designers"], ["/make-up-artists", "make-up artists and hair stylists"]] },
  { label: "photography services", links: [["/packages", "packages"], ["/commercial-photography-budapest", "commercial photography"], ["/corporate-photography-budapest", "corporate photography"], ["/portrait-photography-budapest", "portrait photography"], ["/fitness", "fitness and yoga photography"], ["/glamour-boudoir-photography-budapest", "glamour / boudoir / art photography"], ["/model-polaroids-budapest", "model polaroids / digitals"], ["/pet-photography-budapest", "pet photography"], ["/id-photo", "ID photo"]] }
];

export const inventoryPaths = pages.map((page) => page.path);
