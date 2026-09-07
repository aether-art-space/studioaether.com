import fs from "node:fs";
import path from "node:path";

let manifest = { images: {} };
try {
  manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "images", "generated", "manifest.json"), "utf8"));
} catch {
  // The generator runs before build/dev/check; source URLs remain a safe fallback during startup.
}

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
const fallbackFormat = (entry) => entry?.alpha ? "png" : "jpeg";
const srcsetFor = (variants = []) => variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ");

export const resolveImage = (image, role = "content") => {
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
  return {
    source,
    src: firstFallback.src,
    alt: image?.alt || "",
    width: role === "thumb" ? firstFallback.width : entry.width,
    height: role === "thumb" ? firstFallback.height : entry.height,
    sizes: image?.sizes || imageRoles[role]?.sizes || imageRoles.content.sizes,
    avifSrcset: srcsetFor(variants.avif),
    webpSrcset: srcsetFor(variants.webp),
    fallbackSrcset: srcsetFor(fallback),
    lightbox: {
      avif: entry.full.avif.src,
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
