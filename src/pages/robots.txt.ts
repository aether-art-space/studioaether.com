import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const preview = import.meta.env.PUBLIC_DEPLOY_ENV === "preview";
  const body = preview
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\nDisallow: *?lightbox=\nSitemap: ${site?.toString().replace(/\/$/, "")}/sitemap.xml\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
