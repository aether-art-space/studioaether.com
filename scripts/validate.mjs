import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pages, pageByPath, site } from "../src/data/routes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const targetFor = (routePath) => routePath === "/" ? path.join(dist, "index.html") : path.join(dist, `${routePath.slice(1)}.html`);
const fail = [];
const warnings = [];
const htmlFor = new Map();
const generatedRoot = path.join(dist, "images", "generated");
const indexablePages = pages.filter((page) => page.disposition !== "redirect");
const intentionallyUndescribed = new Set(["/hu/post-booking"]);
const allowedOriginalImages = new Set(["/hero-main-people.jpg"]);

for (const page of indexablePages) {
  try { htmlFor.set(page.path, await fs.readFile(targetFor(page.path), "utf8")); }
  catch { fail.push(`missing generated file: ${page.path}`); }
}

const redirects = await fs.readFile(path.join(dist, "_redirects"), "utf8").catch(() => "");
for (const page of pages.filter((route) => route.disposition === "redirect")) {
  const expected = `${page.path} ${page.redirectTo} 301`;
  if (!redirects.split("\n").some((line) => line.trim() === expected)) fail.push(`missing direct redirect: ${expected}`);
}

const titleSeen = new Map();
const h1Seen = new Map();
const hasMeta = (html, attributeName, value) => html.match(new RegExp(`<meta\\b[^>]*${attributeName}=["']${value.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}["'][^>]*content=["'][^"']+["']`, "i"));
for (const page of indexablePages) {
  const html = htmlFor.get(page.path) || "";
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  const h1s = [...html.matchAll(/<h1\b[^>]*>(.*?)<\/h1>/gis)].map((match) => match[1].replace(/<[^>]+>/g, "").trim());
  if (!title) fail.push(`missing title: ${page.path}`);
  if (h1s.length !== 1) warnings.push(`h1 count ${h1s.length} in ${page.path}`);
  if (title) titleSeen.set(title, [...(titleSeen.get(title) || []), page.path]);
  if (h1s[0]) h1Seen.set(`${page.language}:${h1s[0]}`, [...(h1Seen.get(`${page.language}:${h1s[0]}`) || []), page.path]);

  const canonicalTag = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0] || "";
  const canonical = canonicalTag.match(/\bhref=["']([^"']+)["']/i)?.[1] || "";
  if (!canonicalTag || canonical !== `${site.domain}${page.path}`) fail.push(`canonical mismatch: ${page.path}`);
  const hreflang = page.language === "hu" ? "hu-hu" : "en-us";
  if (!html.includes(`hreflang="${hreflang}"`)) fail.push(`self hreflang missing: ${page.path}`);
  if (!intentionallyUndescribed.has(page.path) && !html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+[^>]*>/i)) fail.push(`missing description: ${page.path}`);
  for (const [attributeName, value] of [
    ["property", "og:title"],
    ["property", "og:type"],
    ["property", "og:site_name"],
    ["property", "og:locale"],
    ["property", "og:locale:alternate"],
    ["property", "og:url"],
    ["property", "og:image"],
    ["property", "og:image:secure_url"],
    ["property", "og:image:type"],
    ["property", "og:image:width"],
    ["property", "og:image:height"],
    ["property", "og:image:alt"],
    ["name", "twitter:card"],
    ["name", "twitter:title"],
    ["name", "twitter:image"],
    ["name", "twitter:image:alt"],
    ["name", "twitter:url"]
  ]) if (!hasMeta(html, attributeName, value)) fail.push(`missing social metadata ${value}: ${page.path}`);
  if (page.description && !hasMeta(html, "name", "twitter:description")) fail.push(`missing social description: ${page.path}`);
  if (!html.match(/<meta\b[^>]*property=["']og:image["'][^>]*content=["']https:\/\//i)) fail.push(`og:image is not absolute: ${page.path}`);
  if (!html.match(/<link\b[^>]*rel=["']icon["'][^>]*href=["'][^"']+\.(?:png|ico|svg)(?:\?[^"']*)?["']/i)) fail.push(`favicon missing: ${page.path}`);
  if (!html.match(/<link\b[^>]*rel=["']apple-touch-icon["'][^>]*href=["'][^"']+\.(?:png|ico|svg)(?:\?[^"']*)?["']/i)) fail.push(`apple touch icon missing: ${page.path}`);

  const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => tag);
  for (const tag of imageTags) {
    const isLightboxImage = /data-lightbox-image/.test(tag);
    const src = tag.match(/\bsrc=["']([^"']*)["']/i)?.[1] || "";
    const isSvgImage = /\.svg(?:[?#]|$)/i.test(src);
    const isAllowedOriginalImage = allowedOriginalImages.has(src);
    // SVGs are resolution-independent assets and do not need generated raster variants or sizing attributes.
    if (!isLightboxImage && !isSvgImage && src && !src.startsWith("/images/generated/") && !isAllowedOriginalImage) fail.push(`non-generated image source: ${page.path}: ${src}`);
    if (!isLightboxImage && !isSvgImage && (!/\bsrcset=["'][^"']+["']/i.test(tag) || !/\bsizes=["'][^"']+["']/i.test(tag))) fail.push(`responsive attributes missing: ${page.path}`);
    if (!isLightboxImage && !isSvgImage && (!/\bwidth=["'][^"']+["']/i.test(tag) || !/\bheight=["'][^"']+["']/i.test(tag))) fail.push(`image dimensions missing: ${page.path}`);
  }
  for (const match of html.matchAll(/\bdata-gallery-(?:src|avif|webp|fallback)=["']([^"']+)["']/gi)) {
    if (!match[1].startsWith("/images/generated/")) fail.push(`gallery source is not generated: ${page.path}: ${match[1]}`);
  }

  const links = [...html.matchAll(/\bhref=["'](\/(?!\/)[^"'#?]*)/gi)].map((match) => match[1]);
  for (const link of links) {
    if ([
      "/site.css",
      "/content.css",
      "/tracking.js",
      "/fonts/Jitter-Regular-hun-v2.ttf",
      "/fonts/Jura-400.ttf"
    ].includes(link)) continue;
    if (!pageByPath.has(link)) fail.push(`broken internal link ${link} from ${page.path}`);
  }
  if (html.includes('content="noindex')) fail.push(`unexpected noindex in production build: ${page.path}`);
  const jsonLdNodes = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis)].map((match) => JSON.parse(match[1]));
  if (jsonLdNodes.length === 0) fail.push(`missing JSON-LD: ${page.path}`);
  const faqNode = jsonLdNodes.find((node) => node["@type"] === "FAQPage");
  if (page.section === "faq" && (!faqNode || faqNode.mainEntity?.length !== 21)) fail.push(`FAQPage schema does not match visible FAQ content: ${page.path}`);
  if (page.section !== "faq" && faqNode) fail.push(`unexpected FAQPage schema: ${page.path}`);
}

for (const [title, paths] of titleSeen) if (paths.length > 1) warnings.push(`duplicate title (${paths.length}) in ${paths.join(", ")}: ${title}`);
for (const [h1, paths] of h1Seen) if (paths.length > 1) warnings.push(`duplicate h1 (${paths.length}) in ${paths.join(", ")}: ${h1}`);

const sitemap = await fs.readFile(path.join(dist, "sitemap.xml")).catch(() => "");
const sitemapText = sitemap.toString();
for (const page of indexablePages) if (!sitemapText.includes(`<loc>${site.domain}${page.path}</loc>`)) fail.push(`missing sitemap URL: ${page.path}`);
for (const page of pages.filter((route) => route.disposition === "redirect")) if (sitemapText.includes(`<loc>${site.domain}${page.path}</loc>`)) fail.push(`redirect included in sitemap: ${page.path}`);
const robots = await fs.readFile(path.join(dist, "robots.txt")).catch(() => "");
if (!robots.toString().includes(`Sitemap: ${site.domain}/sitemap.xml`)) fail.push("robots.txt sitemap missing");

const imageManifestPath = path.join(generatedRoot, "manifest.json");
try {
  const imageManifest = JSON.parse(await fs.readFile(imageManifestPath, "utf8"));
  const imageVariants = Object.values(imageManifest.images || {}).flatMap((entry) => [
    ...Object.values(entry.regular || {}).flat(),
    ...Object.values(entry.thumb || {}).flat(),
    ...Object.values(entry.full || {})
  ]);
  for (const variant of imageVariants) {
    if (!variant?.src || !(await fs.stat(path.join(dist, variant.src.replace(/^\//, ""))).catch(() => null))) fail.push(`missing generated image: ${variant?.src || "unknown"}`);
    if (variant?.width > 2400 || variant?.height > 2400) fail.push(`generated image exceeds cap: ${variant.src}`);
  }
  const generatedEntries = await fs.readdir(path.join(dist, "images"), { withFileTypes: true }).catch(() => []);
  for (const entry of generatedEntries) if (entry.name !== "generated" && !/\.svg$/i.test(entry.name)) fail.push(`source image directory deployed: /images/${entry.name}`);
} catch (error) {
  fail.push(`image manifest missing or invalid: ${error.message}`);
}

if (fail.length) {
  console.error(fail.map((message) => `FAIL ${message}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${indexablePages.length} generated routes plus ${pages.length - indexablePages.length} direct redirect(s): URL parity, metadata, canonicals, hreflang, internal links, sitemap and robots.`);
  for (const warning of warnings) console.log(`WARN ${warning}`);
}
