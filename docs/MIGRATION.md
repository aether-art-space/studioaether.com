# Migration map and launch gates

This document turns the inventory and migration plan into implementation rules for V2.

## Route disposition

All 46 inventory URLs are represented in the route contract, along with the nine additional URLs discovered in the live XML sitemaps. Every route has a source URL, language, observed title, heading, counterpart (where confirmed), priority, action and verification field in `src/data/routes.mjs`.

Astro generates clean URL paths as directory-index documents. Production hosting must serve `/hu`, `/studio` and the other no-trailing-slash paths directly and must not introduce automatic trailing-slash redirects.

| Route group | Initial V2 treatment |
| --- | --- |
| 22 EN/HU navigation-visible pairs | Preserve exact URL, intent, observed title and reciprocal counterpart relationship. |
| `/mentoring` | Match the observed Wix behavior with one direct 301 to `/photographer-mentoring-budapest`; keep the source out of the sitemap and internal links. |
| `/photographer-daniel` | Preserve and keep indexable pending Search Console/backlink review; its sitemap-discovered Hungarian counterpart is also represented. |
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

The current redirect table matches the observed live behavior for `/mentoring`: a single direct server-side 301 to `/photographer-mentoring-budapest`, including the slash variant. `/photographer-daniel` remains live until Search Console/backlink review supports a different disposition. Any future redirect must remain a single direct server-side 301 or 308, with internal links targeting the final URL.
