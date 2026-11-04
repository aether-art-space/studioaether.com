# Health audit implementation — 4 November 2026

This release includes the existing wedding-specific makeup/hair/styling pricing commit `38b8c39c` and the health work below. The intentionally intrusive consent panel keeps its existing size, styling and choices, as requested.

## Implemented

- Removed raw email from all three enquiry conversion events. Kept `contact_form_submit`, `form_type` and `page_path` for GTM compatibility; events require analytics or ad-measurement consent. Shared form submission code bounds waiting to 15 seconds, validates provider responses and preserves input on failure.
- Added persistent direct Cal.com and configured email links, noscript guidance and a stalled-loader notice to all selfie booking languages. Booking callback de-duplication remains tested.
- Updated Astro to 7.4.5, sitemap to 3.7.4 and resolved Zod to its patched dependency tree. Pinned Wrangler 4.157.0. npm audit reported zero vulnerabilities after installation.
- Corrected privacy measurement wording in EN/HU/DE, distinguishing denied storage/cookieless requests, ad-measurement-only consent and full consent. Preserved the existing controller address and explicitly separated the physical studio address.
- Fixed booking/wedding heading hierarchy and descriptive wedding upgrade links without changing card styling. Corrected social-image MIME metadata to match the actual selected asset.
- Self-hosted Latin/extended-Latin Jura WOFF2 weights and Baskervville normal/italic with their licenses; removed the Google Fonts import and updated preload URLs. The custom Jitter font remains unchanged.
- Externalized executable inline scripts into content-addressed build assets, removed script `unsafe-inline` from production CSP, and added script/asset checks to validation. JSON-LD remains inline and inert. A supplied HTTPS `CSP_REPORT_URI` can enable reporting; no reporting endpoint/account was invented.
- Added consent-gated LCP/CLS/INP reporting through the existing Google tag bridge and fixed-category runtime error events. No error text, stack traces, DOM attribution, form values, query strings or fragments are included. Reporting stops when analytics consent is withdrawn. GA4 custom report setup is account-side work.
- Refreshed the Google summary from the actual public Maps profile: **4.9 / 53 reviews**, checked 4 November 2026. Source: https://www.google.com/maps/place/?q=place_id:ChIJAwFgtLbeQUcRT2ZwCjzhfRk .
- Removed the internal UI prototype from the public route tree; preserved its source under `src/prototypes/`. Removed unused source hints and refreshed README's outdated migration status.
- Added build-artifact commit/environment/SHA-256 validation. Publishing requires clean relevant source, `main`, a fetched remote containing HEAD, and an unchanged verified artifact. Unrelated existing documents and Google Ads operational files remain excluded from release staging/gates.
- Added PR/main production-quality CI, dependency auditing, browser regression checks, and retained production artifacts. Added a daily read-only live health workflow plus `npm run health:production`.
- Added restoration of missing ignored gallery cache files from committed `dist` before Astro clears it. This restores existing bytes without generating images or changing the manifest, so a fresh checkout can reproduce the build.

## Verification

Production build and Astro/route/schema checks pass. Targeted tests cover form privacy/timeouts, Korean page/booking/tracking behavior, release integrity, CSP externalization, health-monitoring consent/payloads and clean-checkout image restoration. Browser checks exercise EN/HU/DE/KO and save nine review screenshots under ignored `tmp/health-check/`. Web3Forms requests are intercepted; no real enquiry or appointment is submitted by the suite.

Release procedure: validate the reviewed source/output, commit and push, run `npm run release:build` against that commit, then `npm run release:publish`. A freshly generated manifest must match HEAD; never edit it to bypass validation. `dist` remains tracked for the image archive and can be committed alongside reviewed source; the final build may also remain unstaged because its digest, not Git's dirty flag, is the artifact integrity check.

Pre-release rollback target: Cloudflare Pages production deployment `53bc688b-c3f4-4e99-a93e-679f1dc9af4c` (source `517e2f9`). In the Pages project, promote that existing deployment if post-release smoke tests reveal a regression. Avoid changing DNS for an ordinary site rollback.

## Account-side limits and deliberate choices

- GTM administration redirected to Google sign-in. Existing event contracts were preserved; no container triggers, cross-domain configuration, enhanced conversion settings or Ads conversion goals were changed without inspecting them. The general property receiving page views outside the Korean flow was not reassigned. Runtime requests can be checked publicly, but private account configuration and reporting cannot be certified from source.
- GitHub CLI authentication works when network access is permitted; the initial sandbox-only check could not contact GitHub. The workflows are committed for PR/main checks and scheduled health monitoring. Existing branch protection policies are preserved.
- No standalone CSP reporting service, paid monitoring account, Search Console/ranking changes, backlink work, registered-address corrections or translation rewrites were fabricated. Further changes require verifiable business/account data. Native workflow failure logs provide monitoring evidence; no separate email or chat notifications were sent.
- Gallery image quality and layout were preserved after considering the audit's lab estimates. Fonts and script delivery address measured overhead without degrading portfolio photos. Larger component splits should accompany actual feature changes rather than a release-wide rewrite.
