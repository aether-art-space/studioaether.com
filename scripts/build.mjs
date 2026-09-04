import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pages, site } from "../src/data/routes.mjs";
import { renderPage } from "../src/templates/page.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const targetFor = (routePath) => routePath === "/" ? path.join(dist, "index.html") : path.join(dist, routePath.slice(1), "index.html");

const build = async () => {
  await fs.rm(dist, { recursive: true, force: true });
  await fs.mkdir(dist, { recursive: true });
  await fs.cp(path.join(root, "public"), path.join(dist, "assets"), { recursive: true });

  await Promise.all(pages.map(async (page) => {
    const target = targetFor(page.path);
    const html = renderPage(page);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, html, "utf8");
    // Keep a flat clean-URL artifact as well. Hosts that use pretty URLs can
    // serve `/studio` from `studio.html` without forcing a trailing slash.
    if (page.path !== "/") {
      const directTarget = path.join(dist, `${page.path.slice(1)}.html`);
      await fs.mkdir(path.dirname(directTarget), { recursive: true });
      await fs.writeFile(directTarget, html, "utf8");
    }
  }));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((page) => `  <url><loc>${site.domain}${page.path}</loc></url>`).join("\n")}\n</urlset>\n`;
  await fs.writeFile(path.join(dist, "sitemap.xml"), sitemap, "utf8");
  await fs.writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n`, "utf8");
  await fs.writeFile(path.join(dist, "_headers"), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`, "utf8");
  console.log(`Built ${pages.length} routes into ${path.relative(root, dist)}/`);
};

build().catch((error) => { console.error(error); process.exitCode = 1; });
