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

const faqItemsEn = [
  ["What is aether art space?", "Aether Art Space is a professional yet inviting photostudio and exhibition venue located in the heart of Budapest, offering everything from studio rental and equipment to props, resident artists (photographers, models, make-up artists), and a dynamic exhibition space for creatives of all levels."],
  ["Is the studio suitable for beginners?", "The studio is perfect for first timers and beginners. We help you set the lights and your camera for free at the beginning of your shoot if you wish, but you can also ask for full assistance for 4000HUF / hour. First time visitors also get 10% off from the studio rent."],
  ["Are you pet-friendly and can I bring animals?", "Yes! The studio is pet-friendly, and you can even book animal models like a white rat snake (\"Lucifer\") for shoots."],
  ["What equipment and resources are available on site?", "Lighting: Godox flash strobes, LED lights, softboxes, beauty dishes, snoots, reflectors. Cameras & Lenses: Hasselblad 500C, Leica R3, Sony A7III, Nikon EM/F80, Chinon CE‑4, Yashica FX‑100, Polaroid, Super 8 and more. Props & Wardrobe: Vintage furniture, outfits, accessories, swords, and more—many available for free. Studio Perks: High ceilings (4 m+), wide shooting distance, backdrops, pet-friendly setup, coffee, sound system, shower, makeup/dressing area."],
  ["Can I use my camera with the strobes?", "We have remote triggers for any kind of camera that has a hot-shoe: dedicated Sony, Canon and Nikon triggers, a universal trigger for all other brands, and sync cables for vintage cameras. If you have a compact camera or something without a hot-shoe we can make it work with our LED lights."],
  ["Do you have continuous lighting for video shoots?", "Yes, we have LED lighting suitable for both photography and video."],
  ["Is it free to use the props and the clothes?", "All props are free to use in the studio - go crazy. Almost all clothes are also free to use in the studio with the exception of a few antique folk dresses and a bridal dress."],
  ["Is it hygienic to wear the clothes in the studio?", "We wash every clothing item after every use. The clothing items can only be used with underwear on. We don't provide underwear."],
  ["What are the pricing and booking options?", "Standard Rental Fees: 6,000 HUF/hr (Mon–Thu daytime), 8,000 HUF/hr evenings/weekends. Membership/Savings: 10‑hour flexible membership for 60,000 HUF (up to 37% savings). Extras: Fog machine at 5,000 HUF/hr, assistance (HU/EN/DE) 4,000 HUF/hr, paper backdrop 3,000 HUF (if stepped on), camera rentals 4,000–9,000 HUF/hr. After-hours Booking: Available at 10,000 HUF/hr by request."],
  ["How can I book the studio?", "You can book via several ways, whichever is comfortable for you: through our booking system on the website, on phone via 0036703861739, or with email at photostudio.aether@gmail.com."],
  ["Can I extend my booking while in the studio?", "If there is noone coming after you, you can."],
  ["What is your cancellation policy?", "You can reschedule your shoots for free. You can cancel your shoot for 50% of the original price - which will be deducted from your next visit. If you don't cancel your shoot and don't show up, or cancel on the same day of your appointment, you will be asked to pay the full price."],
  ["Who are the resident artists you work with?", "Photographers available in-studio with packages: Small Studio (29 000 HUF), Standard Studio (49 000 HUF), All‑Inclusive (69 000 HUF). Models and non-human models (e.g. pet shoots, snake named Lucifer) available for booking with studio. In-house makeup artists available to complete your shoot experience."],
  ["Do you have a private changing area?", "Yes, we have a whole room dedicated to make-up, preparation and changing in private."],
  ["Can I do my make-up and hair in the studio?", "Yes, we have dedicated make-up desk with hair products, hairdryer, hair iron and so on."],
  ["Can I take a shower after my shoot?", "Yes, we have a shower with shower gel and shampoo if you need it."],
  ["Can I iron my clothes in the studio?", "Yes, we have an iron, ironing board and a clothes steamer in the studio for you to use."],
  ["Are there drinks, coffee, tea in the studio?", "Yes, we have coffee, tea and soda available in the studio. Mineral water is free."]
];

const faqItemsHu = [
  ["Mi az Aether Art Space studió?", "Az Aether Art Space egy professzionális, ugyanakkor barátságos fotóstúdió és kiállítótér Budapest szívében, amely mindent kínál a stúdióbérléstől és felszerelésektől kezdve a kellékeken és rezidens művészeken (fotósok, modellek, sminkesek) át, egészen egy dinamikus kiállítótérig minden szintű alkotó számára."],
  ["Alkalmas a stúdió kezdőknek is?", "Igen. A stúdió tökéletes első alkalommal érkezők és kezdők számára. A fotózás elején, ha szeretnéd, ingyen segítünk beállítani a világítást és a fényképezőgépedet, de teljes körű asszisztenciát is kérhetsz 4 000 Ft/óra díjért. Első látogatáskor 10% kedvezményt adunk a stúdióbérlés árából."],
  ["Állatbarát a stúdió? Hozhatok állatot?", "Igen! A stúdió állatbarát, sőt, akár állatmodelleket is foglalhatsz, például a fehér patkánykígyónkat."],
  ["Milyen felszerelés és eszközök érhetők el a helyszínen?", "Világítás: Godox vaku rendszerek, LED lámpák, softboxok, beauty dish-ek, snootok, reflektorok. Fényképezőgépek és objektívek: Hasselblad 500C, Leica R3, Sony A7III, Nikon EM/F80, Chinon CE-4, Yashica FX-100, Polaroid, Super 8 és még sok más. Kellékek és ruhatár: Vintage bútorok, ruhák, kiegészítők, kardok – ezek nagy része ingyenesen használható. Stúdió extrák: 4 méternél magasabb belmagasság, nagy fotózási távolság, hátterek, állatbarát környezet, kávé, hangrendszer, zuhanyzó, smink/öltöző rész."],
  ["Használhatom a saját fényképezőgépemet a vakukkal?", "Igen. Van távirányítónk Sony, Canon és Nikon fényképezőgépekhez, valamint univerzális kioldónk más márkákhoz. Régi (analóg) fényképezőkhöz szinkronkábel is elérhető. Ha kompakt fényképezőgéped van, vagy nincs vakupapucs rajta, LED világítással tudjuk megoldani."],
  ["Van folyamatos fény videózáshoz?", "Igen, a LED világításunk fotózáshoz és videózáshoz is alkalmas."],
  ["Ingyenes a kellékek és ruhák használata?", "Igen. A stúdióban minden kellék ingyenesen használható. A ruhák nagy része is ingyenes, kivéve az antik népviseleteket és a menyasszonyi ruhát."],
  ["Higiénikus a ruhák használata?", "Igen. Minden ruhadarabot minden használat után kimosunk. A ruhákat csak fehérneművel lehet viselni, fehérneműt nem biztosítunk."],
  ["Mik a bérlési és foglalási lehetőségek?", "Óradíjak: 6 000 Ft/óra (H–Cs nappal), 8 000 Ft/óra (esti és hétvégi időpontok). Bérlet/kedvezmény: 10 órás rugalmas bérlet – 60 000 Ft (akár 37% megtakarítás). Extrák: Füstgép – 5 000 Ft/óra; asszisztencia (HU/EN/DE) – 4 000 Ft/óra; papírhátterek (ha rálépnek) – 3 000 Ft; fényképezőgép-bérlés – 4 000–9 000 Ft/óra. Éjszakai bérlés: kérésre 10 000 Ft/óra."],
  ["Hogyan tudok időpontot foglalni?", "A weboldalunkon keresztül, az online foglalási rendszerben, telefonon: +36 70 386 1739, vagy e-mailben: photostudio.aether@gmail.com."],
  ["Meghosszabbíthatom a foglalásomat a helyszínen?", "Igen, ha utánad nincs másik foglalás."],
  ["Mi a lemondási szabályzatotok?", "Az időpontot ingyenesen át lehet tenni másik időpontra. Lemondás esetén a bérlés árának 50%-át számítjuk fel, amit a következő látogatásod árából levonunk. Ha nem mondod le, nem jelensz meg, vagy aznap mondod le, a teljes árat ki kell fizetned."],
  ["Kikkel dolgoztok együtt?", "Fotósok: Small Studio csomag – 29 000 Ft, Standard Studio csomag – 49 000 Ft, All-Inclusive csomag – 69 000 Ft. Modellek: emberi és nem emberi modellek (például háziállatok, „Lucifer” kígyó). Sminkesek: házon belül elérhetők a teljes fotózási élmény érdekében."],
  ["Van külön öltöző?", "Igen, egy egész szoba áll rendelkezésre sminkeléshez, előkészületekhez és privát átöltözéshez."],
  ["Elkészíthetem a sminkemet és a hajamat a stúdióban?", "Igen, külön sminkasztalunk van hajápolási termékekkel, hajszárítóval, hajvasalóval és egyéb eszközökkel."],
  ["Le tudok zuhanyozni a fotózás után?", "Igen, zuhanyzó áll rendelkezésre, tusfürdővel és samponnal."],
  ["Kivasalhatom a ruháimat a stúdióban?", "Igen, vasalót, vasalódeszkát és ruhagőzölőt biztosítunk."],
  ["Van ital, kávé, tea a stúdióban?", "Igen, van kávé, tea és üdítő. Ásványvizet ingyen biztosítunk."]
];

export const faqItemsFor = (page) => page.language === "hu" ? faqItemsHu : faqItemsEn;

export const faqGroupsFor = (page) => {
  const headings = page.language === "hu"
    ? ["Az Aether Art Space stúdióról", "Felszerelés és technikai adatok", "Kellékek, ruhák és styling", "Foglalás és árak", "Rezidens művészek és szolgáltatások", "Kényelem"]
    : ["About aether art space studio", "Equipment & Technical", "Props, Wardrobe & Styling", "Booking & Pricing", "Resident Artists & Services", "Facilities & Comfort"];
  const ranges = [[0, 3], [3, 6], [6, 8], [8, 12], [12, 13], [13, 18]];
  const items = faqItemsFor(page);
  return headings.map((heading, index) => [heading, items.slice(ranges[index][0], ranges[index][1])]);
};

export { navGroups, pageByPath, site };
