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
  route("/selfie-studio-budapest", "en", "Selfie studio", "Self Photo Studio in Budapest | Private Selfie Photoshoot | aether", "Aether Selfie Studio", "/hu/selfie-studio-budapest", { priority: "Critical", description: "Enjoy a private, self-service photoshoot in Budapest at Aether Selfie Studio, with studio lighting and a relaxed setup for portraits and content creation." }),
  route("/hu/selfie-studio-budapest", "hu", "Selfie studio", "Szelfi stúdió Budapesten | aether art space", "Aether Szelfi Studio", "/selfie-studio-budapest", { priority: "Critical", description: "Privát, önkiszolgáló szelfi stúdió Budapesten, ahol saját tempódban készíthetsz professzionális portrékat és tartalmakat." }),
  route("/equipment", "en", "Equipment / camera rental", "Photo Studio Equipment in Budapest | aether art space", "equipment", "/hu/equipment", { description: "Explore the photography equipment available at aether art space in Budapest, including studio lighting, modifiers, cameras, lenses and practical production gear." }),
  route("/hu/equipment", "hu", "Equipment / camera rental", "Fotóstúdió felszerelés Budapesten | aether art space", "felszerelés", "/equipment", { description: "Professzionális fotóstúdió-felszerelés Budapesten: vakuk, fényformálók, kamerák, objektívek és egyéb eszközök fotózásokhoz." }),
  route("/props", "en", "Props, wardrobe, furniture", "Photo Props & Furniture in Budapest | aether art space", "props", "/hu/props", { description: "Browse the photo studio’s wardrobe, props, furniture and creative accessories available for shoots at aether art space in Budapest." }),
  route("/hu/props", "hu", "Props, wardrobe, furniture", "Fotós kellékek és bútorok Budapesten | aether art space", "kellékek", "/props", { description: "Egyedi fotós kellékek, ruhák, ékszerek és bútorok kreatív fotózásokhoz az aether art space budapesti stúdiójában." }),

  route("/photographers-budapest", "en", "Resident photographers", "Photographers in Budapest | aether art space", "resident photographers", "/hu/photographers-budapest", { description: "Meet the resident photographers at aether art space in Budapest for portrait, commercial, glamour and creative photography projects." }),
  route("/hu/photographers-budapest", "hu", "Resident photographers", "Fotósok Budapesten | aether art space", "rezidens fotósok", "/photographers-budapest", { description: "Ismerd meg az aether art space rezidens fotósait budapesti portré-, reklám-, glamour- és kreatív fotózásokhoz." }),
  route("/models-budapest", "en", "Resident models", "Models in Budapest | aether art space", "trusted models", "/hu/models-budapest", { description: "Meet models available for photo shoots, campaigns, creative projects, and portfolio work at aether art space in Budapest." }),
  route("/hu/models-budapest", "hu", "Resident models", "Modellek Budapesten | aether art space", "kedvenc modelleink", "/models-budapest", { description: "Ismerd meg az aether art space modelljeit budapesti fotózásokhoz, kreatív projektekhez, kampányokhoz és portfólióépítéshez." }),
  route("/stylists", "en", "Stylists / brand designers", "Stylists & Brand Designers in Budapest | aether art space", "stylists / brand designers", "/hu/stylists", { priority: "Medium", description: "Find stylists and brand designers in Budapest for photoshoots, personal branding, campaigns and creative projects at aether art space." }),
  route("/hu/stylists", "hu", "Stylists / brand designers", "Stylistok és énmárka-tervezők Budapesten | aether art space", "stylistok / énmárka-tervezők", "/stylists", { priority: "Medium", description: "Budapesti stylistok és énmárka-tervezők fotózásokhoz, személyes márkaépítéshez, kampányokhoz és kreatív projektekhez." }),
  route("/make-up-artists", "en", "Make-up / hair artists", "Make-up Artists & Hair Stylists in Budapest | aether art space", "make-up artists / hair stylists", "/hu/make-up-artists", { priority: "Medium", description: "Book make-up artists and hair stylists in Budapest for portrait, glamour, boudoir, commercial and creative photoshoots at aether art space." }),
  route("/hu/make-up-artists", "hu", "Make-up / hair artists", "Sminkesek és fodrászok Budapesten | aether art space", "sminkesek / fodrászok", "/make-up-artists", { priority: "Medium", description: "Profi sminkesek és fodrászok Budapesten portré-, glamour-, boudoir-, reklám- és kreatív fotózásokhoz." }),

  route("/packages", "en", "Photography packages", "Photography Packages in Budapest | aether art space", "all packages and services", "/hu/packages", { priority: "Critical", description: "Book portrait, business, glamour, boudoir, model polaroid, pet, and creative photography packages in Budapest with the resident photographers at aether art space." }),
  route("/hu/packages", "hu", "Photography packages", "Fotózási csomagok Budapesten | aether art space", "fotózási és kombinált csomagjaink", "/packages", { priority: "Critical", description: "Foglalj portré-, üzleti-, glamour-, boudoir-, modellpolaroid-, kisállat- és kreatív fotózási csomagokat Budapesten az aether art space rezidens csapatával." }),
  route("/commercial-photography-budapest", "en", "Commercial photography", "Commercial Photography in Budapest | aether art space", "Commercial Photography in Budapest", "/hu/commercial-photography-budapest", { priority: "Critical", description: "Discover Aether Art Space in Budapest – your partner for high-end commercial photography. Our professional studio delivers polished visuals for product launches, corporate campaigns, and social media, helping brands stand out and build trust." }),
  route("/hu/commercial-photography-budapest", "hu", "Commercial photography", "Reklámfotózás Budapesten | aether art space", "Reklámfotózás Budapesten", "/commercial-photography-budapest", { priority: "Critical", description: "Professzionális reklámfotózás Budapesten termékbevezetésekhez, kampányokhoz, márkaépítéshez és közösségi média tartalmakhoz." }),
  route("/corporate-photography-budapest", "en", "Corporate photography", "Corporate Photography in Budapest: Headshots & Team Photos | aether", "Corporate Photography in Budapest", "/hu/corporate-photography-budapest", { priority: "Critical", description: "Corporate headshots, team photos, and brand images in Budapest, shot in our studio or at your office. Professional photography for small and large teams." }),
  route("/hu/corporate-photography-budapest", "hu", "Corporate photography", "Vállalati fotózás Budapesten: céges portré és csapatfotó | aether", "Vállalati fotózás Budapesten", "/corporate-photography-budapest", { priority: "Critical", description: "Céges portrék, csapatfotók és arculati képek Budapesten, stúdióban vagy irodai helyszínen. Profi fotózás kis és nagy csapatoknak." }),
  route("/portrait-photography-budapest", "en", "Portrait photography", "Portrait Photography in Budapest | Headshots, Dating & Creative Portraits | aether", "Portrait Photography in Budapest", "/hu/portrait-photography-budapest", { priority: "Critical", description: "Professional portrait photography in Budapest for headshots, dating photos, personal branding, lifestyle portraits, and creative studio images." }),
  route("/hu/portrait-photography-budapest", "hu", "Portrait photography", "Portréfotózás Budapesten | üzleti és lifestyle portré | aether", "Portréfotózás Budapesten", "/portrait-photography-budapest", { priority: "Critical", action: "KEEP EXACT URL; improve only after parity", description: "Professzionális portréfotózás Budapesten üzleti portrékhoz, lifestyle képekhez, társkereső profilfotókhoz és kreatív személyes képekhez." }),
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
  route("/photographer-mentoring-budapest", "en", "Photography mentoring - current nav URL", "Photography Mentoring in Budapest | aether art space", "Photography Mentoring in Budapest", "/hu/photographer-mentoring-budapest", { action: "KEEP EXACT URL; investigate legacy duplicate", disposition: "preserve-pending-search-console", description: "Learn photography with Aether Art Space’s mentoring programs in Budapest. Professional guidance in digital and analogue photography, model shoots, gear and flexible classes tailored to your needs." }),
  route("/hu/photographer-mentoring-budapest", "hu", "Photography mentoring - current nav URL", "Fotós mentorálás Budapesten | aether art space", "Fotográfus Mentorálás Budapesten", "/photographer-mentoring-budapest", { disposition: "preserve-pending-search-console", description: "Fotós mentorálás Budapesten kezdő és fejlődő fotósoknak technikai alapokhoz, stúdióvilágításhoz, portrézáshoz és portfólióépítéshez." }),
  route("/booking", "en", "Studio pricing / booking", "Booking & Prices | aether art space Budapest", "Booking & Prices", "/hu/booking", { priority: "Critical", section: "booking", description: "Book a creative photo studio in Budapest for portraits, commercial shoots, self photo sessions, content creation, and private photo shoots." }),
  route("/hu/booking", "hu", "Studio pricing / booking", "Foglalás és árak | aether art space fotóstúdió Budapest", "Foglalás és árak", "/booking", { priority: "Critical", section: "booking", description: "Foglalj kreatív fotóstúdiót Budapesten portré-, reklám-, szelfi-, tartalomkészítő és privát fotózásokhoz." }),
  route("/faq", "en", "FAQ", "Photo Studio FAQ in Budapest | Booking, Equipment & Photoshoots | aether", "Frequently Asked Questions", "/hu/faq", { nav: false, priority: "High", action: "KEEP EXACT URL; audit stale content", section: "faq", description: "Answers about booking aether art space in Budapest, including studio rental, equipment, backdrops, props, pets, payments, rescheduling, and photoshoots." }),
  route("/hu/faq", "hu", "FAQ", "GYIK | Aether Art Space", "Gyakran Ismételt Kérdések", "/faq", { nav: false, priority: "High", action: "KEEP EXACT URL; audit stale content", section: "faq", description: "Válaszok a foglalásról, stúdiófelszerelésről, hátterekről, kisállatokról, fizetésről és az aether art space budapesti fotóstúdió használatáról." }),
  route("/privacy-policy", "en", "Privacy policy", "Privacy Policy | aether art space", "Privacy Policy", "/hu/privacy-policy", { nav: false, priority: "High", action: "KEEP EXACT URL; legal review", section: "legal", description: "Privacy policy for aether art space, a creative photo studio in Budapest, covering website use, bookings, contact forms, and services." }),
  route("/hu/privacy-policy", "hu", "Privacy policy", "Adatkezelési tájékoztató | Aether Art Space", "Adatkezelési tájékoztató", "/privacy-policy", { nav: false, priority: "High", action: "KEEP EXACT URL; legal review", section: "legal", description: "Az aether art space adatkezelési tájékoztatója a weboldal, a foglalások, a kapcsolatfelvétel és a szolgáltatások használatáról." }),
  route("/mentoring", "en", "LEGACY mentoring URL", "Digital and Analogue Photography Mentoring | Aether Art Space", "Photography Mentoring in Budapest", null, { nav: false, priority: "High", action: "DIRECT 301 TO CURRENT MENTORING URL", disposition: "redirect", redirectTo: "/photographer-mentoring-budapest" }),
  route("/photographer-daniel", "en", "Photographer profile - Dániel", "Dániel Z. Aczél Photographer in Budapest | aether art space", "Dániel Z. Aczél", "/hu/photographer-daniel", { nav: false, priority: "Medium", action: "PRESERVE; sitemap-discovered counterpart", disposition: "preserve-pending-search-console", description: "Meet Dániel Z. Aczél, resident photographer at Aether Art Space. Based in Budapest. He specializes in portrait, boudoir, glamour, and fine art photography, creating collaborative and empowering visual stories." }),
  route("/photographer-alexandra", "en", "Photographer profile - Alexandra", "Alexandra Kulcsár-Horváth Photographer in Budapest | aether art space", "Alexandra Kulcsár-Horváth", "/hu/photographer-alexandra", { nav: false, priority: "Medium", action: "PRESERVE; photographer profile", disposition: "preserve", description: "Meet Alexandra Kulcsár-Horváth, a resident photographer at Aether Art Space in Budapest specialising in wedding, portrait, lifestyle, business and pet photography." }),

  // Sitemap-discovered pages not present in the supplied navigation inventory.
  route("/christmas-photoshoot", "en", "Christmas photoshoot", "Christmas Themed Photography | Aether Art Space", "Christmas Photoshoot", "/hu/christmas-photoshoot", { nav: false, priority: "Medium", action: "PRESERVE URL; content review before cutover", disposition: "preserve-pending-content-review", description: "Celebrate the season with a professional Christmas photoshoot at Aether Art Space in Budapest. Choose from our small, medium, or large photo packages — perfect for couples, families, and groups. Warm atmosphere, holiday treats, and stunning festive photos included." }),
  route("/hu/christmas-photoshoot", "hu", "Christmas photoshoot", "Karácsonyi fotózás Budapesten | aether art space", "Karácsonyi Fotózás", "/christmas-photoshoot", { nav: false, priority: "Medium", action: "PRESERVE URL; content review before cutover", disposition: "preserve-pending-content-review", description: "Karácsonyi fotózás Budapesten ünnepi portrékhoz, páros, családi, baráti és kreatív képekhez az aether art space stúdiójában." }),
  route("/christmas-studio", "en", "Christmas studio", "Christmas Studio in Budapest | aether art space", "Capture the Holiday Spirit in Our Christmas-Themed Studio!", "/hu/christmas-studio", { nav: false, priority: "Medium", action: "PRESERVE URL; seasonal content review before cutover", disposition: "preserve-pending-content-review", description: "Book our photo studio with the seasonal holiday decoration for your Christmas photoshoots in the heart of Budapest." }),
  route("/hu/christmas-studio", "hu", "Christmas studio", "Karácsonyi fotóstúdió Budapesten | aether art space", "Ragadd meg az ünnep hangulatát karácsonyi tematikájú stúdiónkban!", "/christmas-studio", { nav: false, priority: "Medium", action: "PRESERVE URL; seasonal content review before cutover", disposition: "preserve-pending-content-review", description: "Karácsonyi hangulatú fotóstúdió Budapesten ünnepi portrékhoz, családi képekhez, páros fotózáshoz és kreatív tartalmakhoz." }),
  route("/post-booking", "en", "Post-booking confirmation", "post-booking | Aether Art Space", "Thanks for booking!", "/hu/post-booking", { nav: false, priority: "High", action: "PRESERVE URL; conversion-flow review", disposition: "preserve-pending-content-review", section: "booking", description: "Thank you for booking aether art space photostudio for your shoot! We will be waiting for you." }),
  route("/hu/post-booking", "hu", "Post-booking confirmation", "Poszt-foglalás | Aether Art Space", "Köszönjük foglalásod!", "/post-booking", { nav: false, priority: "High", action: "PRESERVE URL; conversion-flow review", disposition: "preserve-pending-content-review", section: "booking", description: "" }),
  route("/wedding-photography", "en", "Wedding photography", "Wedding Photographer Budapest | Natural & Elegant Wedding Photography | aether", "Wedding Photography in Budapest & Across Hungary", "/hu/wedding-photography", { nav: false, priority: "Medium", action: "PRESERVE URL; content/title review before cutover", disposition: "preserve-pending-content-review", description: "Professional wedding photography in Budapest and across Hungary. Natural moments, elegant portraits and flexible coverage for ceremonies, receptions and full wedding days." }),
  route("/hu/wedding-photography", "hu", "Wedding photography", "Esküvői fotózás Budapesten és Magyarországon | aether art space", "Esküvő és jegyes fotózás", "/wedding-photography", { nav: false, priority: "Medium", action: "PRESERVE URL; content/title review before cutover", disposition: "preserve-pending-content-review", description: "Természetes és elegáns esküvői fotózás Budapesten és Magyarország egész területén: őszinte pillanatok, kifinomult portrék és rugalmas csomagok." }),
  route("/hu/photographer-daniel", "hu", "Photographer profile - Dániel", "Dániel Z. Aczél fotós Budapesten | aether art space", "Dániel Z. Aczél", "/photographer-daniel", { nav: false, priority: "Medium", action: "PRESERVE; sitemap-discovered counterpart", disposition: "preserve-pending-search-console", description: "Ismerd meg Dániel Z. Aczél budapesti fotóst, az aether art space alapítóját és portré-, glamour, boudoir, reklám- és kreatív fotózások alkotóját." }),
  route("/hu/photographer-alexandra", "hu", "Photographer profile - Alexandra", "Kulcsár-Horváth Alexandra fotós Budapesten | aether art space", "Kulcsár-Horváth Alexandra", "/photographer-alexandra", { nav: false, priority: "Medium", action: "PRESERVE; photographer profile", disposition: "preserve", description: "Ismerd meg Kulcsár-Horváth Alexandra budapesti rezidens fotóst, aki esküvői, portré-, lifestyle-, üzleti és kisállatfotózással foglalkozik." })
];

export const pageByPath = new Map(pages.map((page) => [page.path, page]));

export const navGroups = [
  {
    label: "the studio",
    huLabel: "a stúdió",
    links: [
      ["/studio", "photo studio", "fotóstúdió"],
      ["/selfie-studio-budapest", "selfie studio", "szelfi stúdió"],
      ["/equipment", "lights & equipment", "fények és eszközök", "light-sources"],
      ["/equipment", "cameras and lenses for rent", "bérelhető kamerák és lencsék", "cameras-for-rent"],
      ["/props", "furniture & props", "bútorok és kellékek", "props-collection"],
      ["/props", "outfits & accessories", "outfitek és kiegészítők", "wardrobe"],
      ["/christmas-studio", "🎄 christmas studio", "🎄 karácsonyi fotóstúdió"]
    ]
  },
  {
    label: "resident artists",
    huLabel: "rezidens művészek",
    links: [
      ["/photographers-budapest", "photographers", "fotósaink"],
      ["/models-budapest", "models", "modelleink"],
      ["/stylists", "stylists & brand designers", "stylistjaink"],
      ["/make-up-artists", "make-up artists and hair stylists", "sminkeseink"]
    ]
  },
  {
    label: "photography services",
    huLabel: "fotós szolgáltatásaink",
    links: [
      ["/packages", "photography packages", "fotózási csomagok"],
      ["/wedding-photography", "wedding photography", "esküvői fotózás"],
      ["/commercial-photography-budapest", "commercial photography", "reklámfotózás"],
      ["/corporate-photography-budapest", "corporate photography", "vállalati fotózás"],
      ["/portrait-photography-budapest", "portrait photography", "portré fotózás"],
      ["/fitness", "fitness and yoga photography", "fitness és jóga fotózás"],
      ["/glamour-boudoir-photography-budapest", "glamour / boudoir / art photography", "glamour, boudoir fotózás"],
      ["/model-polaroids-budapest", "model polaroids / digitals", "model polaroidok / digitalok"],
      ["/pet-photography-budapest", "pet photography", "kisállat fotózás"],
      ["/id-photo", "ID photo", "igazolványkép"],
      ["/christmas-photoshoot", "🎄 christmas photography", "🎄 karácsonyi fotózás"]
    ]
  }
];

export const inventoryPaths = pages.map((page) => page.path);
