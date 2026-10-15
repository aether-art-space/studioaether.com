# Site-wide structured data audit — 15 October 2026

## Scope and limits

Read-only audit of source and all 93 generated content routes at release cf17718f: 84 indexable and 9 noindex pages, in English, Hungarian and German. Inspected the two additional static utility HTML pages (404 and UI prototype), neither of which emits JSON-LD; neither needs commercial structured data. One redirect is not treated as a content page. Parsed all 357 JSON-LD script blocks and reviewed the shared generator, page classification, visible pricing and existing validation rules. Spot-checked published `/booking`, `/hu/faq`, `/wedding-photography`, and `/model-digitals-preparation`; their schema types and offer coverage match the build.

This is a source/build audit with representative live verification, not a live crawl of every URL, a completed Schema.org Validator/Rich Results Test run, or a Search Console eligibility/indexing audit. JSON parsing success does not establish full vocabulary validity or Google rich-result eligibility. No source, pricing, calendar, or deployment changes were made for this audit.

## Overall assessment

The foundation is sound, with no JSON parse failures. Business name, address, phone, website identity, localized page metadata and service-provider references are present. The main gaps are incomplete commercial information, a deprecated type, a homepage breadcrumb eligibility issue, and inconsistent identity links. Offer markup is useful semantic enrichment; its absence on a Service is not itself a required-field error or proof of lost rankings.

| Top-level node | Occurrences |
|---|---:|
| LocalBusiness + ProfessionalService (one dual-typed node) | 93 |
| WebPage | 93 |
| BreadcrumbList | 93 |
| Service | 63 |
| Person | 6 |
| WebSite | 3 |
| FAQPage | 3 |
| Article | 3 |

Only wedding pages contain Offer objects: three package offers and one shared optional content-creation offer per language. The latter is embedded under each package, producing 18 Offer occurrences across the site but 12 distinct offer IDs. Reusing an identical node ID is valid; this is not six separate purchasable packages per wedding page.

## Recommended changes, ordered by priority

### 1. Correct the homepage breadcrumbs — fix

All three homepages emit a BreadcrumbList containing only one ListItem. Google's breadcrumb feature requires at least two items. Omit BreadcrumbList on homepages rather than inventing an extra hierarchy level. The other 90 routes have the normal Home → page structure; improving their hierarchy is optional and should reflect a real navigation path.

Evidence: `src/components/Seo.astro`, breadcrumb block at lines 180–197. [Google breadcrumb requirements](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb).

### 2. Remove the deprecated ProfessionalService type — fix

Every content route emits `@type: ["LocalBusiness", "ProfessionalService"]`. Schema.org explicitly deprecates the general ProfessionalService type. Retain LocalBusiness for the studio and use separate Service nodes for its offerings. This is a vocabulary cleanup, not an emergency or evidence that Google currently rejects the entire business node.

Evidence: `src/components/Seo.astro:139`. [Schema.org ProfessionalService](https://schema.org/ProfessionalService).

### 3. Add priced offers to the services that publish prices — recommended

60 of the 63 Service pages have no offers. The booking pages have visible studio prices but no studio Service/Offer node at all. Add a studio-rental Service with three offers to `/booking` and its translations. Add relevant offers to other service pages where the visible page actually advertises them.

Use numeric prices and HUF currency from shared data. Model hourly services using UnitPriceSpecification with a one-hour reference quantity, distinguish per-person/per-image/per-booking units, and keep the 70,000 Ft pass as a 10-hour bundle rather than a recurring subscription. Preserve actual conditions: discounted hours, standard hours, pass hours and any published exceptions. The out-of-hours and larger-production 10,000 Ft rates can be separate conditional offers if their visible terms support that representation. Do not invent expiry dates, availability, VAT treatment or cancellation rules.

For "from" prices, express the minimum and its qualification using a suitable PriceSpecification; do not turn the starting amount into an unconditional fixed package. A custom-quote-only service can remain unpriced; never use price 0 to mean "ask for a quote."

A Service may use `offers` for simple choices or `hasOfferCatalog` for multiple packages. Collection pages can list services through ItemList/OfferCatalog when appropriate. Schema.org supports these models, but Service + Offer does not guarantee a Google price-rich result.

Evidence: `src/components/Seo.astro:230–282`; `src/data/studioPricing.mjs`; package data in `src/data/content.mjs`; some prices remain inline in PageContent.astro. [Service](https://schema.org/Service), [OfferCatalog](https://schema.org/OfferCatalog), [UnitPriceSpecification](https://schema.org/UnitPriceSpecification), [Google general policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

### 4. Make the entity references consistent — recommended

WebPage nodes use `canonical#webpage`, while Service and Person `mainEntityOfPage` references use the bare canonical URL as a WebPage ID. Both URLs are legal identifiers, but the graph describes different IDs for the same page. Point those references at `canonical#webpage`, as the Article block already does. Link WebPage.mainEntity to the corresponding service/person/article node where appropriate.

Each photographer currently receives three distinct Person IDs, one for each language. Use one stable ID per real person and let localized pages reference it; retain translated names/descriptions and page URLs. Localized Service IDs can remain page-specific if intentionally linked, or use a shared real-service identity with clear localized page relationships. Do not blindly deduplicate distinct packages.

The stable business and website IDs already work. WebSite is defined on the three homepages and referenced elsewhere; a cross-page reference is not a dangling-ID error. Embedding a small shared graph everywhere is optional.

Evidence: `src/components/Seo.astro:172, 241, 305, 315, 327, 337` (verify current lines when implementing).

### 5. Complete and verify business facts — recommended / requires factual check

Add GeoCoordinates for the actual studio location (the existing Maps URL contains the place coordinates; verify the pin before reusing them). Consider currenciesAccepted = HUF and a concise, representative priceRange if it can honestly cover the business's mixed services. A rental-only priceRange could misrepresent a business also selling larger photography packages, so individual offers are the more useful priority.

The visible footer says appointment only; schema publishes 09:00–22:00 daily without that qualification. Keep genuine booking hours and add the appointment requirement to the business description; do not infer walk-in availability. The business contact point advertises English, Hungarian and German, whereas visible contact/help text explicitly mentions HU/EN. Confirm German-speaking customer support before retaining `de`; a German website translation alone does not prove German service availability.

Also check the studio-wide Hungary areaServed against actual operating coverage. Wedding services explicitly mention Hungary; studio rental is a Budapest location. This is a verification item, not a proven contradiction.

Evidence: `src/components/Seo.astro:150–166`; footer and FAQ content. [Google LocalBusiness guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business).

### 6. Improve page-specific models where useful — optional

The two photographer pages per language already have Person nodes. Adding ProfilePage with mainEntity pointing at the stable Person would describe their purpose more precisely; do not promise Google's profile rich-result eligibility. Photographer/model/team listing pages and `/packages` may be better described as CollectionPage with ItemList than only a broad Service. Keep services where the page also sells a service. The model preparation guide already has Article; add real author identity and publication/modification dates only if available and maintained, preferably visible on the page. Dates should reflect editorial history, not every site build.

No commercial markup is needed for noindex confirmation or utility pages. Their existing basic business/page schemas are harmless; adding Offer markup there is low value.

### 7. Strengthen automated checks — recommended

Current validation parses JSON-LD, checks that pages have it, and checks FAQ question count. It does not verify offer coverage, units, price parity, entity references or breadcrumb eligibility. Add focused checks for: numeric HUF prices matching the shared UI data; fixed vs starting prices; bundle/hour units; offer URL fragments; stable business/person IDs; consistent #webpage references; homepage breadcrumb omission; FAQ answer parity; and absence of deprecated types. Keep a small set of representative Schema.org Validator and Google Rich Results Test checks in the release process. Fix the previously observed seven Astro type-check errors in wedding schema language indexing when touching that generator; the production build currently succeeds, but the broader type check does not.

## What should remain

- Keep the valid current business address, phone, social links, service provider and language-specific page URLs.
- Keep the wedding package offers: the generated amounts are 109,000 / 269,000 / 319,000 HUF plus the optional 59,000 HUF content-creation offer, matching the displayed amounts and existing section anchors. Optionally define the shared add-on once and reference its ID for clarity.
- Keep FAQ schema if useful for semantic completeness. Its answers already include the new 8,000 / 9,000 / 70,000 prices and 22% savings in all languages. It is not a realistic Google FAQ-rich-result opportunity for a photography studio: Google limits that feature to qualifying government and health sites. [Google FAQ policy](https://developers.google.com/search/blog/2023/08/howto-faq-changes).
- Do not add the studio's own Google review average to chase review stars: self-serving LocalBusiness reviews are ineligible for that Google feature, including embedded third-party reviews. The current absence of AggregateRating is appropriate. [Google review guidance](https://developers.google.com/search/docs/appearance/structured-data/review-snippet).
- Do not fabricate Product markup, stock status, expiry dates, credentials or article dates to trigger extra search features.

## Proposed implementation sequence

1. Correct homepage breadcrumbs, remove deprecated typing, and align entity references.
2. Add studio rental and selfie offers, then published photography, ID photo and mentoring packages.
3. Extend offer coverage to priced creative-team services and rentals; keep custom-quote work unpriced.
4. Add verified business facts and targeted validation checks, then validate representative outputs before deployment.

## Route-by-route inventory

Every route below currently includes the shared LocalBusiness/ProfessionalService, WebPage and BreadcrumbList nodes. “Additional types” excludes those shared nodes. Offer count includes repeated embedding of the same wedding add-on. Pricing mentions are a heuristic count of visible currency amounts, not a count of sellable packages.

| Route | Indexable | Additional types | Offer occurrences | Visible price mentions |
|---|---|---|---:|---:|
| `/` | yes | WebSite | 0 | 2 |
| `/hu` | yes | WebSite | 0 | 2 |
| `/studio` | yes | Service | 0 | 0 |
| `/hu/studio` | yes | Service | 0 | 0 |
| `/selfie-studio-budapest` | yes | Service | 0 | 3 |
| `/hu/selfie-studio-budapest` | yes | Service | 0 | 3 |
| `/equipment` | yes | Service | 0 | 14 |
| `/hu/equipment` | yes | Service | 0 | 14 |
| `/props` | yes | Service | 0 | 1 |
| `/hu/props` | yes | Service | 0 | 1 |
| `/photographers-budapest` | yes | Service | 0 | 3 |
| `/hu/photographers-budapest` | yes | Service | 0 | 3 |
| `/models-budapest` | yes | Service | 0 | 4 |
| `/hu/models-budapest` | yes | Service | 0 | 4 |
| `/stylists` | yes | Service | 0 | 3 |
| `/hu/stylists` | yes | Service | 0 | 3 |
| `/make-up-artists` | yes | Service | 0 | 3 |
| `/hu/make-up-artists` | yes | Service | 0 | 3 |
| `/packages` | yes | Service | 0 | 6 |
| `/hu/packages` | yes | Service | 0 | 6 |
| `/commercial-photography-budapest` | yes | Service | 0 | 0 |
| `/hu/commercial-photography-budapest` | yes | Service | 0 | 0 |
| `/corporate-photography-budapest` | yes | Service | 0 | 4 |
| `/hu/corporate-photography-budapest` | yes | Service | 0 | 4 |
| `/portrait-photography-budapest` | yes | Service | 0 | 6 |
| `/hu/portrait-photography-budapest` | yes | Service | 0 | 6 |
| `/fitness` | yes | Service | 0 | 6 |
| `/hu/fitness` | yes | Service | 0 | 6 |
| `/glamour-boudoir-photography-budapest` | yes | Service | 0 | 6 |
| `/hu/glamour-boudoir-photography-budapest` | yes | Service | 0 | 6 |
| `/model-polaroids-budapest` | yes | Service | 0 | 6 |
| `/hu/model-polaroids-budapest` | yes | Service | 0 | 6 |
| `/model-digitals-preparation` | yes | Article | 0 | 3 |
| `/hu/model-digitals-preparation` | yes | Article | 0 | 3 |
| `/pet-photography-budapest` | yes | Service | 0 | 3 |
| `/hu/pet-photography-budapest` | yes | Service | 0 | 3 |
| `/id-photo` | yes | Service | 0 | 2 |
| `/hu/id-photo` | yes | Service | 0 | 2 |
| `/photographer-mentoring-budapest` | yes | Service | 0 | 3 |
| `/hu/photographer-mentoring-budapest` | yes | Service | 0 | 3 |
| `/booking` | yes | — | 0 | 16 |
| `/hu/booking` | yes | — | 0 | 16 |
| `/selfie-booking` | no | — | 0 | 0 |
| `/hu/selfie-booking` | no | — | 0 | 0 |
| `/faq` | yes | FAQPage | 0 | 19 |
| `/hu/faq` | yes | FAQPage | 0 | 19 |
| `/privacy-policy` | yes | — | 0 | 0 |
| `/hu/privacy-policy` | yes | — | 0 | 0 |
| `/photographer-daniel` | yes | Person | 0 | 3 |
| `/photographer-alexandra` | yes | Person | 0 | 3 |
| `/christmas-photoshoot` | yes | Service | 0 | 6 |
| `/hu/christmas-photoshoot` | yes | Service | 0 | 6 |
| `/christmas-studio` | yes | Service | 0 | 6 |
| `/hu/christmas-studio` | yes | Service | 0 | 6 |
| `/post-booking` | no | — | 0 | 1 |
| `/hu/post-booking` | no | — | 0 | 1 |
| `/selfie-post-booking` | no | — | 0 | 0 |
| `/hu/selfie-post-booking` | no | — | 0 | 0 |
| `/wedding-photography` | yes | Service | 6 | 12 |
| `/hu/wedding-photography` | yes | Service | 6 | 12 |
| `/hu/photographer-daniel` | yes | Person | 0 | 3 |
| `/hu/photographer-alexandra` | yes | Person | 0 | 3 |
| `/de` | yes | WebSite | 0 | 2 |
| `/de/studio` | yes | Service | 0 | 0 |
| `/de/selfie-studio-budapest` | yes | Service | 0 | 3 |
| `/de/equipment` | yes | Service | 0 | 14 |
| `/de/props` | yes | Service | 0 | 1 |
| `/de/photographers-budapest` | yes | Service | 0 | 3 |
| `/de/models-budapest` | yes | Service | 0 | 4 |
| `/de/stylists` | yes | Service | 0 | 3 |
| `/de/make-up-artists` | yes | Service | 0 | 3 |
| `/de/packages` | yes | Service | 0 | 6 |
| `/de/commercial-photography-budapest` | yes | Service | 0 | 0 |
| `/de/corporate-photography-budapest` | yes | Service | 0 | 4 |
| `/de/portrait-photography-budapest` | yes | Service | 0 | 6 |
| `/de/fitness` | yes | Service | 0 | 6 |
| `/de/glamour-boudoir-photography-budapest` | yes | Service | 0 | 6 |
| `/de/model-polaroids-budapest` | yes | Service | 0 | 6 |
| `/de/model-digitals-preparation` | yes | Article | 0 | 3 |
| `/de/pet-photography-budapest` | yes | Service | 0 | 3 |
| `/de/id-photo` | yes | Service | 0 | 2 |
| `/de/photographer-mentoring-budapest` | yes | Service | 0 | 3 |
| `/de/booking` | yes | — | 0 | 16 |
| `/de/selfie-booking` | no | — | 0 | 0 |
| `/de/faq` | yes | FAQPage | 0 | 19 |
| `/de/privacy-policy` | yes | — | 0 | 0 |
| `/de/photographer-daniel` | yes | Person | 0 | 3 |
| `/de/photographer-alexandra` | yes | Person | 0 | 3 |
| `/de/christmas-photoshoot` | yes | Service | 0 | 6 |
| `/de/christmas-studio` | yes | Service | 0 | 6 |
| `/de/post-booking` | no | — | 0 | 1 |
| `/de/selfie-post-booking` | no | — | 0 | 0 |
| `/de/wedding-photography` | yes | Service | 6 | 12 |
