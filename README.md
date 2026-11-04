# studioaether.com V2

Conservative, static-first replacement for the Wix site. The first release is intentionally a platform migration: the public domain, important paths, language relationships, page purpose, observed titles and conversion destinations are represented as explicit source data.

## Architecture

- Astro 7 static generation, with no server runtime required for the public site.
- `src/data/routes.mjs` is the route and SEO migration contract.
- `src/layouts/BaseLayout.astro` and `src/components/` provide the shared shell, navigation, metadata, hreflang, JSON-LD and conversion links.
- `src/pages/[...slug].astro` generates every indexable route from the route contract; `public/_redirects` carries approved direct redirects.
- `src/pages/robots.txt.ts` and `src/pages/sitemap.xml.ts` generate crawl-control files from the same route data.
- `scripts/validate.mjs` checks generated URL parity, metadata, canonical/hreflang coverage, JSON-LD, sitemap membership, redirects and internal links.

This keeps the first release fast, crawlable and reversible. Changes to the framework must preserve the emitted URL contract.

## Run locally

```bash
npm run build
npm run check
npm run dev
```

`npm run dev` starts Astro’s development server. `npm run preview` serves the last production build.

## Managed galleries

The major masonry galleries and the resident photographers grid are managed from `content/galleries/`. Add or remove source photos in the relevant folder; filenames sort naturally, so prefixes such as `01-`, `02-` and `03-` control the display order. Image processing is explicit: normal builds do not generate or alter image variants.

The managed folders are `studio`, `selfie`, `props-*`, `mentoring-*`, `christmas-*`, `wedding`, `glamour`, `model-digitals`, `pet`, `commercial`, `portrait`, `fitness`, `corporate`, and `photographers-grid`. Existing small galleries and standalone images remain on the legacy content path.

Use `npm run gallery:sync` only when intentionally refreshing every managed gallery. For a named gallery release, use `npm run gallery:update -- --galleries=corporate` (or a comma-separated list such as `corporate,glamour`). It updates just those galleries and their manifest entries; normal `dev`, `check`, and build commands leave image assets alone.

Releases are explicit too. Git is the source of truth, so commit and push source changes before building, then deploy the same commit that was reviewed. The release build creates `dist` first, runs type/route validation and both test suites against that output, then writes an ignored `output/release-manifest.json` containing the commit and a SHA-256 digest of every file in `dist`.

```bash
# Push the reviewed release commit, then update the remote tracking refs.
git push origin main
git fetch origin

# Build and validate the production artifact from that pushed commit.
npm run release:build

# Publish the current HEAD to Cloudflare Pages.
npm run release:publish
```

The repository currently tracks `dist`, so the production build will show generated output changes after the source commit. Leave those generated files unstaged and uncommitted; the ignored manifest binds their current bytes to the source commit. `release:publish` checks that the manifest matches current `HEAD`, the `dist` digest is unchanged, relevant tracked source files are unchanged, and the commit is on `origin/main` after fetching it. Rebuild after any source, asset, or output change. Unrelated docs and Google Ads working files do not block release. After publishing, verify the deployment URL and key English/Hungarian routes. A Git push alone does not generate or deploy images automatically.

## Current production health

The site is live on Cloudflare Pages with English, Hungarian and German routes plus the Korean selfie flow. The route contract covers 96 rendered routes, including 85 indexable URLs. Production build validation checks metadata, language alternates, links, images, structured offers and script CSP. The UI prototype lives outside the page router in `src/prototypes/`.

`npm test` covers form privacy/timeouts, booking callbacks and artifact integrity. `npm run test:browser` exercises the generated site with mocked form/measurement providers and captures EN/HU/DE/KO screenshots. No test submits a real enquiry or booking. CI runs both suites and dependency auditing on PRs and main.

`npm run health:production` performs a read-only live route/security/booking-fallback check. The production-health workflow runs daily and can be dispatched manually. See `docs/HEALTH-AUDIT-2026-11-04.md` for findings and `docs/HEALTH-RELEASE-2026-11-04.md` for implementation coverage and remaining account-side checks.

Production scripts are externalized into content-addressed assets so CSP can omit script `unsafe-inline`. An optional HTTPS `CSP_REPORT_URI` build setting enables reports to an operator-provided endpoint; no reporting account is assumed. Fonts are self-hosted with their licenses in `public/fonts/`.
