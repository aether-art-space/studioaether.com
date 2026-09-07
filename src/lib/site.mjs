import { navGroups, pageByPath, site } from "../data/routes.mjs";

export const siteUrl = () => (import.meta.env.PUBLIC_SITE_URL || site.domain).replace(/\/+$/, "");

const basePath = (import.meta.env.PUBLIC_BASE_PATH || "").replace(/^\/+|\/+$/g, "");
const basePrefix = basePath ? `/${basePath}` : "";

export const sitePath = (path) => {
  if (!path || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path) || !path.startsWith("/")) return path;
  return `${basePrefix}${path}`;
};

export const absoluteUrl = (path) => new URL(sitePath(path), `${siteUrl()}/`).toString();

const bookingFooterDecisions = {
  all: new Set([
    "/", "/hu",
    "/studio", "/hu/studio",
    "/equipment", "/hu/equipment",
    "/props", "/hu/props",
    "/booking", "/hu/booking",
    "/faq", "/hu/faq",
    "/christmas-studio", "/hu/christmas-studio"
  ]),
  selfieContact: new Set(["/selfie-studio-budapest", "/hu/selfie-studio-budapest"]),
  artists: new Set([
    "/photographers-budapest", "/hu/photographers-budapest",
    "/models-budapest", "/hu/models-budapest",
    "/stylists", "/hu/stylists",
    "/make-up-artists", "/hu/make-up-artists",
    "/packages", "/hu/packages",
    "/commercial-photography-budapest", "/hu/commercial-photography-budapest",
    "/corporate-photography-budapest", "/hu/corporate-photography-budapest",
    "/portrait-photography-budapest", "/hu/portrait-photography-budapest",
    "/fitness", "/hu/fitness",
    "/glamour-boudoir-photography-budapest", "/hu/glamour-boudoir-photography-budapest",
    "/model-polaroids-budapest", "/hu/model-polaroids-budapest",
    "/pet-photography-budapest", "/hu/pet-photography-budapest",
    "/photographer-daniel", "/hu/photographer-daniel",
    "/christmas-photoshoot", "/hu/christmas-photoshoot"
  ]),
  mentoring: new Set([
    "/photographer-mentoring-budapest", "/hu/photographer-mentoring-budapest"
  ]),
  none: new Set([
    "/id-photo", "/hu/id-photo",
    "/privacy-policy", "/hu/privacy-policy",
    "/post-booking", "/hu/post-booking",
    "/wedding-photography", "/hu/wedding-photography"
  ])
};

export const bookingFooterVariantFor = (page) => {
  for (const [variant, paths] of Object.entries(bookingFooterDecisions)) {
    if (paths.has(page.path)) return variant === "none" ? null : variant;
  }
  return null;
};

export const localizedPath = (path, language) => {
  const page = pageByPath.get(path);
  const localized = !page
    ? path
    : language === "hu" && page.language === "en" ? (page.counterpartPath || path) : path;
  return sitePath(localized);
};

export const localizedNav = (language) => navGroups.map((group) => ({
  ...group,
  label: language === "hu" ? group.huLabel : group.label,
  links: group.links.map(([path, label, huLabel, anchor]) => [
    `${localizedPath(path, language)}${anchor ? `#${anchor}` : ""}`,
    language === "hu" ? huLabel : label
  ])
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

const faqParagraph = (text) => ({ type: "paragraph", text });
const faqList = (items) => ({ type: "list", items });

const faqItemsEn = [
  ["What is aether art space?", [faqParagraph("Aether Art Space is a professional yet welcoming photo studio in the heart of Budapest, offering studio rental, equipment, props, wardrobe and creative services for photographers and other creatives.")]],
  ["Is the studio suitable for beginners?", [faqParagraph("The studio is perfect for first timers and beginners. We help you set the lights and your camera for free at the beginning of your shoot if you wish. You can also ask for full assistance for 4,000 HUF/hour.")]],
  ["What are the studio opening hours?", [faqList(["The studio is open by appointment only.", "Monday–Friday: 09:00–22:00", "Saturday–Sunday: 10:00–22:00"])]],
  ["What is the studio layout and size?", [faqList(["The studio has two rooms.", "The ceiling is 4.2 m high.", "There is 10 m of shooting distance from the backdrop and a 60 m² shooting area.", "A separate dressing room with a make-up desk is available."])]],
  ["Are you pet-friendly and can I bring animals?", [faqList(["Yes. The studio is pet-friendly, and animals can be brought for shoots by arrangement."])]],
  ["What equipment and resources are available on site?", [faqList(["Lighting: powerful flash strobes, LED lights and a broad range of light modifiers, including softboxes, umbrellas, beauty dishes, snoots and reflectors.", "Cameras and lenses: analog and digital cameras, including 35mm, medium-format and instant cameras, with lenses that can be used with a rented or your own camera.", "Other equipment: fog machines, tripods and more.", "Props and wardrobe: vintage furniture, outfits, accessories and other creative items, many available to use in the studio."])]],
  ["Can I use my camera with the strobes?", [faqList(["We have on-camera flash triggers compatible with any brand, plus some sync cables for old-school camera types.", "If your camera does not have a hot-shoe, we can use the LED lights instead."])]],
  ["Do you have continuous lighting for video shoots?", [faqList(["Yes, we have LED lighting suitable for both photography and video."])]],
  ["Is it free to use the props and the clothes?", [faqList([{ text: "All props are free to use in the studio - go crazy. Almost all clothes are also free to use in the studio with the exception of few", children: ["antique folk dresses", "bridal dress"] }])]],
  ["Is it hygienic to wear the clothes in the studio?", [faqParagraph("We take care to keep the wardrobe clean between uses. For hygiene, please wear the clothing with underwear; underwear is not provided.")]],
  ["What backdrops and seasonal sets are available?", [faqParagraph("We offer 2.7 m wide paper backdrops, textile backdrops and custom-built backdrops. Seasonal sets, including Christmas decoration, are also available when offered.")]],
  ["What are the pricing and booking options?", [faqList([
    "Discounted studio rate: 7,000 HUF/hour, Monday–Thursday 09:00–18:00.",
    "Standard studio rate: 8,000 HUF/hour, Monday–Thursday 18:00–22:00, Friday 09:00–22:00 and weekends 10:00–22:00.",
    "10-hour membership: 60,000 HUF, usable flexibly by the hour between 10:00 and 22:00.",
    "Outside regular opening hours: 10,000 HUF/hour by email.",
    "Filmings and castings with 5 or more participants: 10,000 HUF/hour.",
    "For make-up, studio rental is half price; it is free during make-up time when working with the studio's make-up artists.",
    { text: "Extras:", children: ["Paper backdrop: 3,000 HUF if stepped on", "Make-up: from 15,000 HUF", "Large Angel Wings: 8,000 HUF", "Assistance in Hungarian or English: 4,000 HUF/hour", "Styling: from 35,000 HUF", "Unique Outfits: from 5,000 HUF", "Camera rental: 4,000–9,000 HUF/hour", "Photo Models: from 15,000 HUF/hour", "Fog Machine: 5,000 HUF", "Aquarium: 39,000 HUF"] }
  ])]],
  ["How can I book the studio?", [faqParagraph("Book through our online booking system or contact us by email."), faqList([{ text: "Open the booking system", href: "/booking" }, { text: "Email photostudio.aether@gmail.com", href: "mailto:photostudio.aether@gmail.com" }])]],
  ["Can I extend my booking while in the studio?", [faqParagraph("If the studio is available after your booking, you can extend your session by the hour at the applicable hourly rate. Setup and tear-down are part of the booked time, so please include them when calculating your reservation.")]],
  ["What is your cancellation policy?", [faqParagraph("Cancellation or rescheduling more than 24 hours but within 7 days before the booking requires payment of 50% of the booking price. Cancellation or rescheduling within 24 hours before the booking requires payment of the full booking price. The same time windows apply when moving a booking to another date.")]],
  ["Who are the resident artists you work with?", [faqParagraph("Resident photographers offer packages: Small (39,000 HUF), Standard (59,000 HUF) and All-inclusive (79,000 HUF). Models can be booked together with the studio. Resident make-up artists, hair stylists and fashion stylists are also available for booking.")]],
  ["Do you have a private changing area?", [faqList(["Yes, we have a whole room dedicated to make-up, preparation and changing in private."])]],
  ["Can I do my make-up and hair in the studio?", [faqList(["Yes, we have a dedicated make-up desk with hair products, hairdryer, hair iron and so on."])]],
  ["Can I take a shower after my shoot?", [faqList(["Yes, we have a shower with shower gel and shampoo if you need it."])]],
  ["Can I iron my clothes in the studio?", [faqList(["Yes, we have an iron, ironing board and a clothes steamer in the studio for you to use."])]],
  ["Are there drinks, coffee, tea in the studio?", [faqParagraph("Coffee, tea and mineral water are all available for free.")]]
];

const faqItemsHu = [
  ["Mi az Aether Art Space stúdió?", [faqParagraph("Az Aether Art Space egy professzionális, ugyanakkor barátságos fotóstúdió Budapest szívében, amely stúdióbérlést, felszerelést, kellékeket, ruhatárat és kreatív szolgáltatásokat kínál fotósoknak és más alkotóknak.")]],
  ["Alkalmas a stúdió kezdőknek is?", [faqParagraph("Igen. A stúdió tökéletes első alkalommal érkezők és kezdők számára. A fotózás elején, ha szeretnéd, ingyen segítünk beállítani a világítást és a fényképezőgépedet. Teljes körű asszisztenciát is kérhetsz 4 000 Ft/óra díjért.")]],
  ["Mikor használható a stúdió?", [faqList(["A stúdió kizárólag előzetes időpontfoglalással használható.", "Hétfő–péntek: 09:00–22:00", "Szombat–vasárnap: 10:00–22:00"])]],
  ["Mekkora és hogyan épül fel a stúdió?", [faqList(["A stúdió két helyiségből áll.", "A belmagasság 4,2 méter.", "A háttértől 10 méteres fotózási távolság és 60 m²-es fotózási terület áll rendelkezésre.", "Külön öltözőszoba sminkasztallal is rendelkezésre áll."])]],
  ["Állatbarát a stúdió? Hozhatok állatot?", [faqParagraph("Igen. A stúdió állatbarát, és előzetes egyeztetéssel állatot is hozhatsz fotózáshoz.")]],
  ["Milyen felszerelés és eszközök érhetők el a helyszínen?", [faqParagraph("Világításként erős vakurendszereket, LED-lámpákat és számos fénymódosítót használhatsz, például softboxokat, ernyőket, beauty dish-eket, snootokat és reflektorokat. Analóg és digitális, többek között 35 mm-es, középformátumú és instant fényképezőgépek, valamint bérelt vagy saját fényképezőgéppel használható objektívek érhetők el. Egyéb felszerelésként füstgépek, állványok és további eszközök állnak rendelkezésre. A vintage bútorok, ruhák, kiegészítők és más kreatív tárgyak közül sok használható a stúdióban.")]],
  ["Használhatom a saját fényképezőgépemet a vakukkal?", [faqParagraph("Igen. Bármely márkával kompatibilis, fényképezőgépre szerelhető vaku-kioldóink, valamint néhány régebbi típushoz szinkronkábeleink is vannak. Ha a fényképezőgépen nincs vakupapucs, LED-világítást tudunk használni.")]],
  ["Van folyamatos fény videózáshoz?", [faqList(["Igen, a LED világításunk fotózáshoz és videózáshoz is alkalmas."])]],
  ["Ingyenes a kellékek és ruhák használata?", [faqList([{ text: "Igen. A stúdióban minden kellék ingyenesen használható. A ruhák nagy része is ingyenes, kivéve:", children: ["antik népviseletek", "menyasszonyi ruha"] }])]],
  ["Higiénikus a ruhák használata?", [faqParagraph("A ruhatár tisztaságára két használat között figyelünk. Higiéniai okokból kérjük, a ruhákat fehérneművel viseld; fehérneműt nem biztosítunk.")]],
  ["Milyen hátterek és szezonális díszletek érhetők el?", [faqParagraph("2,7 méter széles papírháttereket, textil- és egyedi építésű háttereket kínálunk. Szezonális díszletek, többek között karácsonyi dekoráció is elérhető, amikor meghirdetjük.")]],
  ["Mik a bérlési és foglalási lehetőségek?", [faqList([
    "Kedvezményes stúdióár: 7 000 Ft/óra, hétfő–csütörtök 09:00–18:00 között.",
    "Normál stúdióár: 8 000 Ft/óra, hétfő–csütörtök 18:00–22:00, péntek 09:00–22:00 és hétvégén 10:00–22:00 között.",
    "10 órás bérlet: 60 000 Ft, amely óránként rugalmasan használható 10:00 és 22:00 között.",
    "Nyitvatartási időn kívül: 10 000 Ft/óra, e-mailes egyeztetéssel.",
    "5 vagy több résztvevős forgatás és casting: 10 000 Ft/óra.",
    "Sminkeléshez a stúdióbérlés féláron vehető igénybe; a sminkelés ideje alatt ingyenes, ha a stúdió sminkeseivel dolgozol.",
    { text: "Extrák:", children: ["Papírháttér: 3 000 Ft, ha rálépnek", "Smink: 15 000 Ft-tól", "Nagy angyalszárnyak: 8 000 Ft", "Asszisztencia magyar vagy angol nyelven: 4 000 Ft/óra", "Styling: 35 000 Ft-tól", "Egyedi ruhák: 5 000 Ft-tól", "Fényképezőgép-bérlés: 4 000–9 000 Ft/óra", "Fotómodellek: 15 000 Ft/órától", "Füstgép: 5 000 Ft", "Akvárium: 39 000 Ft"] }
  ])]],
  ["Hogyan tudok időpontot foglalni?", [faqParagraph("Az online foglalási rendszeren keresztül foglalhatsz, vagy e-mailben veheted fel velünk a kapcsolatot."), faqList([{ text: "Online foglalási rendszer megnyitása", href: "/hu/booking" }, { text: "E-mail: photostudio.aether@gmail.com", href: "mailto:photostudio.aether@gmail.com" }])]],
  ["Meghosszabbíthatom a foglalásomat a helyszínen?", [faqParagraph("Ha a foglalásod után a stúdió szabad, a fotózást óránként, az aktuális óradíj szerint meghosszabbíthatod. A berendezés és az elpakolás a lefoglalt idő részét képezi, ezért ezeket is számítsd bele a foglalás időtartamába.")]],
  ["Mi a lemondási szabályzatotok?", [faqParagraph("A foglalás előtti 24 órán túl, de 7 napon belül történő lemondás vagy időpont-áthelyezés esetén a foglalási ár 50%-át kell kifizetni. A foglalás előtti 24 órán belüli lemondás vagy időpont-áthelyezés esetén a teljes foglalási árat kell kifizetni. Ugyanezek a határidők vonatkoznak arra is, ha a foglalást másik időpontra szeretnéd áttenni.")]],
  ["Kikkel dolgoztok együtt?", [faqParagraph("A rezidens fotósok csomagjai: Small – 39 000 Ft, Standard – 59 000 Ft és All-inclusive – 79 000 Ft. A modellek a stúdióval együtt foglalhatók. Rezidens sminkesek, fodrászok és fashion stylistok is foglalhatók.")]],
  ["Van külön öltöző?", [faqList(["Igen, egy egész szoba áll rendelkezésre sminkeléshez, előkészületekhez és privát átöltözéshez."])]],
  ["Elkészíthetem a sminkemet és a hajamat a stúdióban?", [faqList(["Igen, külön sminkasztalunk van hajápolási termékekkel, hajszárítóval, hajvasalóval és egyéb eszközökkel."])]],
  ["Le tudok zuhanyozni a fotózás után?", [faqList(["Igen, zuhanyzó áll rendelkezésre, tusfürdővel és samponnal."])]],
  ["Kivasalhatom a ruháimat a stúdióban?", [faqList(["Igen, vasalót, vasalódeszkát és ruhagőzölőt biztosítunk."])]],
  ["Van ital, kávé, tea a stúdióban?", [faqParagraph("A kávé, tea és ásványvíz mind ingyenesen elérhető.")]]
];

export const faqItemsFor = (page) => page.language === "hu" ? faqItemsHu : faqItemsEn;

export const faqGroupsFor = (page) => {
  const headings = page.language === "hu"
    ? ["Az Aether Art Space stúdióról", "Felszerelés és technikai adatok", "Kellékek, ruhák és styling", "Foglalás és árak", "Rezidens művészek és szolgáltatások", "Kényelem"]
    : ["About aether art space studio", "Equipment & Technical", "Props, Wardrobe & Styling", "Booking & Pricing", "Resident Artists & Services", "Facilities & Comfort"];
  const ranges = [[0, 5], [5, 8], [8, 11], [11, 15], [15, 16], [16, 21]];
  const items = faqItemsFor(page);
  return headings.map((heading, index) => [heading, items.slice(ranges[index][0], ranges[index][1])]);
};

export { navGroups, pageByPath, site };
