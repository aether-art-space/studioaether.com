# studioaether.com V2

Conservative, static-first replacement for the Wix site. The first release is intentionally a platform migration: the public domain, important paths, language relationships, page purpose, observed titles and conversion destinations are represented as explicit source data.

## Architecture

- Node.js static generation with no runtime framework dependency.
- `src/data/routes.mjs` is the route and SEO migration contract.
- `src/templates/page.mjs` renders shared layout, navigation, metadata, hreflang, JSON-LD and conversion links.
- `scripts/build.mjs` emits `dist/` with one HTML document per inventory URL, plus `robots.txt` and `sitemap.xml`.
- `scripts/validate.mjs` checks URL parity, duplicate titles/H1s, canonical/hreflang coverage, sitemap membership and internal links.

This keeps the first release fast, crawlable and reversible. A framework can be introduced later if it does not change the emitted URL contract.

## Run locally

```bash
npm run build
npm run check
npm run dev
```

`npm run dev` serves the generated `dist/` directory on `http://localhost:4173`.

## Migration gates before DNS cutover

The inventory and migration plan require source-level verification that is not available in a public search crawl. Before launch, replace the conservative fallback descriptions and complete the open decisions in `docs/MIGRATION.md` using Wix raw HTML, Search Console, backlinks, Google Ads landing-page exports, GA4 and consent configuration.

The current implementation deliberately keeps `/mentoring` and `/photographer-daniel` live and indexable until their Search Console/backlink dispositions are approved. No redirect is invented for either page.
