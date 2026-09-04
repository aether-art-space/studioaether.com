# Migration map and launch gates

This document turns the inventory and migration plan into implementation rules for V2.

## Route disposition

All 46 inventory URLs are generated at their existing paths: 22 EN/HU pairs plus the two additional indexed EN URLs. Every page has a source URL, language, observed title, heading, counterpart (where confirmed), priority, action and verification field in `src/data/routes.mjs`.

The generator emits both directory-index and flat `.html` artifacts so the hosting layer can serve `/hu`, `/studio` and the other no-trailing-slash paths without URL changes. Production hosting must be configured to use the clean path directly and must not introduce automatic trailing-slash redirects.

| Route group | Initial V2 treatment |
| --- | --- |
| 22 EN/HU navigation-visible pairs | Preserve exact URL, intent, observed title and reciprocal counterpart relationship. |
| `/mentoring` | Keep live and indexable pending Search Console/backlink review. Do not invent a redirect. |
| `/photographer-daniel` | Keep live and indexable pending Search Console/backlink review. Do not invent a redirect. |
| `/hu/fitness` | Preserve URL and correct the known corporate-photography title mismatch to fitness/yoga wording after baseline capture. |
| FAQ | Preserve URL; visible content avoids stale package values until current commercial rules are confirmed. Do not add FAQPage schema before content approval. |
| Privacy policy | Preserve URL; public studio address and legal provider address remain separate decisions. |

## Required source-level inputs before cutover

- Export current raw HTML head tags: exact meta descriptions, canonicals, hreflang, robots and structured data.
- Export Search Console URLs, queries, indexing status and performance for at least the prior 12 months.
- Export backlinks and Google Ads final landing-page URLs.
- Record current GA4 property, Google tag, Ads conversion actions, Consent Mode and enhanced conversions configuration.
- Confirm current redirects, hostname behavior, HTTPS and sitemap.
- Confirm FAQ prices, cancellation policy, phone number(s), artist packages and legal address.

## Acceptance checks

Run `npm run build && npm run check`. Then crawl the generated or deployed site and verify:

- every inventory URL returns 200 or an approved direct 301/308;
- sitemap contains only canonical, indexable 200 URLs;
- all important pages have one title, one H1, self-canonical and valid reciprocal hreflang;
- internal links point directly to final URLs;
- no staging hostname, `noindex`, placeholder tracking ID or redirect chain reaches production;
- forms, booking links, consent behavior, GA4 pageviews and Ads conversions work once configured;
- desktop/mobile layout and Core Web Vitals meet the baseline.

## Redirect policy

No redirect table is committed until the Search Console/backlink review determines whether `/mentoring` consolidates to `/photographer-mentoring-budapest` and whether `/photographer-daniel` should be preserved or mapped. If a redirect is approved, it must be a single direct server-side 301 or 308 and all internal links must target the final URL.
