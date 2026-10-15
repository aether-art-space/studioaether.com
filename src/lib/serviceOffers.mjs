import { site } from "../data/routes.mjs";
import { studioPricing } from "../data/studioPricing.mjs";
import { bookingExtrasFor } from "../data/bookingExtras.mjs";
import { idPhotoPricing } from "../data/idPhotoPricing.mjs";
import {
  selfieContent, residentArtistContent, modelsContent, packagesContent,
  serviceContent, mentoringContent, photoPackageSets, equipmentCaptions, propsContent
} from "../data/content.mjs";


/**
 * Build Schema.org Offer records for the priced services visible on a page.
 * `page` is a route record from src/data/routes.mjs (`path`, `language`,
 * `alternatePaths`). Only prices actually presented on that page are emitted.
 */
export function serviceOffersFor(page, { origin = site.domain } = {}) {
  const PROVIDER = { "@id": `${origin}/#business` };
  if (!page || typeof page !== "object") return [];
  const lang = ["hu", "de"].includes(page.language) ? page.language : "en";
  const path = page.path || "/";
  const route = (key) => Object.values(page.alternatePaths || {}).includes(key);
  const pageUrl = `${origin}${path}`;
  const offers = [];
  const slug = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Prices use locale-specific grouping separators but always represent HUF.
  const money = (input) => {
    const text = String(input ?? "").trim();
    if (!text || /quote|aj[aá]nlat|angebot/i.test(text)) return null;
    // Isolate the currency amount before parsing so trailing units such as
    // “30 min”, “3 lessons” or “per person” cannot become part of the price.
    const currency = /HUF|Ft/i.exec(text);
    let amountText;
    if (currency) {
      amountText = !/\d/.test(text.slice(0, currency.index))
        ? text.slice(currency.index + currency[0].length).split("/")[0]
        : text.slice(0, currency.index);
    } else {
      amountText = text.split("/")[0];
    }
    const chunks = [...amountText.matchAll(/\d{1,3}(?:[.,\s]\d{3})+|\d+/g)].map((m) => m[0].trim()).filter(Boolean);
    const number = (s) => {
      const digits = s.replace(/[^\d]/g, "");
      return digits ? Number(digits) : null;
    };
    const range = chunks.length > 1 && /(?:–|—|-|\bto\b)/i.test(amountText) ? [null, chunks[0], chunks[1]] : null;
    const amount = number(range ? range[1] : chunks[0] || "");
    if (!Number.isFinite(amount)) return null;
    return { amount, max: range ? number(range[2]) : undefined, from: /\bfrom\b|\bab\b|t[oó]l\b|kezd[aő]?[aá]r/i.test(text), hourly: /\/\s*(?:hour\b|h\b|stunde\b|[oó]ra)|(?:per|pro)\s+(?:hour|stunde)/i.test(text), unit: /30\s*(?:min|perc)/i.test(text) ? "30 minutes" : /half\s*day|halber?\s*tag|f[eé]l\s*nap/i.test(text) ? "half-day" : /\/\s*photo|per\s+photo|\/\s*f[oó]t[oó]/i.test(text) ? "photo" : /\/\s*(?:person|f[oő])/i.test(text) ? "person" : /\/\s*(?:shoot|booking)|per\s+booking|per\s+shoot/i.test(text) ? "booking" : null };
  };
  const add = ({ name, description, price, url = pageUrl, service = name, anchor, unitContext = "" }) => {
    const parsed = typeof price === "number" ? { amount: price } : money(price);
    if (!parsed || !Number.isFinite(parsed.amount)) return;
    const unitSource = `${price} ${unitContext}`;
    parsed.hourly ||= /\/\s*(?:hour\b|h\b|stunde\b|[oó]ra)|(?:per|pro)\s+(?:hour|stunde)/i.test(unitSource);
    parsed.unit ||= /per booking|pro Buchung|foglalás(?:onként)?|\/shoot|per shoot/i.test(unitSource) ? "booking" : /\/\s*Foto/i.test(unitSource) ? "photo" : null;
    const target = anchor ? `${url}#${anchor}` : url;
    const id = `${pageUrl}#offer-${slug(name) || "service"}`;
    const itemOffered = { "@type": "Service", name: service, provider: PROVIDER };
    if (description) itemOffered.description = description;
    const offer = { "@type": "Offer", "@id": id, url: target, name, itemOffered, seller: PROVIDER };
    if (!parsed.from && !parsed.max) {
      offer.price = parsed.amount;
      offer.priceCurrency = "HUF";
    }
    if (parsed.hourly) {
      offer.priceSpecification = {
        "@type": "UnitPriceSpecification",
        ...(parsed.from || parsed.max ? { minPrice: parsed.amount, ...(parsed.max ? { maxPrice: parsed.max } : {}) } : { price: parsed.amount }),
        priceCurrency: "HUF",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "HUR" }
      };
    } else if (parsed.from || parsed.max) {
      offer.priceSpecification = { "@type": parsed.unit ? "UnitPriceSpecification" : "PriceSpecification", minPrice: parsed.amount, ...(parsed.max ? { maxPrice: parsed.max } : {}), priceCurrency: "HUF", ...(parsed.unit ? { unitText: parsed.unit } : {}) };
    } else {
      if (parsed.unit) offer.priceSpecification = { "@type": "UnitPriceSpecification", price: parsed.amount, priceCurrency: "HUF", unitText: parsed.unit };
    }
    offers.push(offer);
  };
  const addPackages = (items, anchor, serviceName) => (items || []).forEach((item) => add({
    name: item.title, description: [item.description, item.price, ...(item.features || []), ...(item.includes || []), item.free].filter(Boolean).join("; "),
    price: item.price, anchor, service: serviceName
  }));

  if (route("/booking")) {
    [
      { name: lang === "hu" ? "Kedvezményes stúdióidősáv" : lang === "de" ? "Vergünstigtes Studio-Zeitfenster" : "Discounted studio timeslot", price: studioPricing.discounted, description: "Monday–Thursday, 09:00–18:00." },
      { name: lang === "hu" ? "Standard stúdióidősáv" : lang === "de" ? "Standard-Studio-Zeitfenster" : "Standard studio timeslot", price: studioPricing.standard, description: "Monday–Thursday, 18:00–22:00; Friday–Sunday, 09:00–22:00." },
      { name: lang === "hu" ? "10 órás stúdióbérlet" : lang === "de" ? "10-Stunden-Studiopass" : "10-hour studio pass", price: studioPricing.pass, description: "Ten hours, usable in hourly increments, any day from 10:00–22:00." }
    ].forEach((x, i) => add({ ...x, price: i < 2 ? `${x.price} HUF/hour` : x.price, anchor: "studio-pricing", service: "Photography studio rental" }));
    bookingExtrasFor(lang).forEach(([name, condition, price]) => add({
      name, description: condition, price, unitContext: condition, anchor: "extras-section-title", service: name
    }));
  }

  if (route("/selfie-studio-budapest")) {
    const content = selfieContent[lang];
    (content?.prices || []).forEach(([name, details, price]) => add({ name, description: (details || []).join("; "), price, anchor: "selfie-prices-title", service: "Self-service photography studio" }));
  }
  if (route("/packages")) addPackages(packagesContent[lang]?.packages, null, "Studio photoshoot package");
  if (route("/photographers-budapest")) addPackages(residentArtistContent.photographers[lang]?.packages, "", "Photoshoot with resident photographer");
  if (route("/stylists")) addPackages(residentArtistContent.stylists[lang]?.packages, "", "Professional styling service");
  if (route("/make-up-artists")) (residentArtistContent.makeup[lang]?.profiles || []).forEach((p) => add({ name: `${p.name} — ${p.role}`, description: p.specialties, price: p.price, service: "Make-up and hair styling" }));
  if (route("/models-budapest")) {
    const m = modelsContent[lang];
    add({ name: m.feeTitle, price: m.feePrice, service: "Model booking" });
    (m?.pricing?.cards || []).forEach((c) => add({ name: c.title, description: c.description, price: `${c.description || ""} ${c.price}`, service: "Model booking" }));
    if (m?.animal) add({ name: `${m.animal.name} photo model`, description: m.animal.description, price: `${m.animal.priceLabel || ""} ${m.animal.price}`, service: "Animal model booking" });
  }
  if (route("/model-polaroids-budapest")) addPackages(photoPackageSets.models[lang], "special-packages-title", "Model digitals and portfolio photoshoot");
  if (route("/portrait-photography-budapest")) addPackages(photoPackageSets.portrait[lang], "portrait-packages-title", "Portrait photography");
  if (route("/fitness")) addPackages(serviceContent.fitness[lang]?.packages, "fitness-packages-title", "Fitness photography");
  if (route("/glamour-boudoir-photography-budapest")) addPackages(photoPackageSets.glamour[lang], "special-packages-title", "Glamour and boudoir photography");
  if (route("/pet-photography-budapest")) addPackages(photoPackageSets.pet[lang], "special-packages-title", "Pet photography");
  if (route("/corporate-photography-budapest")) addPackages(serviceContent.corporate[lang]?.packages, "corporate-packages-title", "Corporate photography");
  if (route("/id-photo")) {
    const names = lang === "hu" ? ["Digitális igazolványkép / útlevélkép", "Digitális és nyomtatott igazolványkép (4 db)"] : lang === "de" ? ["Digitales Pass- und Ausweisfoto", "Digitales und gedrucktes Passfoto (4 Abzüge)"] : ["Digital ID / passport photo", "Digital and printed ID / passport photo (4 prints)"];
    [idPhotoPricing.digital, idPhotoPricing.printed].forEach((price, i) => add({ name: names[i], price, description: "Standard 3 × 5 cm photo on a white background; final images within an hour. Printed set contains four prints.", service: "ID and passport photography" }));
  }
  if (route("/photographer-mentoring-budapest")) addPackages(mentoringContent[lang]?.packages, "", "Photography mentoring");
  if (path.endsWith("photographer-daniel") || path.endsWith("photographer-alexandra")) {
    const key = path.endsWith("photographer-alexandra") ? "alexandra" : "daniel";
    // These pages render the same three visible profile packages and prices.
    addPackages(residentArtistContent.photographers[lang]?.packages, "", `Photoshoot with ${key === "daniel" ? "Dániel Z. Aczél" : "Alexandra Kulcsár-Horváth"}`);
  }
  if (route("/christmas-photoshoot")) addPackages(photoPackageSets.christmas[lang], "seasonal-packages-title", "Christmas photoshoot");
  if (route("/christmas-studio")) [
    { name: "Discounted Christmas studio timeslot", price: `${studioPricing.discounted} HUF/hour`, description: "Monday–Thursday, 09:00–18:00." },
    { name: "Standard Christmas studio timeslot", price: `${studioPricing.standard} HUF/hour`, description: "Monday–Thursday, 18:00–22:00; Friday–Sunday, 09:00–22:00." },
    { name: "10-hour Christmas studio pass", price: studioPricing.pass, description: "Ten hours, usable in hourly increments, any day from 10:00–22:00." }
  ].forEach((x) => add({ ...x, service: "Christmas studio rental" }));

  if (route("/props")) {
    for (const section of propsContent[lang].sections) for (const gallery of section.galleries) {
      if (gallery.infoPrice) add({ name: gallery.title || section.heading, price: gallery.infoPrice, description: gallery.info, service: "Wardrobe rental" });
    }
  }

  if (route("/equipment")) {
    const captions = equipmentCaptions[lang];
    for (const [group, rows] of Object.entries(captions || {})) for (const item of rows || []) {
      if (!item.price) continue;
      add({ name: item.title, description: item.detail, price: item.price, service: "Equipment rental", anchor: group === "lenses" ? "lenses-for-rent" : group === "cameras" ? "cameras-for-rent" : undefined });
    }
  }
  return offers;
}
