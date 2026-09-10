# studioaether.com V2

Conservative, static-first replacement for the Wix site. The first release is intentionally a platform migration: the public domain, important paths, language relationships, page purpose, observed titles and conversion destinations are represented as explicit source data.

## Architecture

- Astro 7 static generation, with no server runtime required for the public site.
- `src/data/routes.mjs` is the route and SEO migration contract.
- `src/layouts/BaseLayout.astro` and `src/components/` provide the shared shell, navigation, metadata, hreflang, JSON-LD and conversion links.
- `src/pages/[...slug].astro` generates every indexable route from the route contract; `public/_redirects` carries approved direct redirects.
- `src/pages/robots.txt.ts` and `src/pages/sitemap.xml.ts` generate crawl-control files from the same route data.
- `scripts/validate.mjs` checks generated URL parity, metadata, canonical/hreflang coverage, JSON-LD, sitemap membership, redirects and internal links.

This keeps the first release fast, crawlable and reversible. A framework can be introduced later if it does not change the emitted URL contract.

## Run locally

```bash
npm run build
npm run check
npm run dev
```

`npm run dev` starts Astro’s development server. `npm run preview` serves the last production build.

## Managed galleries

The major masonry galleries and the resident photographers grid are managed from `content/galleries/`. Add or remove source photos in the relevant folder; filenames sort naturally, so prefixes such as `01-`, `02-` and `03-` control the display order. The build automatically generates responsive image variants, updates the image manifest, and removes generated variants for deleted files.

The managed folders are `studio`, `selfie`, `props-*`, `mentoring-*`, `christmas-*`, `wedding`, `glamour`, `model-digitals`, `pet`, `commercial`, `portrait`, `fitness`, `corporate`, and `photographers-grid`. Existing small galleries and standalone images remain on the legacy content path.

Use `npm run gallery:sync` to regenerate the managed image set locally. `npm run dev`, `npm run check`, and production builds run the same sync automatically.

The current page body is a conservative scaffold on routes not yet migrated. The English/Hungarian homepage and studio pair now use verified Wix copy and current studio facts; remaining routes are migrated page by page after their own source audit.

## Migration gates before DNS cutover

The inventory and migration plan require source-level verification that is not available in a public search crawl. Before launch, replace the conservative fallback descriptions and complete the open decisions in `docs/MIGRATION.md` using Wix raw HTML, Search Console, backlinks, Google Ads landing-page exports, GA4 and consent configuration.

The current implementation preserves `/photographer-daniel` and sitemap-discovered URLs pending Search Console/content review. `/mentoring` follows the observed Wix behavior with one direct 301 to `/photographer-mentoring-budapest`; this is covered by the route contract and build validator.
