import fs from "node:fs";
import path from "node:path";
import { imageManifest } from "../lib/images.mjs";

const root = path.resolve(process.cwd(), "content", "galleries");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
const legacySources = new Set();

const readJson = (filePath, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
};

const readableName = (fileName) => fileName
  .replace(/\.[a-z0-9]+$/i, "")
  .replace(/[-_]+/g, " ")
  .replace(/\s+/g, " ")
  .trim()
  .replace(/\b\w/g, (character) => character.toUpperCase());

const galleryFiles = (directory) => {
  try {
    return fs.readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort(collator.compare);
  } catch {
    return [];
  }
};

const buildGallery = (slug) => {
  const directory = path.join(root, slug);
  const config = readJson(path.join(directory, "gallery.json"), {});
  return galleryFiles(directory).map((fileName) => {
    const source = `/images/galleries/${slug}/${fileName}`;
    const metadata = config.images?.[fileName] || {};
    const manifestEntry = imageManifest.images?.[source];
    if (metadata.legacySource) legacySources.add(metadata.legacySource);
    return {
      source,
      src: source,
      alt: metadata.alt || config.defaultAlt || readableName(fileName),
      width: manifestEntry?.width || metadata.width,
      height: manifestEntry?.height || metadata.height,
      ...(metadata.title !== undefined ? { title: metadata.title } : {}),
      ...(metadata.description !== undefined ? { description: metadata.description } : {}),
      ...(metadata.autoMetadata !== undefined ? { autoMetadata: metadata.autoMetadata } : {}),
      ...(metadata.objectPosition !== undefined ? { objectPosition: metadata.objectPosition } : {})
    };
  });
};

const galleryDirectories = fs.existsSync(root)
  ? fs.readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
  : [];

export const managedGalleries = Object.fromEntries(galleryDirectories.map((slug) => [slug, buildGallery(slug)]));
export const managedGalleryLegacySources = legacySources;
