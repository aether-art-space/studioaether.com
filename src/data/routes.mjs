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
  tracking: {
    googleTagId: process.env.PUBLIC_GOOGLE_TAG_ID || "",
    ga4Id: process.env.PUBLIC_GA4_ID || "",
    googleAdsId: process.env.PUBLIC_GOOGLE_ADS_ID || ""
  }
};

export const pages = [
  route("/", "en", "Homepage", "Photo Studio in Budapest | aether art space", "photostudio in Budapest tailored for creation", "/hu", { priority: "Critical", section: "home", description: "A creative photo studio in Budapest for professional photographers, first-timers, photoshoots, workshops and resident artists." }),
  route("/hu", "hu", "Homepage", "aether art space - kreatív fotóstúdió Budapesten", "fotóstúdió Budapesten az alkotáshoz kialakítva", "/", { priority: "Critical", section: "home", description: "Kreatív fotóstúdió Budapesten fotózásokhoz, workshopokhoz, felszereléshez és rezidens művészekhez." }),

  route("/studio", "en", "Studio rental / space", "Photo Studio Rental in Budapest | Equipped Creative Studio | aether", "the Studio", "/hu/studio", { priority: "Critical" }),
  route("/hu/studio", "hu", "Studio rental / space", "Fotóstúdió bérlés Budapesten | Felszerelt kreatív stúdió | aether", "a stúdió", "/studio", { priority: "Critical" }),
  route("/selfie-studio-budapest", "en", "Selfie studio", "Self Photo Studio in Budapest | Private Selfie Photoshoot | aether", "Aether Selfie Studio", "/hu/selfie-studio-budapest", { priority: "Critical" }),
  route("/hu/selfie-studio-budapest", "hu", "Selfie studio", "Szelfi stúdió Budapesten | aether art space", "Aether Szelfi Studio", "/selfie-studio-budapest", { priority: "Critical" }),
  route("/equipment", "en", "Equipment / camera rental", "Photo Studio Equipment in Budapest | aether art space", "equipment", "/hu/equipment"),
  route("/hu/equipment", "hu", "Equipment / camera rental", "Fotóstúdió felszerelés Budapesten | aether art space", "felszerelés", "/equipment"),
  route("/props", "en", "Props, wardrobe, furniture", "Photo Props & Furniture in Budapest | aether art space", "props", "/hu/props"),
  route("/hu/props", "hu", "Props, wardrobe, furniture", "Fotós kellékek és bútorok Budapesten | aether art space", "kellékek", "/props"),

  route("/photographers-budapest", "en", "Resident photographers", "Photographers in Budapest | aether art space", "resident photographers", "/hu/photographers-budapest"),
  route("/hu/photographers-budapest", "hu", "Resident photographers", "Fotósok Budapesten | aether art space", "rezidens fotósok", "/photographers-budapest"),
  route("/models-budapest", "en", "Resident models", "Models in Budapest | aether art space", "resident models / models", "/hu/models-budapest"),
  route("/hu/models-budapest", "hu", "Resident models", "Modellek Budapesten | aether art space", "modellek", "/models-budapest"),
  route("/stylists", "en", "Stylists / brand designers", "Stylists & Brand Designers in Budapest | aether art space", "stylists / brand designers", "/hu/stylists", { priority: "Medium" }),
  route("/hu/stylists", "hu", "Stylists / brand designers", "Stylistok és énmárka tervezők Budapesten | aether art space", "stylistok / énmárka tervezők", "/stylists", { priority: "Medium" }),
  route("/make-up-artists", "en", "Make-up / hair artists", "Make-up Artists & Hair Stylists in Budapest | aether art space", "make-up artists / hair stylists", "/hu/make-up-artists", { priority: "Medium" }),
  route("/hu/make-up-artists", "hu", "Make-up / hair artists", "Sminkesek és fodrászok Budapesten | aether art space", "sminkesek / fodrászok", "/make-up-artists", { priority: "Medium" }),

  route("/packages", "en", "Photography packages", "Photography Packages in Budapest | aether art space", "all packages and services", "/hu/packages", { priority: "Critical" }),
  route("/hu/packages", "hu", "Photography packages", "Fotózás csomagok Budapesten | aether art space", "fotózás csomagok / szolgáltatások", "/packages", { priority: "Critical" }),
  route("/commercial-photography-budapest", "en", "Commercial photography", "Commercial Photography in Budapest | aether art space", "Commercial Photography in Budapest", "/hu/commercial-photography-budapest", { priority: "Critical" }),
  route("/hu/commercial-photography-budapest", "hu", "Commercial photography", "Reklámfotózás Budapesten | aether art space", "Reklámfotózás Budapesten", "/commercial-photography-budapest", { priority: "Critical" }),
  route("/corporate-photography-budapest", "en", "Corporate photography", "Corporate Photography in Budapest: Headshots & Team Photos | aether", "Corporate Photography in Budapest", "/hu/corporate-photography-budapest", { priority: "Critical" }),
  route("/hu/corporate-photography-budapest", "hu", "Corporate photography", "Vállalati fotózás Budapesten: céges portré és csapatfotó | aether", "Vállalati fotózás Budapesten", "/corporate-photography-budapest", { priority: "Critical" }),
  route("/portrait-photography-budapest", "en", "Portrait photography", "Portrait Photography in Budapest | Headshots, Dating & Creative Portraits | aether", "Portrait Photography in Budapest", "/hu/portrait-photography-budapest", { priority: "Critical" }),
  route("/hu/portrait-photography-budapest", "hu", "Portrait photography", "Portré Fotózás | Aether Art Space", "Portré Fotózás", "/portrait-photography-budapest", { priority: "Critical", action: "KEEP EXACT URL; improve only after parity" }),
  route("/fitness", "en", "Fitness & yoga photography", "Fitness & Yoga Photography in Budapest | Athlete Branding Photos | aether", "Fitness & Yoga Photography in Budapest", "/hu/fitness", { priority: "Critical" }),
  route("/hu/fitness", "hu", "Fitness & yoga photography", "Fitness és jóga fotózás Budapesten | Aether Art Space", "Fitness / jóga fotózás Budapesten", "/fitness", { priority: "Critical", action: "KEEP URL; FIX TITLE after baseline capture", description: "Fitness és jóga fotózás Budapesten sportolóknak, oktatóknak és márkaépítéshez." }),
  route("/glamour-boudoir-photography-budapest", "en", "Glamour / boudoir / fine-art nude", "Glamour, Boudoir & Fine Art Nude Photography | aether art space", "Glamour, Boudoir & Fine Art Nude Photography", "/hu/glamour-boudoir-photography-budapest", { priority: "Critical" }),
  route("/hu/glamour-boudoir-photography-budapest", "hu", "Glamour / boudoir / fine-art nude", "Glamour, Boudoir és Művészi Akt Fotózás | Aether Art Space", "Glamour, Boudoir és Művészi Akt Fotózás", "/glamour-boudoir-photography-budapest", { priority: "Critical" }),
  route("/model-polaroids-budapest", "en", "Model polaroids / digitals", "Model Polaroids in Budapest | aether art space", "Model Polaroids / Digitals", "/hu/model-polaroids-budapest"),
  route("/hu/model-polaroids-budapest", "hu", "Model polaroids / digitals", "Modell Polaroidok / Digitalok és Portfólió Építő Fotózás | Aether Art Space", "Modell Polaroidok / Digitalok", "/model-polaroids-budapest"),
  route("/pet-photography-budapest", "en", "Pet photography", "Pet Photography in Budapest | aether art space", "Pet Photography in Budapest", "/hu/pet-photography-budapest", { priority: "Medium" }),
  route("/hu/pet-photography-budapest", "hu", "Pet photography", "Kisállat Fotózás | Aether Art Space", "Kisállat Fotózás", "/pet-photography-budapest", { priority: "Medium" }),
  route("/id-photo", "en", "Passport / ID photos", "Passport & ID Photo in Budapest | Fast Prints & Digital Copy | aether", "Fast passport / ID photo", "/hu/id-photo"),
  route("/hu/id-photo", "hu", "Passport / ID photos", "Igazolványkép Budapesten | aether art space", "Gyors igazolvány- vagy útlevélkép készítés", "/id-photo"),
  route("/photographer-mentoring-budapest", "en", "Photography mentoring - current nav URL", "Photography Mentoring in Budapest | aether art space", "Photography Mentoring in Budapest", "/hu/photographer-mentoring-budapest", { action: "KEEP EXACT URL; investigate legacy duplicate", disposition: "preserve-pending-search-console" }),
  route("/hu/photographer-mentoring-budapest", "hu", "Photography mentoring - current nav URL", "Fotós mentorálás Budapesten | aether art space", "Fotós mentorálás Budapesten", "/photographer-mentoring-budapest", { disposition: "preserve-pending-search-console" }),
  route("/booking", "en", "Studio pricing / booking", "Booking & Prices | aether art space Budapest", "Booking / prices", "/hu/booking", { priority: "Critical", section: "booking" }),
  route("/hu/booking", "hu", "Studio pricing / booking", "Foglalás és árak | aether art space fotóstúdió Budapest", "Foglalás / árak", "/booking", { priority: "Critical", section: "booking" }),
  route("/faq", "en", "FAQ", "Photo Studio FAQ in Budapest | Booking, Equipment & Photoshoots | aether", "Frequently Asked Questions", "/hu/faq", { nav: false, priority: "High", action: "KEEP EXACT URL; audit stale content", section: "faq" }),
  route("/hu/faq", "hu", "FAQ", "GYIK | Aether Art Space", "Gyakran Idézett Kérdések", "/faq", { nav: false, priority: "High", action: "KEEP EXACT URL; audit stale content", section: "faq" }),
  route("/privacy-policy", "en", "Privacy policy", "Privacy Policy | aether art space", "Privacy Policy", "/hu/privacy-policy", { nav: false, priority: "High", action: "KEEP EXACT URL; legal review", section: "legal" }),
  route("/hu/privacy-policy", "hu", "Privacy policy", "Privacy Policy | Aether Art Space", "Privacy Policy", "/privacy-policy", { nav: false, priority: "High", action: "KEEP EXACT URL; legal review", section: "legal" }),
  route("/mentoring", "en", "LEGACY mentoring URL", "Digital and Analogue Photography Mentoring | Aether Art Space", "Photography Mentoring in Budapest", null, { nav: false, priority: "High", action: "INVESTIGATE canonical/redirect; do not drop", disposition: "preserve-pending-search-console" }),
  route("/photographer-daniel", "en", "Photographer profile - Dániel", "Dániel Z. Aczél Photographer in Budapest | aether art space", "Photographer profile", null, { nav: false, priority: "Medium", action: "PRESERVE OR REDIRECT intentionally", disposition: "preserve-pending-search-console" })
];

export const pageByPath = new Map(pages.map((page) => [page.path, page]));

export const navGroups = [
  { label: "the studio", links: [["/studio", "photo studio"], ["/selfie-studio-budapest", "selfie studio"], ["/equipment", "lights & equipment"], ["/props", "furniture & props"]] },
  { label: "resident artists", links: [["/photographers-budapest", "photographers"], ["/models-budapest", "models"], ["/stylists", "stylists & brand designers"], ["/make-up-artists", "make-up artists and hair stylists"]] },
  { label: "photography services", links: [["/packages", "packages"], ["/commercial-photography-budapest", "commercial photography"], ["/corporate-photography-budapest", "corporate photography"], ["/portrait-photography-budapest", "portrait photography"], ["/fitness", "fitness and yoga photography"], ["/glamour-boudoir-photography-budapest", "glamour / boudoir / art photography"], ["/model-polaroids-budapest", "model polaroids / digitals"], ["/pet-photography-budapest", "pet photography"], ["/id-photo", "ID photo"]] }
];

export const inventoryPaths = pages.map((page) => page.path);
