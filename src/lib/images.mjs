import fs from "node:fs";
import path from "node:path";

const manifestPath = path.join(process.cwd(), "public", "images", "generated", "manifest.json");
let manifest = { images: {} };
let manifestModified = -1;
const refreshManifest = () => {
  try {
    const modified = fs.statSync(manifestPath).mtimeMs;
    if (modified === manifestModified) return;
    const updated = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    manifest.images = updated.images || {};
    manifestModified = modified;
  } catch {
    // Keep the last valid manifest while the generator is writing it.
  }
};
refreshManifest();

export const imageRoles = {
  hero: { sizes: "100vw" },
  card: { sizes: "(min-width: 1100px) 181px, 150px" },
  decorative: { sizes: "(min-width: 1100px) 181px, 150px" },
  logo: { sizes: "(min-width: 900px) 163px, 126px" },
  gallery: { sizes: "(min-width: 1100px) 22vw, (min-width: 700px) 32vw, 82vw" },
  content: { sizes: "(min-width: 1100px) 50vw, 100vw" },
  thumb: { sizes: "160px" }
};

const sourceFor = (image) => image?.source || image?.src || "";
const fallbackFormat = () => "webp";
const srcsetFor = (variants = []) => variants.map((variant) => `${variant.src.replaceAll(" ", "%20")} ${variant.width}w`).join(", ");

export const resolveImage = (image, role = "content") => {
  if (import.meta.env?.DEV) refreshManifest();
  const source = sourceFor(image);
  const entry = manifest.images[source];
  if (!entry) {
    return {
      source,
      src: source,
      alt: image?.alt || "",
      width: image?.width,
      height: image?.height,
      sizes: imageRoles[role]?.sizes || imageRoles.content.sizes,
      avifSrcset: "",
      webpSrcset: "",
      fallbackSrcset: "",
      lightbox: { avif: source, webp: source, fallback: source, width: image?.width, height: image?.height }
    };
  }

  const variants = role === "thumb" ? entry.thumb : entry.regular;
  const fallback = variants[fallbackFormat(entry)] || variants.jpeg || variants.png || [];
  const firstFallback = fallback[0] || { src: source, width: entry.width, height: entry.height };
  const lightboxFallback = entry.full[fallbackFormat(entry)] || entry.full.jpeg || entry.full.png || entry.full.webp || entry.full.avif;
  const explicitFallback = image?.source && image?.src && image.src !== image.source ? image.src : "";
  return {
    source,
    src: explicitFallback || firstFallback.src,
    alt: image?.alt || "",
    width: role === "thumb" ? firstFallback.width : entry.width,
    height: role === "thumb" ? firstFallback.height : entry.height,
    sizes: image?.sizes || imageRoles[role]?.sizes || imageRoles.content.sizes,
    avifSrcset: srcsetFor(variants.avif),
    webpSrcset: srcsetFor(variants.webp),
    fallbackSrcset: srcsetFor(fallback),
    lightbox: {
      avif: entry.full.avif?.src || "",
      webp: entry.full.webp.src,
      fallback: lightboxFallback.src,
      width: lightboxFallback.width,
      height: lightboxFallback.height
    },
    full: entry.full
  };
};

export const imageDataAttributes = (image, role = "gallery") => {
  const asset = resolveImage(image, role);
  return {
    "data-gallery-src": asset.lightbox.fallback,
    "data-gallery-avif": asset.lightbox.avif,
    "data-gallery-webp": asset.lightbox.webp,
    "data-gallery-fallback": asset.lightbox.fallback,
    "data-gallery-width": String(asset.lightbox.width || ""),
    "data-gallery-height": String(asset.lightbox.height || "")
  };
};

export const imageManifest = manifest;
