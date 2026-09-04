# V2 deployment plan

## Decision

Deploy the production site as a static Astro build on Cloudflare Pages, connected to the GitHub repository `aether-art-space/studioaether.com`.

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Initial Pages project name: `studioaether-com`
- Primary production hostname: `https://www.studioaether.com/`
- Initial Pages hostname: the project-provided `*.pages.dev` hostname

Cloudflare Pages supports Git-backed builds and preview deployments for pull requests. See the [Pages deployment overview](https://developers.cloudflare.com/pages/get-started/) and [preview deployments documentation](https://developers.cloudflare.com/pages/configuration/preview-deployments/).

## Environment separation

### Production

- Built from `main`.
- `PUBLIC_SITE_URL=https://www.studioaether.com`
- Production GA4 and Ads identifiers are enabled only after launch verification.
- Sitemap and robots output contain production URLs only.
- Custom-domain attachment happens only after URL, metadata, schema, hreflang, link, form, and tracking parity checks pass.

### Preview

- Built from pull requests or a dedicated staging branch.
- Preview origin is used for preview canonicals; production canonicals must never leak into preview HTML.
- Preview pages emit `noindex, nofollow` and a restrictive robots response.
- Preview builds do not send production analytics or Google Ads conversions. Use a separate test property only when required.
- A persistent staging hostname may be protected with Cloudflare Access; ephemeral Pages previews remain the default during development.

## Cutover and rollback

1. Keep Wix serving `studioaether.com` while V2 is developed and validated on `*.pages.dev`.
2. Attach the custom domain only after the pre-launch checklist is complete.
3. Verify the canonical hostname, HTTPS, redirects, sitemap, robots, forms, bookings, analytics, and Ads conversions immediately after cutover.
4. Roll back by restoring the prior DNS/hostname routing or selecting the last known-good Pages deployment. Do not delete the Wix site during the stabilization period.

## Account-scope verification — 2026-09-04

The connected Cloudflare API account is `Photostudio.aether@gmail.com's Account`. Its API currently reports:

- zero Pages projects
- no visible `studioaether.com` zone

This means the correct account or permissions must be confirmed before creating the Pages project or changing DNS. No Cloudflare resource or DNS record was changed while recording this plan.

## Required settings when the correct account is available

- Connect GitHub repository `aether-art-space/studioaether.com`.
- Set `main` as the production branch.
- Set `npm run build` and `dist` as the build settings.
- Set the Node.js version explicitly in the Pages project to match the repository CI version.
- Configure preview environment variables separately from production.
- Confirm Pages preview URLs cannot be indexed before sharing them publicly.
- Add the custom domain only after migration parity validation.
