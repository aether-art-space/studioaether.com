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

for (const page of pages) {
  try { htmlFor.set(page.path, await fs.readFile(targetFor(page.path), "utf8")); }
  catch { fail.push(`missing generated file: ${page.path}`); }
  if (page.path !== "/") {
    try { await fs.access(path.join(dist, `${page.path.slice(1)}.html`)); }
    catch { fail.push(`missing clean-url artifact: ${page.path}`); }
  }
}

const titleSeen = new Map();
const h1Seen = new Map();
for (const page of pages) {
  const html = htmlFor.get(page.path) || "";
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const h1 = html.match(/<h1>([^<]+)<\/h1>/)?.[1];
  if (!title) fail.push(`missing title: ${page.path}`);
  if (!h1) fail.push(`missing h1: ${page.path}`);
  if (title) titleSeen.set(title, (titleSeen.get(title) || 0) + 1);
  if (h1) {
    const key = `${page.language}:${h1}`;
    h1Seen.set(key, { text: h1, count: (h1Seen.get(key)?.count || 0) + 1, paths: [...(h1Seen.get(key)?.paths || []), page.path] });
  }
  if (!html.includes(`<link rel="canonical" href="${site.domain}${page.path}">`)) fail.push(`canonical mismatch: ${page.path}`);
  if (!html.includes(`hreflang="${page.language}"`)) fail.push(`self hreflang missing: ${page.path}`);
  const links = [...html.matchAll(/href="(\/[^"#?]*)/g)].map((match) => match[1]);
  for (const link of links) if (!pageByPath.has(link) && link !== "/assets/site.css") fail.push(`broken internal link ${link} from ${page.path}`);
}

for (const [title, count] of titleSeen) if (count > 1) fail.push(`duplicate title (${count}): ${title}`);
for (const [, entry] of h1Seen) if (entry.count > 1) warnings.push(`duplicate h1 (${entry.count}) in ${entry.paths.join(", ")}: ${entry.text}`);

const sitemap = await fs.readFile(path.join(dist, "sitemap.xml"), "utf8");
for (const page of pages) if (!sitemap.includes(`<loc>${site.domain}${page.path}</loc>`)) fail.push(`missing sitemap URL: ${page.path}`);
if (!(await fs.readFile(path.join(dist, "robots.txt"), "utf8")).includes(`Sitemap: ${site.domain}/sitemap.xml`)) fail.push("robots.txt sitemap missing");

if (fail.length) { console.error(fail.map((message) => `FAIL ${message}`).join("\n")); process.exitCode = 1; }
else {
  console.log(`Validated ${pages.length} routes: URL parity, metadata, canonicals, hreflang, internal links, sitemap and robots.`);
  for (const warning of warnings) console.log(`WARN ${warning}`);
}
