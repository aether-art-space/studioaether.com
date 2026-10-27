# Korean selfie test measurement

## Events emitted by the site

The `/ko/selfie-studio-budapest` experiment landing page and `/ko/selfie-booking` page are identified by `body[data-experiment="korean-selfie-v1"]`. With **analytics consent** granted, `/tracking.js` emits:

| Event | When it fires | Meaning |
| --- | --- | --- |
| `korean_selfie_landing_view` | Korean experiment landing page view | Consented visit to the test landing page |
| `korean_selfie_booking_view` | Korean booking page view | Consented visit to the embedded booking page |
| `korean_selfie_booking_click` | Korean experiment CTA click | Consented click on the booking CTA, including its `location` value |
| `korean_selfie_booking_received` | Cal.com `bookingSuccessful` callback dispatches `selfie:booking-received` | Cal.com accepted a booking request |

Every event includes `experiment_id` (`korean-selfie-v1`) and `language` (`ko`). When available, it also includes one attribution pair: `source_type` and `source_value`. UTM attribution uses fixed allowlisted categories from `utm_source` (Naver, Google, Instagram, Facebook, TikTok, YouTube, or direct) or `utm_medium` (organic, CPC, paid social, social, referral, or email); arbitrary campaign text is ignored. Referrers are reduced to those same known platform categories. Query strings, fragments, referrer paths, names, email addresses, phone numbers, and booking payloads are not sent. A category is retained in `sessionStorage` only after analytics consent, preserved across experiment page navigation, not overwritten by internal referrers, and cleared if analytics consent is revoked.

Events require analytics consent, including when only ad measurement consent is granted. A landing or booking page view waits in memory if the page loads before consent and is sent once if the visitor grants analytics consent later. Without analytics consent, no experiment event is sent. A direct visit to `/ko/selfie-post-booking` does not emit a booking event. The booking event is emitted only by the real Cal.com success callback, and duplicate callback dispatches are deduplicated per page.

`korean_selfie_booking_received` means **request received**, not a studio-confirmed appointment. Cal.com is configured with `requiresConfirmation`; appointment confirmation must be checked in Cal.com before describing this as a confirmed booking or revenue conversion. The embed should enqueue the event before redirecting; `dataLayer.push` is synchronous, though a redirect does not guarantee that a remote analytics request finished transmitting.

## GA4 and GTM setup

No external analytics settings are changed by this implementation. The Korean page's tracking configuration supplies `experimentGa4Id: "G-NFVD8Z3MN2"`, the existing production GA4 destination. The tracker sends each experiment event once with `send_to` set to that destination and `transport_type: "beacon"`, using the Google tag already loaded by GTM. This requires no new GTM triggers/tags, does not call `gtag("config", ...)`, and does not create a parallel custom-event plus GA4-event pair. If the destination is absent, the tracker falls back to a `dataLayer` custom event in GTM mode. Register `experiment_id`, `language`, `source_type`, `source_value`, and `location` as GA4 custom dimensions only if they are needed in standard reports.

Preview with analytics consent denied, then granted, and verify no experiment GA4 event is sent while denied. Confirm each landing/booking view fires once and the booking event fires only after completing an actual test booking through the Cal.com embed. Do not use the post-booking confirmation page path as a conversion trigger for this test. The code path and focused local tests are verified; live GA4 receipt has not yet been verified in Tag Assistant or GA4 Realtime.

If the site is running its direct Google tag fallback rather than GTM, the same named GA4 events are sent directly after analytics consent. Keep existing Ads tags and conversion actions unchanged; this test does not declare a new Ads conversion.

## Search Console and Naver

Use Google Search Console's Performance report to compare Korean query impressions, clicks, CTR, and average position for the Korean landing URL and Korean-language queries. Allow for indexing and reporting delay, and compare equivalent dates and devices where possible. Search Console does not measure booking requests and does not prove that a visitor saw or converted on the page.

Use Naver Search Advisor to submit/verify the Korean site ownership and sitemap if the site is intended to be indexed in Naver. Review available crawl/indexing diagnostics and search exposure data; Naver's reporting is separate from GA4 and should not be treated as a booking conversion source. Do not add a new Naver analytics script or tag as part of this measurement implementation.

## Evaluation window and limitations

Evaluate after **6–8 weeks** of stable indexing and traffic, using the same start/end dates for GA4 and search-platform reports. Review the sequence from landing view to booking-page view to `korean_selfie_booking_received`, and compare Google Search Console and Naver search visibility separately. Interpret counts as consented, observed events, not total traffic. Low Korean search volume, consent opt-out, cross-device journeys, browser restrictions, attribution loss, and the small sample can make rates unstable. Treat the callback event as a received request until Cal.com confirms the appointment; report confirmed bookings separately from website measurement.


## Scorecard and decisions

This is a single-language acquisition pilot, not a randomized A/B test. It can establish demand and funnel performance; it cannot prove that Korean copy alone caused an uplift.

Record a weekly scorecard starting with the actual public launch date:

| Measure | Calculation / source |
| --- | --- |
| Discovery | Search Console impressions and clicks filtered to the Korean landing URL; Naver visibility separately |
| Booking intent | Sessions with `korean_selfie_booking_click` / sessions with `korean_selfie_landing_view` |
| Calendar progression | Sessions with `korean_selfie_booking_view` / landing sessions |
| Request rate | Sessions with `korean_selfie_booking_received` / landing sessions |
| Business result | Manually reconcile accepted requests, attended sessions and actual revenue in Cal.com / studio records |

Use GA4 sessions containing the relevant event rather than dividing raw click counts (one visitor can click multiple times). Filter to organic acquisition when assessing the organic objective; report creator/referral traffic separately. Preserve an export of equivalent pre-launch English selfie-page traffic as context, not as a matched control. After 6–8 weeks of indexing: no impressions suggests a discovery/indexing issue; impressions without clicks suggests the search snippet or intent needs work; visits without calendar progression suggests the offer/page needs work; calendar progression without requests suggests booking friction. If there is too little traffic to interpret rates, extend the observation period instead of declaring failure. Report requests separately from confirmed bookings and revenue, and avoid making claims about visitors' nationality based on language alone.

## Verification and launch state

The implementation is available in the local workspace and local preview; it has not been published to the public domain as part of this task. The live existing Cal.com embed was observed loading the selfie event, actual available times, `Europe/Budapest`, and the requires-confirmation notice in the Korean booking shell. No real appointment was created. Automated tests exercise both success callback variants and confirm one request event / redirect. Public indexing and GA4 Realtime receipt can only be checked after release. Keep the existing production Ads conversion actions unchanged.
