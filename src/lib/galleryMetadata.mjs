const capitalize = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const cleanText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

const titleFromAlt = (alt = "", src = "") => {
  const text = cleanText(alt);
  if (text) return capitalize(text.replace(/[.!?]+$/, ""));
  const filename = src.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ");
  return capitalize(filename || "Gallery image");
};

const descriptionFromContext = (alt, title) => {
  const text = cleanText(alt).toLowerCase();
  const name = cleanText(title || alt);

  if (text.includes("model portfolio")) return `${name} image from a model portfolio in Budapest.`;
  if (text.includes("model digitals")) return `${name} from a model digitals session in Budapest.`;
  if (text.includes("make-up work by")) return `${name} created for a photoshoot at aether art space.`;
  if (text.includes("styling work by")) return `${name} created for a studio photoshoot.`;
  if (text.includes("photography by")) return `${name} from the photographer's portfolio.`;
  if (text.includes("fitness")) return `Fitness photography in Budapest for athletes, coaches and active brands.`;
  if (text.includes("glamour") || text.includes("boudoir")) return `Glamour and boudoir photography in Budapest at aether art space.`;
  if (text.includes("pet") || /dog|cat|animal/.test(text)) return `Pet photography in Budapest for animals and their owners.`;
  if (text.includes("wedding")) return `Wedding photography in Hungary.`;
  if (text.includes("mentoring")) return `A moment from a ${text.includes("analogue") ? "analogue" : "digital"} photography mentoring session at aether art space.`;
  if (text.includes("selfie studio")) return `A creative portrait made in the selfie studio.`;
  if (text.includes("studio") || text.includes("photostudio")) return `${capitalize(cleanText(alt).replace(/[.!?]+$/, ""))} at aether art space.`;
  if (text.includes("portrait")) return `Portrait photography at aether art space in Budapest.`;
  if (text.includes("creative work")) return `Creative work photographed at aether art space.`;
  if (text.includes("id photo")) return `Professional ID photo taken at aether art space.`;
  return `${capitalize(cleanText(alt).replace(/[.!?]+$/, ""))}.`;
};

export const inferGalleryMetadata = (image = {}, overrides = {}) => {
  const explicitTitle = cleanText(overrides.title ?? image.title);
  const explicitDescription = cleanText(overrides.description ?? image.description);
  const title = explicitTitle || titleFromAlt(image.alt, image.src);
  const description = explicitDescription || (image.autoMetadata === false ? "" : descriptionFromContext(image.alt, title));
  return { title, description };
};
