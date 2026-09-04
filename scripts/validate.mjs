import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pages, pageByPath, site } from "../src/data/routes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const targetFor = (routePath) => routePath === "/" ? path.join(dist, "index.html") : path.join(dist, routePath.slice(1), "index.html");
const fail = [];
const warnings = [];
const htmlFor = new Map();
const indexablePages = pages.filter((page) => page.disposition !== "redirect");
const attribute = (html, tag, name) => html.match(new RegExp(`<${tag}\\b[^>]*\\b${name}=["']([^"']+)["']`, "i"))?.[1] || "";

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
for (const page of indexablePages) {
  const html = htmlFor.get(page.path) || "";
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  const h1s = [...html.matchAll(/<h1\b[^>]*>(.*?)<\/h1>/gis)].map((match) => match[1].replace(/<[^>]+>/g, "").trim());
  if (!title) fail.push(`missing title: ${page.path}`);
  if (h1s.length !== 1) warnings.push(`h1 count ${h1s.length} in ${page.path}`);
  if (title) titleSeen.set(title, [...(titleSeen.get(title) || []), page.path]);
  if (h1s[0]) h1Seen.set(`${page.language}:${h1s[0]}`, [...(h1Seen.get(`${page.language}:${h1s[0]}`) || []), page.path]);

  const canonical = attribute(html, "link", "href");
  const canonicalTag = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0] || "";
  if (!canonicalTag || canonical !== `${site.domain}${page.path}`) fail.push(`canonical mismatch: ${page.path}`);
  const hreflang = page.language === "hu" ? "hu-hu" : "en-us";
  if (!html.includes(`hreflang="${hreflang}"`)) fail.push(`self hreflang missing: ${page.path}`);
  if (!html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+[^>]*>/i)) fail.push(`missing description: ${page.path}`);

  const links = [...html.matchAll(/\bhref=["'](\/(?!\/)[^"'#?]*)/gi)].map((match) => match[1]);
  for (const link of links) {
    if (["/site.css", "/tracking.js"].includes(link)) continue;
    if (!pageByPath.has(link)) fail.push(`broken internal link ${link} from ${page.path}`);
  }
  if (html.includes('content="noindex')) fail.push(`unexpected noindex in production build: ${page.path}`);
  if (html.match(/<script\b[^>]*type=["']application\/ld\+json["']/gi)?.length === 0) fail.push(`missing JSON-LD: ${page.path}`);
}

for (const [title, paths] of titleSeen) if (paths.length > 1) warnings.push(`duplicate title (${paths.length}) in ${paths.join(", ")}: ${title}`);
for (const [h1, paths] of h1Seen) if (paths.length > 1) warnings.push(`duplicate h1 (${paths.length}) in ${paths.join(", ")}: ${h1}`);

const sitemap = await fs.readFile(path.join(dist, "sitemap.xml")).catch(() => "");
const sitemapText = sitemap.toString();
for (const page of indexablePages) if (!sitemapText.includes(`<loc>${site.domain}${page.path}</loc>`)) fail.push(`missing sitemap URL: ${page.path}`);
for (const page of pages.filter((route) => route.disposition === "redirect")) if (sitemapText.includes(`<loc>${site.domain}${page.path}</loc>`)) fail.push(`redirect included in sitemap: ${page.path}`);
const robots = await fs.readFile(path.join(dist, "robots.txt")).catch(() => "");
if (!robots.toString().includes(`Sitemap: ${site.domain}/sitemap.xml`)) fail.push("robots.txt sitemap missing");

if (fail.length) {
  console.error(fail.map((message) => `FAIL ${message}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${indexablePages.length} generated routes plus ${pages.length - indexablePages.length} direct redirect(s): URL parity, metadata, canonicals, hreflang, internal links, sitemap and robots.`);
  for (const warning of warnings) console.log(`WARN ${warning}`);
}
