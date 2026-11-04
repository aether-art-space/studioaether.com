# Website health audit — 4 November 2026

The site has a strong technical foundation. The main risks are form-data handling, dependency maintenance, privacy-copy accuracy, and release safeguards. Structural SEO is healthy across the live sitemap. This audit made no application changes and deployed nothing; the production build was regenerated locally for validation, then tracked build outputs were restored to their pre-audit state.

## Scope and verified results

- Live crawl of all 85 sitemap URLs: every URL returned 200, with a matching canonical, exactly one H1, a nonempty description, no unexpected noindex, and no images missing an alt attribute. Alt presence does not establish descriptive quality.
- `npm run release:build` and `npm run check` passed. The validator covered 96 rendered contract routes, 85 indexable routes, one direct redirect, and 351 structured offer occurrences. Astro reported zero errors/warnings and two unused-variable hints.
- Additional HTML parsing across all 98 built HTML files found no duplicate IDs, missing internal fragment targets, or missing local assets referenced by img/script or stylesheet/preload/icon links. This was not a full srcset or external-link crawl.
- Korean page/booking-adapter and tracking tests passed: `node scripts/test-korean-selfie-pages.mjs` and `node scripts/test-korean-selfie-tracking.mjs`.
- Live robots.txt and sitemap.xml returned 200; an invented URL returned a real 404 with noindex. `/mentoring` resolved to `/photographer-mentoring-budapest`; `/studio/` resolved to `/studio`. Opening `http://studioaether.com/` reached the HTTPS www homepage; the exact redirect status/chain was not captured.
- Mobile checks at 390 CSS pixels: no document overflow on selfie booking, props, wedding, or German homepage. Horizontal galleries intentionally scroll within their containers.
- Props gallery: opening, next-image navigation, closing, and focus restoration passed. Contact dialog opened and rejected an empty form. German mobile navigation opened successfully. Selfie Cal.com iframe loaded; no appointment was made.

| Live page | Lighthouse accessibility | Best practices | SEO |
|---|---:|---:|---:|
| Homepage `/` | 100 | 100 | 100 |
| Studio booking `/booking` | 98 | 100 | 100 |
| Wedding `/wedding-photography` | 99 | 100 | 92 |
| Props `/props` | 100 | 100 | 100 |
| German homepage `/de` | 100 | 100 | 100 |
| Korean selfie landing | 100 | 100 | 100 |

These are sampled automated audits, not certification of accessibility or functionality across every page.

Homepage cold-load traces: desktop, unthrottled LCP **263 ms**, CLS **0.00**; mobile 390px, Slow 4G and 4× CPU slowdown LCP **2,241 ms**, CLS **0.00**. These are individual lab runs, not real-user percentiles. CrUX data was unavailable in the trace output; INP was not established.

## Prioritized findings

### 1. High: raw contact emails enter the analytics data layer without a consent check

Evidence: `src/components/ContactModal.astro:89–97`, `src/components/BookingFooter.astro:133–141`, `src/components/PageContent.astro:1610–1618`. Successful submissions push `user_data: { email: submittedEmail }` unconditionally. The normal click tracker has consent checks, but these form handlers bypass them.

Impact: tags with data-layer access can read a submitted email even when the visitor selected necessary-only cookies. This confirms exposure inside the page; actual downstream transmission depends on the GTM container and was not proven by submitting a real form.

Fix: remove email from ordinary analytics events. If enhanced conversions are intentional, implement a separately documented flow gated on the appropriate consent, with controlled normalization/hashing and tag destinations. Hashing by itself does not replace consent or destination controls. Add mocked successful-submit tests for every consent state and verify GTM Preview payloads.

### 2. Medium: installed dependencies have published security advisories

`npm audit --json` reported **two affected packages: one high, one moderate**, with no critical findings. Astro is pinned to 7.2.8 (`package.json:28`); installed Zod is 4.5.4, used by Astro and @astrojs/sitemap.

- Astro JSX/MDX script/style escaping: versions below 7.3.2 affected. [Advisory](https://github.com/advisories/GHSA-98hj-9722-w3j8).
- Astro View Transition CSS injection: fixed in 7.3.3. [Advisory](https://github.com/advisories/GHSA-mpr7-6m5w-76rw).
- Zod oversized constrained collection memory exhaustion: versions below 4.6.6 affected. [Advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).

The public site is static: these package severities do not demonstrate an exploitable production endpoint. No visitor-controlled build content or relevant View Transition input was established. Update Astro and compatible integrations/lockfile, resolve Zod to a patched compatible version, then rebuild, run existing checks, and compare representative screenshots. npm offered Astro 7.4.5 as a non-major remediation at audit time.

### 3. Medium: privacy wording does not describe current measurement behavior

Evidence: `src/data/content.mjs:2072`, `:2082`, `:2100` says optional measurement is enabled only after “Accept all.” The banner also offers ad measurement alone (`public/cookie-consent.js:60–64`). The tracker intentionally loads advanced consent-mode tags before a choice (`public/tracking.js:204–206`). A fresh live homepage session produced Google measurement requests with denied consent signals (`gcs=G100`) before interaction.

Fix: accurately distinguish storage consent, cookieless measurement, ad-measurement-only consent, and personalization. State the actual providers and behavior. This is an implementation/documentation mismatch, not a legal compliance determination.

The controller address says Tátra utca 29b while the footer and business schema show Lónyay utca 60. (`content.mjs:2069`, `:2079`, `:2097`). Verify whether the former is the correct registered address; if so, explicitly distinguish registered/controller and studio addresses rather than blindly replacing it.

### 4. Medium: publish command can label an unverified artifact as a clean commit

Evidence: `scripts/publish-pages.mjs:6–18` reads HEAD and uploads whatever is currently in `dist`, explicitly passing `--commit-dirty=false`. It does not check worktree state, whether HEAD was pushed, production build environment, validation results, or whether `dist` came from this commit. `release:publish` does not invoke `release:build` (`package.json:12`).

Impact: a stale, preview, or locally modified build can be uploaded with misleading commit provenance despite the release guidance in README.

Fix: verify a clean relevant source tree and remote commit, create a build manifest with commit/environment/artifact digest, and refuse publishing when the artifact does not match. Pin Wrangler rather than resolving an unlisted deployment CLI through npx. Provide a single verified release path.

### 5. Medium: selfie booking lacks a dependable escape route when the embed fails

Evidence: `src/components/SelfieBookingEmbed.astro:15–24` has an empty JS-populated container and no persistent direct booking anchor or noscript fallback. `:48–51` only replaces text when no iframe exists; it ignores failures once an iframe is present. No load timeout is implemented. The live English booking page has no links inside main.

Fix: always display “Open booking calendar” linking to `https://cal.com/aether-studio/selfie-shoot`, plus an email contact option. Add a loading state, bounded timeout/retry, and a noscript explanation. Test blocked scripts, offline conditions, slow loading, iframe failure, and duplicate success callbacks. The working embed itself loaded during this audit.

### 6. Low: wedding links and heading levels fail automated checks

Wedding Lighthouse SEO is 92 because two links say only “learn more,” pointing to makeup artists and stylists. Evidence: `src/components/PageContent.astro:759`. Use descriptive visible labels such as “Explore wedding makeup artists” and “Meet our stylists.”

Booking accessibility is 98: “Discounted Studio Timeslots” starts at H3 without an H2 parent. Wedding accessibility is 99: preparation/engagement/content-creation cards use H4 beneath H2 sections. Evidence: `src/components/PriceCard.astro`, `src/components/PriceSection.astro:59–63`, `src/components/ExtrasCard.astro:42`, `:51`. Make heading level configurable and supply it from the section context; retain visual styling independently.

### 7. Low: social image MIME metadata contradicts the image URL

Evidence: `src/components/Seo.astro:369–373` hard-codes `image/jpeg`; `src/lib/images.mjs:31`, `:56` resolves the full image as WebP. Confirmed on the live wedding page: og:image ends `.webp` but og:image:type says `image/jpeg`.

Fix: derive the declared type from the selected asset or use a dedicated JPEG social image. Verify an actual social preview after deployment; the mismatch alone does not prove previews currently fail.

### 8. Medium improvement: regression checks are not enforced on pull requests

The repository's supplied GitHub workflow only runs on manual dispatch and builds a GitHub Pages preview (`.github/workflows/pages.yml:3–4`, `:28–29`). It does not run production validation, Astro checks, or the existing Korean tests. No separate PR-check workflow was found.

Fix: add PR CI that builds production output, runs checks and existing targeted tests, audits dependencies, and exercises representative navigation/consent/booking states in a browser. Mock outbound submissions. Add screenshot comparisons for EN/HU/DE/KO at mobile and desktop sizes. Configure required branch checks where appropriate; repository branch protection was not inspected.

### 9. Medium UX improvement: consent panel dominates mobile booking

At 390×844, the initial panel is approximately **403 CSS pixels high (48% of the viewport)** and overlays the calendar. It appears after the footer in DOM order, with no initial announcement/focus strategy (`CookieConsent.astro:10–45`, `cookie-consent.js:47–53`). Reopening settings moves focus, but closing does not explicitly restore it (`cookie-consent.js:71–75`).

Fix: shorten the explanation, use a compact layout while keeping choices clear, and decide explicitly whether this is a nonmodal notice or a modal decision. Use an appropriate announcement/focus model for that choice; a nonmodal banner does not inherently require a focus trap. Verify keyboard navigation and zoom on small screens.

## Further improvements, ordered by practical value

1. **Performance:** self-host the Google Baskervville font and serve modern WOFF2 fonts instead of multiple TTF weights. `public/site.css:1` adds an external CSS import chain. The slowed mobile trace identified about 538 ms of potential FCP savings from render-blocking requests; this is an estimate, not an additive LCP saving. Desktop image insight estimated 222.4 kB avoidable delivery. Tune image sizes per rendered context, especially galleries, and verify on mobile before changing image quality.
2. **Conversion measurement:** inspect GTM Preview and GA4/Ads destinations for enquiry success versus CTA clicks, actual booking success, cross-domain attribution, and duplicate events. A homepage audit observed `G-NFVD8Z3MN2` page-view traffic outside the Korean landing flow; verify whether that property's broad scope is intentional before interpreting experiment results. Source code alone cannot establish container behavior.
3. **Form resilience:** the three submit handlers duplicate network/analytics behavior and have no AbortController timeout. Extract a shared submission helper, preserve entered data on failure, bound waiting, and use mocked tests for success, provider rejection, malformed responses, timeouts, and retry. A public Web3Forms access key is intended for client use and was not classified as a leaked server secret. Provider spam/domain restrictions were not inspected.
4. **Security hardening:** existing CSP, frame restrictions, nosniff, referrer and permissions policies are useful. Reduce script `unsafe-inline` using hashes/external scripts and introduce CSP reporting, testing Cal.com and Google tags carefully. Do not tighten the policy without checking conversion flows.
5. **Content/local SEO:** replace generic links and thin introductions where actual search-query evidence supports it; strengthen relevant service-to-guide links. Keep prices, physical address, business hours, review counts and seasonal availability synchronized. Google review text is explicitly dated 8 September 2026: refresh from a verified source and retain honest dating. No ranking forecast is warranted from technical scores alone.
6. **Maintainability:** `PageContent.astro` is 1,627 lines, `content.mjs` 2,326 lines and `content.css` 2,133 lines. Split by service and shared behavior as those areas change, starting with duplicated forms and translation handling. Avoid a large rewrite solely to reduce file length. Remove the two unused-variable hints and refresh README's old migration/scaffold status.
7. **Production hygiene:** exclude `/ui-library-prototype` from production output; it currently builds despite being correctly noindexed. Add explicit conventions for generated artifacts, audit exports and local operational files; the worktree already contained many unrelated untracked documents/scripts before this audit.
8. **Operations:** establish uptime/booking-load checks, post-release smoke checks, a tested rollback procedure, broken-link monitoring, and real-user performance/error visibility with deliberate privacy controls. External monitoring/account configurations were not examined, so their absence is not established.

## Suggested implementation order

1. Remove unconditional raw-email data-layer fields; verify GTM destinations and privacy wording.
2. Patch vulnerable dependencies and rerun build/check/browser comparisons.
3. Add artifact provenance/release guards and PR validation.
4. Add the booking fallback and bounded form loading.
5. Fix heading levels, descriptive links, and Open Graph MIME metadata.
6. Improve mobile consent presentation, fonts/images, content freshness, and monitoring.

## Limits

No real forms, appointments, payments, email delivery, or ad-account changes were submitted. This was Chromium sampling plus a full sitemap HTTP/metadata crawl and local source/build inspection. Safari, Firefox, assistive-technology sessions, full human translation review, all external links, real booking confirmation delivery, Search Console coverage/rankings, backlinks, account-side GTM rules, DNS/email deliverability, and historical uptime remain unverified. No claim of complete security or legal compliance is made.
