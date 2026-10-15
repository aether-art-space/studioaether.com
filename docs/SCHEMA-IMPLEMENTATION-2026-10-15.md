# Structured data implementation — 15 October 2026

The audit was committed first as `fe53cf67`. This implements its concrete fixes and recommended price coverage without changing commercial rates or booking workflows.

- Removed deprecated ProfessionalService typing; retained LocalBusiness and separate Service nodes.
- Omitted homepage breadcrumbs; kept two-item breadcrumbs on content pages.
- Added offers to 66 localized pages, totaling 264 offer occurrences including the existing wedding add-ons. Covers studio rental, selfie sessions, published photography packages, resident artists/models, ID photos, mentoring, equipment and the visible wardrobe price range.
- Preserved hourly units, half-day/photo/person/booking units, starting prices and ranges. Mentoring remains a package total; the 10-hour pass remains a bundle, not a recurring subscription. Custom-quote offers are omitted.
- Shared booking extras and ID-photo numeric prices between UI and schema; photographer profile prices use the resident-photographer data already used by the new offers.
- Added stable photographer Person IDs across languages and ProfilePage/mainEntity links. Aligned service/person page references with #webpage; connected the existing guide Article to its page.
- Added the studio's existing Maps place coordinates, HUF currency and appointment-only qualification. Contact-language claims use the existing advertised HU/EN support.
- Fixed the seven existing wedding-schema language-indexing type errors.
- Added a schema release validator covering all 93 content pages: deprecated types, identities, breadcrumb coverage, visible-price parity, currency, units, local offer fragments, studio tiers, selfie durations, model hourly fees, mentoring totals, and FAQ savings.

Validation: production build succeeds; `npm run check` reports 0 errors and 0 warnings (two existing unused-variable hints). Route validation covers 93 pages (84 indexable) plus one redirect. Schema checks pass on 93 pages and 264 offer occurrences.

Deliberate omissions: no speculative business-wide priceRange, article dates, credentials, stock status, offer expiry dates or self-serving review-star markup. Quote-only services remain unpriced; the plain studio overview does not repeat unseen prices. More elaborate CollectionPage/ItemList modeling is optional and deferred; the existing Service nodes describe the service content accurately. No direct Google ranking or rich-result claim is made.

The historical audit inventory is retained as the before-state. Representative published outputs will be checked after deployment. This release does not change Calendar event names or Cal.com descriptions.

## Published verification

Verified live studio booking offers (8,000 / 9,000 per hour and 70,000 per pass), Hungarian selfie durations/prices, German photographer stable identity, and homepage breadcrumb omission. The Schema.org Validator initially fetched an older cached page; submitted fresh live JSON-LD in code mode instead. It found an existing unsupported Service.inLanguage property (one warning, zero errors). Removed that property from Service nodes while retaining language on WebPage/Article/FAQPage, and added a regression check.
