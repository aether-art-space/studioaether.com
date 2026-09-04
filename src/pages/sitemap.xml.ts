import type { APIRoute } from "astro";
import { absoluteUrl } from "../lib/site.mjs";
import { pages } from "../data/routes.mjs";

export const GET: APIRoute = () => {
  const urls = pages
    .filter((page) => page.disposition !== "redirect")
    .map((page) => `  <url><loc>${absoluteUrl(page.path)}</loc></url>`)
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
