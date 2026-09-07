# Migration map and launch gates

This document turns the inventory and migration plan into implementation rules for V2.

## Route disposition

All 46 inventory URLs are represented in the route contract, along with the nine additional URLs discovered in the live XML sitemaps. Every route has a source URL, language, observed title, heading, counterpart (where confirmed), priority, action and verification field in `src/data/routes.mjs`.

Astro generates clean URL paths as directory-index documents. Production hosting must serve `/hu`, `/studio` and the other no-trailing-slash paths directly and must not introduce automatic trailing-slash redirects.

Content migration status: all production routes in the route contract have now been compared against fresh Wix HTML in the connected Chrome reference for titles, descriptions, headings, source copy, images/crops, links and responsive behavior. The homepage remains unchanged after its committed migration. The remaining source discrepancies and pre-cutover decisions are recorded below.

Follow-up parity audit (September 7, 2026): all rendered source image sets are now represented locally, including the mentoring galleries and the additional wedding section images; the generated site has no unresolved local image references. Page titles, descriptions, canonicals, hreflang, Open Graph/Twitter tags, robots directives and social images are generated for every indexable route. LocalBusiness/ProfessionalService, opening hours, social profiles, price range, image/logo, map and contact fields are retained in JSON-LD, with WebPage, BreadcrumbList, FAQPage on the two FAQ routes, and relevant Service/Person nodes added for the V2 document model. The ID-photo routes intentionally do not receive FAQPage because they have no visible FAQ content. Hungarian copy and metadata were checked against the live Wix source with grammar/typography corrections; the legal address is intentionally `Tátra utca 29b`, while the public studio/office address is intentionally `Lónyay utca 60., 1093 Budapest`. `/hu/post-booking` intentionally has no description meta tag because the live Wix source has none.

| Route group | Initial V2 treatment |
| --- | --- |
| 22 EN/HU navigation-visible pairs | Preserve exact URL, intent, observed title and reciprocal counterpart relationship. |
| `/mentoring` | Match the observed Wix behavior with one direct 301 to `/photographer-mentoring-budapest`; keep the source out of the sitemap and internal links. |
| `/photographer-daniel` | Preserve and keep indexable pending Search Console/backlink review; its sitemap-discovered Hungarian counterpart is also represented. |
| `/hu/fitness` | Preserve URL and correct the known corporate-photography title mismatch to fitness/yoga wording after baseline capture. |
| FAQ | Preserve URL and bilingual accordion content. FAQPage schema is emitted on the two FAQ routes and mirrors the 21 visible questions and answers. |
| Privacy policy | Preserve URL and the audited generated-policy text dated October 19, 2024. The legal provider address is `Tátra utca 29b`; the public studio/office address is `Lónyay utca 60., 1093 Budapest`. Both are intentionally retained in their respective contexts. |
| `/wedding-photography` and `/hu/wedding-photography` | Preserve both URLs and the audited wedding source assets. The Hungarian metadata and introductory copy are aligned with the wedding page; package prices remain consultation-led in the current source. |

## Required source-level inputs before cutover

- Export current raw HTML head tags: exact meta descriptions, canonicals, hreflang, robots and structured data.
- Export Search Console URLs, queries, indexing status and performance for at least the prior 12 months.
- Export backlinks and Google Ads final landing-page URLs.
- Record current GA4 property, Google tag, Ads conversion actions, Consent Mode and enhanced conversions configuration.
- Confirm current redirects, hostname behavior, HTTPS and sitemap.
- Keep FAQ prices, cancellation policy, phone number(s), artist packages and legal address synchronized if any of those facts change.
- Resolve the Hungarian wedding-page title/content mismatch and confirm the wedding package/form submission destination.
- Review the generated privacy policy with the legal owner before publishing; do not substitute the public studio address for the source legal provider address without approval.

## Acceptance checks

Run `npm run check && npm run build`. Then crawl the generated or deployed site and verify:

- every inventory URL returns 200 or an approved direct 301/308;
- sitemap contains only canonical, indexable 200 URLs;
- all important pages have one title, one H1, self-canonical and valid reciprocal hreflang;
- internal links point directly to final URLs;
- no staging hostname, `noindex`, placeholder tracking ID or redirect chain reaches production;
- forms, booking links, consent behavior, GA4 pageviews and Ads conversions work once configured;
- desktop/mobile layout and Core Web Vitals meet the baseline.

## Redirect policy

The current redirect table matches the observed live behavior for `/mentoring`: a single direct server-side 301 to `/photographer-mentoring-budapest`, including the slash variant. `/photographer-daniel` remains live until Search Console/backlink review supports a different disposition. Any future redirect must remain a single direct server-side 301 or 308, with internal links targeting the final URL.
