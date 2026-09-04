# studioaether.com production baseline — 2026-09-04

Read-only crawl of the current Wix production site, using the committed migration inventory as the URL source. The JSON file contains machine-readable details and payload hashes; full HTML was not committed.

## Scope

- Crawl timestamp (UTC): `2026-09-04T12:20:37.926996+00:00`
- Inventory URLs: `46`
- HTML pages parsed: `46`
- Additional sitemap-discovered URLs crawled: `9`
- Status summary: `{'200': 46}`
- Site files checked: `/robots.txt`, `/sitemap.xml`, linked English/Hungarian child sitemaps

## Immediate migration signals

- Non-200 or fetch-error inventory URLs: `0`
- Inventory URLs with redirects: `1`
- Pages missing a canonical: `0`
- Pages missing a meta description: `0`
- Pages without exactly one H1: `7`
- Pages with invalid JSON-LD: `0`
- Live title mismatches against inventory: `5`
- Live first-H1 mismatches against inventory: `31`
- Reciprocal hreflang issues: `0`
- Inventory URLs absent from the current XML sitemaps: `1`
- XML sitemap URLs outside the inventory: `9`

## Items requiring deliberate review

The baseline is evidence for migration decisions, not an instruction to copy every current value. In particular, review the known inventory findings: `/hu/fitness` title, legacy `/mentoring`, indexed `/photographer-daniel`, FAQ pricing/content, public versus legal addresses, and all source-level canonical/hreflang/schema details.

### Redirecting inventory URLs

- `https://www.studioaether.com/mentoring` — `1` hop(s), final `https://www.studioaether.com/photographer-mentoring-budapest`; `https://www.studioaether.com/photographer-mentoring-budapest`

### Title mismatches

- `https://www.studioaether.com/hu/portrait-photography-budapest` — inventory `Portré Fotózás | Aether Art Space`; live `Portréfotózás Budapesten | üzleti és lifestyle portré | aether`
- `https://www.studioaether.com/hu/fitness` — inventory `Vállalati Fotózás | Aether Art Space`; live `Fitness és jóga fotózás Budapesten | aether art space`
- `https://www.studioaether.com/hu/pet-photography-budapest` — inventory `Kisállat Fotózás | Aether Art Space`; live `Kisállat fotózás Budapesten | aether art space`
- `https://www.studioaether.com/hu/booking` — inventory `Foglalás és árak | aether art space fotóstúdió Budapest`; live `Foglalás és árak | aether art space fotóstudió Budapest`
- `https://www.studioaether.com/mentoring` — inventory `Digital and Analogue Photography Mentoring | Aether Art Space`; live `Photography Mentoring in Budapest | aether art space`

### First-H1 mismatches

- `https://www.studioaether.com/` — inventory `photostudio in Budapest tailored for creation`; live `photostudio in Budapest tailored for creation - both for pros and first timers`
- `https://www.studioaether.com/hu` — inventory `fotóstúdió Budapesten az alkotáshoz kialakítva`; live `fotóstudió Budapesten az alkotáshoz kialakítva - profiknak és első alkalmasoknak is`
- `https://www.studioaether.com/selfie-studio-budapest` — inventory `Aether Selfie Studio`; live `Aether Selfie Studio Budapest’s Premier DIY Photo Experience`
- `https://www.studioaether.com/hu/selfie-studio-budapest` — inventory `Aether Szelfi Studio`; live `Aether Szelfi Studio Budapest legjobb csináld-magad fotóstudiója`
- `https://www.studioaether.com/hu/equipment` — inventory `felszerelés`; live `felszerelés és kellékek`
- `https://www.studioaether.com/hu/photographers-budapest` — inventory `rezidens fotósok`; live `rezidens fotósaink`
- `https://www.studioaether.com/models-budapest` — inventory `resident models / models`; live `trusted models`
- `https://www.studioaether.com/hu/models-budapest` — inventory `modellek`; live `kedvenc modelleink`
- `https://www.studioaether.com/stylists` — inventory `stylists / brand designers`; live `styling and personal brand design`
- `https://www.studioaether.com/hu/stylists` — inventory `stylistok / énmárka tervezők`; live `styling és énmárka tervezés`
- `https://www.studioaether.com/make-up-artists` — inventory `make-up artists / hair stylists`; live `resident make-up artists, hair stylists and fashion stylists`
- `https://www.studioaether.com/hu/make-up-artists` — inventory `sminkesek / fodrászok`; live `rezidens sminkesek, fodrászok, stylistok`
- `https://www.studioaether.com/hu/packages` — inventory `fotózás csomagok / szolgáltatások`; live `fotózás és kombinált csomagjaink`
- `https://www.studioaether.com/hu/corporate-photography-budapest` — inventory `Vállalati fotózás Budapesten`; live `Vállalati Fotózás Budapesten`
- `https://www.studioaether.com/hu/portrait-photography-budapest` — inventory `Portré Fotózás`; live `Portré Fotózás Budapesten`
- `https://www.studioaether.com/fitness` — inventory `Fitness & Yoga Photography in Budapest`; live `Fitness and Yoga Photoshoot in Budapest`
- `https://www.studioaether.com/hu/fitness` — inventory `Fitness / jóga page (title mismatch)`; live `Fitness és Jóga Fotózás Budapesten`
- `https://www.studioaether.com/glamour-boudoir-photography-budapest` — inventory `Glamour, Boudoir & Fine Art Nude Photography`; live `Glamour, Boudoir and Fine Art Photography in Budapest`
- `https://www.studioaether.com/hu/glamour-boudoir-photography-budapest` — inventory `Glamour, Boudoir és Művészi Akt Fotózás`; live `Glamour, Boudoir és Művészi Fotózás Budapesten`
- `https://www.studioaether.com/model-polaroids-budapest` — inventory `Model Polaroids / Digitals`; live `Model Polaroids / Digitals and Portfolio Photoshoot in Budapest`
- `https://www.studioaether.com/hu/model-polaroids-budapest` — inventory `Modell Polaroidok / Digitalok`; live `Modell Polaroidok / Digitalok és Modell Portfólió Fotózás Budapesten`
- `https://www.studioaether.com/hu/pet-photography-budapest` — inventory `Kisállat Fotózás`; live `Kisállat Fotózás Budapesten`
- `https://www.studioaether.com/id-photo` — inventory `Fast passport / ID photo`; live `Quick ID or Passport photos`
- `https://www.studioaether.com/hu/photographer-mentoring-budapest` — inventory `Fotós mentorálás Budapesten`; live `Fotográfus Mentorálás Budapesten`
- `https://www.studioaether.com/booking` — inventory `Booking / prices`; live `Booking & Prices`
- `https://www.studioaether.com/hu/booking` — inventory `Foglalás / árak`; live `Foglalás és árak`
- `https://www.studioaether.com/faq` — inventory `Frequently Asked Questions`; live `None`
- `https://www.studioaether.com/hu/faq` — inventory `Gyakran Idézett Kérdések`; live `None`
- `https://www.studioaether.com/privacy-policy` — inventory `Privacy Policy`; live `None`
- `https://www.studioaether.com/hu/privacy-policy` — inventory `Privacy Policy`; live `None`
- `https://www.studioaether.com/photographer-daniel` — inventory `Photographer profile`; live `Dániel Z. Aczél`

## Site-level files

- `/robots.txt` — status `200`, bytes `550`, SHA-256 `f888cc9ae577f7d909e9344025e965e885cfb42abe90748473f06562cb5a27dc`
- `/sitemap.xml` — status `200`, bytes `248`, SHA-256 `f0e8f2a9b0d481aaa9336880eab22d60f96c5a0154e9e8d6abe40d216eed38e2`
- `/pages-sitemap.xml` — status `200`, bytes `2834`, SHA-256 `94ab0aba6f520c565f605c0c4a66e01653b9d758300e3b127590ebb366766f02`
- `/hu_hu-sitemap.xml` — status `200`, bytes `254`, SHA-256 `870c5c7ab13d8d7775e72a0628fea22c44666b3a6459a3ee501a8e3173089123`
- `/hu_hu-pages-sitemap.xml` — status `200`, bytes `2915`, SHA-256 `2ac1a7bc82b572bad0ce6b824a6d5d1df1e2b69903f68adacc0feb94e9c8528e`

## Sitemap-discovered URLs outside the inventory

These URLs were present in the current XML sitemaps but not in the supplied inventory. They must receive an explicit V2 disposition before cutover.

- `https://www.studioaether.com/christmas-photoshoot` — status `200`, final `https://www.studioaether.com/christmas-photoshoot`, title `Christmas Themed Photography | Aether Art Space`, canonical `https://www.studioaether.com/christmas-photoshoot`, H1 count `1`
- `https://www.studioaether.com/christmas-studio` — status `200`, final `https://www.studioaether.com/christmas-studio`, title `Christmas Studio in Budapest | aether art space`, canonical `https://www.studioaether.com/christmas-studio`, H1 count `1`
- `https://www.studioaether.com/hu/christmas-photoshoot` — status `200`, final `https://www.studioaether.com/hu/christmas-photoshoot`, title `Karácsonyi fotózás Budapesten | aether art space`, canonical `https://www.studioaether.com/hu/christmas-photoshoot`, H1 count `1`
- `https://www.studioaether.com/hu/christmas-studio` — status `200`, final `https://www.studioaether.com/hu/christmas-studio`, title `Karácsonyi fotóstúdió Budapesten | aether art space`, canonical `https://www.studioaether.com/hu/christmas-studio`, H1 count `1`
- `https://www.studioaether.com/hu/photographer-daniel` — status `200`, final `https://www.studioaether.com/hu/photographer-daniel`, title `Dániel Z. Aczél fotós Budapesten | aether art space`, canonical `https://www.studioaether.com/hu/photographer-daniel`, H1 count `1`
- `https://www.studioaether.com/hu/post-booking` — status `200`, final `https://www.studioaether.com/hu/post-booking`, title `Poszt-foglalás | Aether Art Space`, canonical `https://www.studioaether.com/hu/post-booking`, H1 count `1`
- `https://www.studioaether.com/hu/wedding-photography` — status `200`, final `https://www.studioaether.com/hu/wedding-photography`, title `Glamour, Boudoir és Művészi Akt Fotózás | Aether Art Space`, canonical `https://www.studioaether.com/hu/wedding-photography`, H1 count `1`
- `https://www.studioaether.com/post-booking` — status `200`, final `https://www.studioaether.com/post-booking`, title `post-booking | Aether Art Space`, canonical `https://www.studioaether.com/post-booking`, H1 count `1`
- `https://www.studioaether.com/wedding-photography` — status `200`, final `https://www.studioaether.com/wedding-photography`, title `Wedding Photographer Budapest | Natural & Elegant Wedding Photography | aether`, canonical `https://www.studioaether.com/wedding-photography`, H1 count `1`

## Per-page details

See the JSON and CSV files in this directory for the complete per-page record, including metadata, redirect chains, JSON-LD type counts, internal/external link sets, image alt counts, response headers, and payload hashes.

## Reproduction

Run from the repository root with the bundled Python runtime:

```sh
/Users/aczel/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/capture-production-baseline.py
```
