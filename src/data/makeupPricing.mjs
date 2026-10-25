import { creativePrice } from "./creativePricing.mjs";
const copy = {
  hu: [
    ["Smink vagy Frizura", "Természetes, kamera előtt is magabiztos megjelenés portréhoz, modellteszthez vagy social media tartalmakhoz.", ["Professzionális smink vagy frizura", "Személyre és a fotózás koncepciójára szabva"]],
    ["Smink és Frizura", "Harmonikus, teljes beauty megjelenés portré-, branding-, portfólió- és glamour fotózásokhoz.", ["Professzionális smink és frizura", "Személyre szabott beauty koncepció", "A fotózás stílusával összehangolt megjelenés"]],
    ["Smink és Frizura", "Karakteres, kreatív beauty styling kampányokhoz, editorial anyagokhoz és prémium brandinghez.", ["Professzionális smink és frizura, egyedi beauty tervvel", "Akár 2 look, előzetes egyeztetés alapján", "Kreatív megoldások és extra beauty elemek igény szerint", "Folyamatos touch-up a fotózás alatt"]]
  ],
  en: [
    ["Make-up or Hair", "A natural, camera-ready look for portraits, model tests or social media content.", ["Professional make-up or hair styling", "Tailored to you and your shoot’s concept"]],
    ["Make-up and Hair", "A complete, harmonious beauty look for portraits, branding, portfolios and glamour shoots.", ["Professional make-up and hair styling", "A personalised beauty concept", "A look coordinated with your shoot’s style"]],
    ["Make-up and Hair", "Distinctive, creative beauty styling for campaigns, editorials and premium branding.", ["Professional make-up and hair with an individual beauty plan", "Up to 2 looks, agreed in advance", "Creative styling and extra beauty elements as needed", "Ongoing touch-ups during the shoot"]]
  ],
  de: [
    ["Make-up oder Haare", "Ein natürlicher, kameratauglicher Look für Porträts, Modeltests oder Social-Media-Inhalte.", ["Professionelles Make-up oder Haarstyling", "Auf dich und dein Shooting-Konzept abgestimmt"]],
    ["Make-up und Haare", "Ein kompletter, harmonischer Beauty-Look für Porträts, Branding, Portfolios und Glamour-Shootings.", ["Professionelles Make-up und Haarstyling", "Ein individuelles Beauty-Konzept", "Ein Look passend zum Stil deines Shootings"]],
    ["Make-up und Haare", "Ausdrucksstarkes, kreatives Beauty-Styling für Kampagnen, Editorials und hochwertiges Branding.", ["Professionelles Make-up und Haarstyling mit individuellem Beauty-Plan", "Bis zu 2 Looks nach vorheriger Absprache", "Kreative Lösungen und zusätzliche Beauty-Elemente nach Bedarf", "Laufende Touch-ups während des Shootings"]]
  ]
};

export const makeupPricing = Object.fromEntries(Object.entries(copy).map(([language, cards]) => [language, cards.map(([subtitle, description, features], index) => ({
  title: ["STANDARD", "SIGNATURE", "EDITORIAL"][index],
  titleAccent: subtitle,
  description,
  price: creativePrice(["makeup", "makeupAndHair", "editorial"][index], language),
  features
}))]));
