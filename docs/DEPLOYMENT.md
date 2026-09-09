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

## Simplified one-way launch plan

The launch is treated as a one-way migration. The Wix site will not be used as an operational rollback after cutover, so preserve the current DNS, email, URL/redirect, and marketing configuration as an archive before changing DNS.

1. Finish and QA the new site on preview, including routes, redirects, forms, booking links, consent, Google Reviews, metadata, and responsive behavior.
2. Create the production Pages project and deploy the final build.
3. Connect `studioaether.com` and `www.studioaether.com` to the Pages project, but do not change public DNS yet.
4. Configure the existing marketing IDs and event expectations supplied by the marketing owner. Preserve the existing Ads setup; do not redesign it during migration. Hotjar and TWIPLA are intentionally excluded from V2.
5. Preserve the current DNS and email records, Wix URL/redirect list, Search Console details, and Ads/analytics configuration.
6. Switch DNS once the production Pages site and custom domain are ready.
7. Run a focused live smoke test: important pages, redirects, booking links, contact and wedding forms, cookie consent, Google Reviews, existing tags, canonical URLs, sitemap, robots, and email delivery.
8. Monitor forms, bookings, Ads/analytics events, and 404s for the first few days.

The domain must be live for final verification, but most preparation can be completed before DNS cutover. A registrar transfer is not required; the intended action is a DNS/hosting cutover.

### Tracking environment rule

For the production Pages build, configure `PUBLIC_GTM_ID=GTM-P6G8NTP2` only after the private/preview tracking check passes. Do not configure the direct `PUBLIC_GOOGLE_TAG_ID`, `PUBLIC_GA4_ID`, or `PUBLIC_GOOGLE_ADS_ID` alongside it unless the marketing owner explicitly approves a fallback test; the source selects GTM first to avoid duplicate tags. Keep all tracking IDs absent from preview builds unless the preview is intentionally being used for GTM Preview/Tag Assistant verification.

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
