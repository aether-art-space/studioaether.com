# studioaether.com V2 — Migration Plan

## Objective
Move studioaether.com from Wix to a custom website while preserving organic search visibility, Google Ads performance, analytics continuity, AI-search discoverability, backlinks, multilingual SEO, and conversion tracking.

## Core rule
Treat the first release as a technical platform migration, not a redesign.

Preserve wherever possible:
- Domain
- URL paths
- Page purpose and core copy
- Titles and meta descriptions
- H1/H2 hierarchy
- Canonicals
- Hreflang
- Structured data
- Image alt text
- Internal links
- Navigation
- GA4 and Google Ads conversion actions

Do not combine the initial migration with a major URL restructure, extensive copy rewrite, major navigation change, or domain change.

## Migration phases

### 1. Inventory and baseline
Use `studioaether_wix_migration_inventory_2026-09-04.xlsx` as the migration source of truth.

Before cutover, supplement it with:
- Google Search Console page/query exports
- Search Console indexing status
- Backlink data where available
- Google Ads final landing-page URLs
- Raw HTML title/meta/canonical/hreflang/schema
- Current robots.txt and sitemap
- Current redirect behavior
- GA4 and Google Ads conversion definitions

### 2. URL parity
Preferred rule: old URL = new URL.

If a URL must change:
- Use a direct server-side 301 or 308 redirect
- Redirect to the closest equivalent destination
- Avoid redirect chains
- Do not redirect unrelated removed pages to the homepage
- Keep important redirects for at least one year, preferably indefinitely

### 3. Technical implementation
Prefer static generation, SSR, or hybrid rendering.

Important SEO content should be present in rendered HTML:
- Titles
- Headings
- Main text
- Internal links
- Canonicals
- Hreflang
- Structured data

Do not depend entirely on client-side JavaScript for SEO-critical content.

### 4. Multilingual SEO
Maintain reciprocal EN/HU relationships.

Verify:
- EN and HU pages self-canonicalize
- Hreflang is reciprocal
- Canonical does not conflict with hreflang
- Language variants are not accidentally treated as duplicates

### 5. Structured data
Audit current Wix output, then implement only valid, useful schema on the new site.

Likely relevant:
- Organization
- LocalBusiness / ProfessionalService
- Person
- Service
- BreadcrumbList
- ImageObject
- WebSite
- WebPage
- FAQPage only where appropriate

### 6. Internal linking
All internal links should point directly to the final production URL.

Check for:
- Broken links
- Redirecting internal links
- Orphan pages
- Incorrect nofollow
- Duplicate titles/H1s
- Incorrect canonicals

### 7. Images and performance
Preserve important image semantics while improving delivery.

Use where appropriate:
- Responsive images
- srcset
- WebP/AVIF
- Width/height attributes
- Lazy loading below the fold
- CDN delivery
- Sensible compression

Monitor:
- LCP
- INP
- CLS
- Server response time
- JS payload
- Image payload
- Font loading

### 8. Robots and sitemap
Production must not inherit staging restrictions.

Sitemap should contain only:
- Canonical
- Indexable
- HTTP 200 pages

Exclude:
- Redirects
- 404/410 pages
- Noindex pages
- Staging URLs
- Duplicates

### 9. Staging
Use a private/non-indexable staging environment.

Prefer authentication. Noindex can be secondary protection.

Never let staging canonicals, URLs, or tracking leak into production.

### 10. Analytics and Ads
Keep the existing GA4 property and Google Ads account.

Verify before launch:
- Google tag site-wide
- GA4 pageviews
- Campaign attribution
- Contact-form events
- Booking events
- CTA events
- Google Ads conversions
- Consent Mode
- Enhanced conversions if in use
- No duplicate event firing

### 11. Forms and booking
Test every conversion path on desktop and mobile:
1. Interaction works
2. Submission succeeds
3. Notification arrives
4. Thank-you behavior works
5. GA4 event fires
6. Google Ads conversion fires where intended
7. No duplicate conversions

### 12. Pre-launch crawl
Do not cut over until:
- Every inventory URL has a disposition
- Important URLs return 200
- Redirects work
- No redirect chains
- Titles/meta/H1/canonical/hreflang/schema verified
- Internal links checked
- Sitemap and robots verified
- GA4 and Ads tracking tested
- Forms and bookings tested
- Mobile and desktop tested
- HTTPS and canonical hostname verified

### 13. Launch
At cutover:
1. Deploy production
2. Switch DNS/hosting
3. Verify HTTPS and hostname redirects
4. Test critical pages
5. Crawl production
6. Verify redirects
7. Check robots/noindex
8. Submit sitemap
9. Test GA4
10. Test Ads conversions
11. Test consent behavior
12. Test forms/bookings
13. Inspect server errors

### 14. First 48 hours
Monitor:
- 404/500 spikes
- Broken images
- Wrong canonicals
- Accidental noindex
- Redirect loops
- Missing analytics
- Lost form submissions
- Ads conversion failures
- Search Console indexing issues

### 15. First 2–4 weeks
Track against baseline:
- Organic clicks
- Impressions
- Rankings
- Indexed URLs
- Conversions
- Ads conversion rate
- Landing-page performance
- Core Web Vitals
- Crawl errors

Do not react to minor short-term ranking movement with broad rewrites. Diagnose technical causes first.

### 16. Stabilization threshold
Consider migration stable when:
- Important pages are indexed correctly
- No major crawl errors remain
- Tracking is reliable
- Organic traffic is broadly normal
- Rankings show no unexplained systematic loss
- Ads conversions remain normal
- Performance is healthy

### 17. Phase 2 improvements
Only after stability:
- Improve titles/meta
- Improve internal linking
- Add or refine schema
- Improve service architecture
- Improve performance
- Improve landing pages and conversion flow
- Improve semantic content for AI/search discovery

## Known items requiring special attention
From the current inventory:
- `/hu/fitness` currently has an incorrect corporate-photography title
- `/mentoring` and `/photographer-mentoring-budapest` both require consolidation review
- `/photographer-daniel` is discoverable outside primary navigation
- FAQ pricing/content appears stale compared with current package pages
- Public studio address and privacy-policy legal address need intentional distinction
- Raw canonical, hreflang, schema, robots and exact meta-description values still need source-level export

## Decision rule
Before changing anything during migration, ask:

**Is this required to leave Wix?**

If yes, do it during migration.
If no, normally postpone it until the site is stable.

## Success criterion
The ideal first release is intentionally boring: same domain, same important URLs, same search intent, same conversion paths, but on the new custom stack.
