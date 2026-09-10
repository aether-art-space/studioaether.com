import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import * as content from "../src/data/content.mjs";
import { managedGalleryLegacySources } from "../src/data/managedGalleries.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "src", "assets", "images");
const managedRoot = path.join(root, "content", "galleries");
const recoveredRoot = path.join(root, "src", "assets", "recovered");
const defaultOutputRoot = path.join(root, "public", "images", "generated");
const outputRoot = path.resolve(process.argv.find((arg) => arg.startsWith("--out="))?.slice(6) || defaultOutputRoot);
const selectedGalleries = new Set((process.argv.find((arg) => arg.startsWith("--galleries="))?.slice(12) || "").split(",").map((gallery) => gallery.trim()).filter(Boolean));
const publicPrefix = "/images/generated";
const widthCandidates = [320, 480, 640, 960, 1280, 1600, 2400];
const thumbCandidates = [160, 320];
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const explicitSources = [
  "/images/wix/jpg/logo-full.jpg",
  "/images/selfie/szeged-logo.avif",
  "/images/selfie/szeged-space.avif",
  "/images/equipment/EFI08382-bnw-highres.jpg"
];

const walk = (value, result) => {
  if (typeof value === "string" && ((value.startsWith("/images/") && !value.startsWith("/images/generated/")) || value.startsWith("/wix-recovered/"))) result.add(value);
  else if (Array.isArray(value)) value.forEach((item) => walk(item, result));
  else if (value instanceof Map) value.forEach((item) => walk(item, result));
  else if (value instanceof Set) value.forEach((item) => walk(item, result));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => walk(item, result));
};

const sourcePaths = new Set(explicitSources);
walk(content, sourcePaths);

const sourceFiles = async (directory, relative = "") => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryRelative = path.join(relative, entry.name);
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await sourceFiles(entryPath, entryRelative));
    else if (supportedExtensions.has(path.extname(entry.name).toLowerCase())) files.push(entryRelative);
  }
  return files;
};

const toSourceUrl = (relative) => `/images/${relative.split(path.sep).join("/")}`;
const toManagedSourceUrl = (relative) => `/images/galleries/${relative.split(path.sep).join("/")}`;
const toRecoveredSourceUrl = (relative) => `/wix-recovered/${relative.split(path.sep).join("/")}`;
const withoutExtension = (relative) => relative.slice(0, -path.extname(relative).length);
const galleryFor = (relative) => relative.split(path.sep)[0];
const includesSelectedGallery = (relative) => selectedGalleries.size === 0 || selectedGalleries.has(galleryFor(relative));
const hashFor = async (filePath) => crypto.createHash("sha1").update(await fs.readFile(filePath)).digest("hex").slice(0, 10);
const dimensionsFor = (metadata) => {
  const rotated = metadata.orientation && metadata.orientation >= 5 && metadata.orientation <= 8;
  const width = rotated ? metadata.height : metadata.width;
  const height = rotated ? metadata.width : metadata.height;
  if (!width || !height) throw new Error(`Unable to determine dimensions for ${metadata.format || "image"}`);
  return { width, height };
};

const variantDimensions = (width, height, targetWidth) => {
  const maximumWidth = Math.min(width, Math.floor((2400 * width) / Math.max(width, height)));
  const outputWidth = Math.min(targetWidth, maximumWidth);
  return { width: outputWidth, height: Math.max(1, Math.round((height * outputWidth) / width)) };
};

const fileNameFor = (relative, hash, label, extension) => {
  const base = withoutExtension(relative);
  return `${base}--${label}--${hash}.${extension}`;
};

const writeVariant = async ({ inputPath, relative, hash, label, width, height, square, format, alpha }) => {
  const extension = format === "jpeg" ? "jpg" : format;
  const fileName = fileNameFor(relative, hash, label, extension);
  const targetPath = path.join(outputRoot, fileName);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  let pipeline = sharp(inputPath, { failOn: "none" }).rotate().toColorspace("srgb");
  pipeline = square
    ? pipeline.resize(width, height, { fit: "cover", position: "attention" })
    : pipeline.resize(width, height, { fit: "inside", withoutEnlargement: true });
  if (format === "avif") pipeline = pipeline.avif({ quality: 48, effort: 4 });
  else if (format === "webp") pipeline = pipeline.webp({ quality: 78, effort: 4 });
  else if (format === "jpeg") pipeline = pipeline.jpeg({ quality: 82, progressive: true, mozjpeg: true });
  else if (format === "png") pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  await pipeline.toFile(targetPath);
  return { src: `${publicPrefix}/${fileName.split(path.sep).join("/")}`, width, height, alpha };
};

const buildFormatSet = async ({ inputPath, relative, hash, label, width, height, square = false, alpha }) => {
  const formats = ["avif", "webp", alpha ? "png" : "jpeg"];
  const variants = {};
  const generated = await Promise.all(formats.map((format) => writeVariant({ inputPath, relative, hash, label, width, height, square, format, alpha })));
  formats.forEach((format, index) => { variants[format] = generated[index]; });
  return variants;
};

const mapLimit = async (items, limit, worker) => {
  const results = new Array(items.length);
  let cursor = 0;
  const run = async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
};

const variantPathsFor = (entry) => [
  ...Object.values(entry.regular || {}).flat(),
  ...Object.values(entry.thumb || {}).flat(),
  ...Object.values(entry.full || {})
].map((variant) => variant.src.replace(`${publicPrefix}/`, ""));

const reusableManifest = async (manifest, referenced) => {
  if (!manifest || manifest.version !== 1 || !manifest.images) return false;
  const expectedSources = referenced.map(toSourceUrl).sort();
  const actualSources = Object.keys(manifest.images).sort();
  if (expectedSources.length !== actualSources.length || expectedSources.some((source, index) => source !== actualSources[index])) return false;

  for (const relative of referenced) {
    const source = toSourceUrl(relative);
    const entry = manifest.images[source];
    if (!entry || entry.source !== source || entry.hash !== await hashFor(path.join(sourceRoot, relative))) return false;
    for (const variantPath of variantPathsFor(entry)) {
      try {
        await fs.access(path.join(outputRoot, variantPath));
      } catch {
        return false;
      }
    }
  }
  return true;
};

const writeManifest = async (manifest) => {
  const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
  await fs.writeFile(path.join(outputRoot, "manifest.json"), serialized, "utf8");
};

const buildEntry = async ({ inputPath, outputRelative, source }) => {
  const [metadata, hash] = await Promise.all([sharp(inputPath, { failOn: "none" }).metadata(), hashFor(inputPath)]);
  const { width: sourceWidth, height: sourceHeight } = dimensionsFor(metadata);
  const alpha = Boolean(metadata.hasAlpha);
  const maximum = variantDimensions(sourceWidth, sourceHeight, 2400);
  const regularWidths = [...new Set(widthCandidates.map((candidate) => variantDimensions(sourceWidth, sourceHeight, candidate).width))].filter((candidate) => candidate > 0);
  const regular = {};
  for (const format of ["avif", "webp", alpha ? "png" : "jpeg"]) regular[format] = [];
  for (const candidateWidth of regularWidths) {
    const dimensions = variantDimensions(sourceWidth, sourceHeight, candidateWidth);
    const variants = await buildFormatSet({ inputPath, relative: outputRelative, hash, label: `${dimensions.width}w`, ...dimensions, alpha });
    for (const [format, variant] of Object.entries(variants)) regular[format].push(variant);
  }
  const thumb = {};
  for (const format of ["avif", "webp", alpha ? "png" : "jpeg"]) thumb[format] = [];
  for (const size of thumbCandidates) {
    const variants = await buildFormatSet({ inputPath, relative: outputRelative, hash, label: `thumb-${size}`, width: size, height: size, square: true, alpha });
    for (const [format, variant] of Object.entries(variants)) thumb[format].push(variant);
  }
  const full = await buildFormatSet({ inputPath, relative: outputRelative, hash, label: "full", ...maximum, alpha });
  return [source, { source, width: sourceWidth, height: sourceHeight, alpha, hash, regular, thumb, full }];
};

const useGeneratedAssetsOnly = async (sources = [...sourcePaths]) => {
  let manifest;
  try {
    manifest = JSON.parse(await fs.readFile(path.join(outputRoot, "manifest.json"), "utf8"));
  } catch (error) {
    throw new Error(`Source originals are absent and the generated image manifest is unavailable: ${error.message}`);
  }

  const missing = sources.filter((source) => !manifest.images?.[source]);
  if (missing.length) throw new Error(`Generated image entries are missing for:\n${missing.join("\n")}`);

  for (const source of sources) {
    const entry = manifest.images[source];
    for (const variant of [
      ...Object.values(entry.regular || {}).flat(),
      ...Object.values(entry.thumb || {}).flat(),
      ...Object.values(entry.full || {})
    ]) {
      if (variant.width > 2400 || variant.height > 2400) throw new Error(`Generated image exceeds cap: ${variant.src}`);
      try {
        await fs.access(path.join(outputRoot, variant.src.replace(`${publicPrefix}/`, "")));
      } catch {
        throw new Error(`Generated image is missing: ${variant.src}`);
      }
    }
  }

  console.log(`Using checked-in image variants (${sources.length} referenced sources; source originals absent).`);
};

const generateRecoveredAssets = async (files) => {
  let manifest;
  try {
    manifest = JSON.parse(await fs.readFile(path.join(outputRoot, "manifest.json"), "utf8"));
  } catch (error) {
    throw new Error(`Cannot extend the generated image manifest for recovered assets: ${error.message}`);
  }

  const referenced = files.filter((relative) => sourcePaths.has(toRecoveredSourceUrl(relative)));
  const expectedSources = [...sourcePaths].filter((source) => source.startsWith("/wix-recovered/"));
  const availableSources = new Set(referenced.map(toRecoveredSourceUrl));
  const missing = expectedSources.filter((source) => !availableSources.has(source) && !manifest.images?.[source]);
  if (missing.length) throw new Error(`Missing recovered source images:\n${missing.join("\n")}`);

  let generated = 0;
  const entries = await mapLimit(referenced, 4, async (relative) => {
    const inputPath = path.join(recoveredRoot, relative);
    const source = toRecoveredSourceUrl(relative);
    const existing = manifest.images[source];
    if (existing?.hash === await hashFor(inputPath)) {
      let reusable = true;
      for (const variantPath of variantPathsFor(existing)) {
        if (!(await fs.access(path.join(outputRoot, variantPath)).then(() => true).catch(() => false))) {
          reusable = false;
          break;
        }
      }
      if (reusable) return [source, existing];
    }
    generated += 1;
    return buildEntry({ inputPath, outputRelative: path.join("wix-recovered", relative), source });
  });
  for (const [source, entry] of entries) manifest.images[source] = entry;
  if (generated) manifest.generatedAt = new Date().toISOString();
  await writeManifest(manifest);
  console.log(`Recovered image sources are up to date (${referenced.length} checked; ${generated} regenerated).`);
};

const removeManifestEntry = async (manifest, source) => {
  const entry = manifest.images?.[source];
  if (!entry) return false;
  await Promise.all(variantPathsFor(entry).map((variantPath) => fs.rm(path.join(outputRoot, variantPath), { force: true })));
  delete manifest.images[source];
  return true;
};

const generateManagedAssets = async (files) => {
  let manifest;
  try {
    manifest = JSON.parse(await fs.readFile(path.join(outputRoot, "manifest.json"), "utf8"));
  } catch (error) {
    throw new Error(`Cannot extend the generated image manifest for managed galleries: ${error.message}`);
  }

  const scopedFiles = files.filter(includesSelectedGallery);
  const referenced = scopedFiles.filter((relative) => sourcePaths.has(toManagedSourceUrl(relative)));
  const expectedSources = [...sourcePaths].filter((source) => source.startsWith("/images/galleries/") && includesSelectedGallery(source.slice("/images/galleries/".length)));
  const availableSources = new Set(referenced.map(toManagedSourceUrl));
  const missing = expectedSources.filter((source) => !availableSources.has(source) && !manifest.images?.[source]);
  if (missing.length) throw new Error(`Missing managed gallery source images:\n${missing.join("\n")}`);

  let generated = 0;
  const entries = await mapLimit(referenced, 4, async (relative) => {
    const inputPath = path.join(managedRoot, relative);
    const source = toManagedSourceUrl(relative);
    const existing = manifest.images[source];
    if (existing?.hash === await hashFor(inputPath)) {
      let reusable = true;
      for (const variantPath of variantPathsFor(existing)) {
        if (!(await fs.access(path.join(outputRoot, variantPath)).then(() => true).catch(() => false))) {
          reusable = false;
          break;
        }
      }
      if (reusable) return [source, existing];
    }
    generated += 1;
    return buildEntry({ inputPath, outputRelative: path.join("galleries", relative), source });
  });
  for (const [source, entry] of entries) manifest.images[source] = entry;

  const staleManagedSources = Object.keys(manifest.images).filter((source) => source.startsWith("/images/galleries/") && includesSelectedGallery(source.slice("/images/galleries/".length)) && !availableSources.has(source));
  const staleLegacySources = selectedGalleries.size === 0 ? [...managedGalleryLegacySources].filter((source) => !sourcePaths.has(source)) : [];
  const removed = await Promise.all([...new Set([...staleManagedSources, ...staleLegacySources])].map((source) => removeManifestEntry(manifest, source)));
  const removedCount = removed.filter(Boolean).length;
  if (generated || removedCount) manifest.generatedAt = new Date().toISOString();
  await writeManifest(manifest);
  const scope = selectedGalleries.size ? ` in ${[...selectedGalleries].join(", ")}` : "";
  console.log(`Managed gallery sources are up to date${scope} (${referenced.length} checked; ${generated} regenerated; ${removedCount} removed).`);
};

const main = async () => {
  const sourceRootExists = await fs.stat(sourceRoot).then((stat) => stat.isDirectory()).catch(() => false);
  const managedRootExists = await fs.stat(managedRoot).then((stat) => stat.isDirectory()).catch(() => false);
  const recoveredRootExists = await fs.stat(recoveredRoot).then((stat) => stat.isDirectory()).catch(() => false);
  if (managedRootExists) await generateManagedAssets(await sourceFiles(managedRoot));
  if (!sourceRootExists) {
    const generatedSources = [...sourcePaths].filter((source) => !source.startsWith("/wix-recovered/") && !source.startsWith("/images/galleries/"));
    if (recoveredRootExists) {
      await useGeneratedAssetsOnly(generatedSources);
      await generateRecoveredAssets(await sourceFiles(recoveredRoot));
    } else await useGeneratedAssetsOnly([...sourcePaths]);
    return;
  }

  const files = await sourceFiles(sourceRoot);
  const available = new Set(files.map(toSourceUrl));
  const missing = [...sourcePaths].filter((source) => !available.has(source));
  if (missing.length) throw new Error(`Missing source images:\n${missing.join("\n")}`);

  const referenced = files.filter((file) => sourcePaths.has(toSourceUrl(file)));
  const unused = files.filter((file) => !sourcePaths.has(toSourceUrl(file)));

  try {
    const existingManifest = JSON.parse(await fs.readFile(path.join(outputRoot, "manifest.json"), "utf8"));
    if (await reusableManifest(existingManifest, referenced)) {
      await writeManifest(existingManifest);
      console.log(`Image variants are up to date (${referenced.length} referenced sources).`);
      return;
    }
  } catch {
    // A missing or invalid manifest triggers a clean generation below.
  }

  await fs.rm(outputRoot, { recursive: true, force: true });
  await fs.mkdir(outputRoot, { recursive: true });

  const manifest = { version: 1, generatedAt: new Date().toISOString(), images: {}, unusedSources: unused.map(toSourceUrl).sort() };
  const entries = await mapLimit(referenced, 4, (relative) => buildEntry({
    inputPath: path.join(sourceRoot, relative),
    outputRelative: relative,
    source: toSourceUrl(relative)
  }));
  for (const [source, entry] of entries) manifest.images[source] = entry;
  await writeManifest(manifest);
  console.log(`Generated ${referenced.length} referenced image sources; ${unused.length} source images are unused.`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
