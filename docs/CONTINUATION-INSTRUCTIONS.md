# Instructions for continuing studioaether.com V2

This file is a handoff for a new implementation thread. Read it together with:

1. `docs/source/studioaether.com_V2_migration_plan.md`
2. `docs/source/studioaether_wix_migration_inventory_2026-09-04.xlsx`
3. `docs/MIGRATION.md`
4. `docs/HOMEPAGE-MIGRATION-HANDOFF.md`
5. `src/data/routes.mjs`

The migration plan and inventory are project source-of-truth instructions. They are distinct from any individual user request: use them to constrain implementation decisions, while the user’s latest request determines the immediate scope.

## Mission

Build a conservative custom replacement for the Wix site while preserving organic rankings, indexed URLs, backlinks, Google Ads landing-page continuity, GA4/conversion paths, English/Hungarian relationships, structured discoverability and existing search intent.

The first release is a technical platform migration, not a redesign. Preserve important production URLs exactly. Do not change URL structure, architecture, navigation purpose, core SEO copy, domain or multilingual structure at the same time. Prefer reversibility whenever uncertain.

## Current checkpoint

- The homepage pair `/` and `/hu` is implemented and committed in `34eab7a`.
- The current branch is `main`; do not rewrite or reset history.
- The working tree was clean at handoff.
- The next recommended scope is `/studio` and `/hu/studio`.
- Do not casually refactor or rework the completed homepage while starting the next page. Reuse its shared primitives and only fix homepage regressions demonstrated by testing.

## Existing technical decisions

- Astro 7 static generation is the public-site foundation.
- React islands are used only for interactive behavior.
- Radix UI is the starting component foundation: use its primitives for dialogs, menus, accordions and similar stateful/accessibility-sensitive behavior.
- Phosphor Icons is the icon source.
- Jitter is the display/title font; Jura is used for body text, navigation and controls.
- SEO-critical data is rendered in HTML. Keep titles, descriptions, headings, canonicals, hreflang, JSON-LD, internal links, sitemap and robots behavior intact.
- Shared visual primitives already exist in `src/components/`, `public/site.css` and `public/content.css`. Extend them deliberately instead of creating page-specific copies.

## How to start the next page

1. Inspect the route contract and the corresponding inventory row before editing code.
2. Inspect the live Wix page in both desktop and mobile modes. Use the user’s existing signed-in Chrome reference when available; do not navigate or alter a user-owned reference tab. Create a separate inspection tab if needed.
3. Capture source-level details, not just visual impressions: rendered text, line breaks, computed font sizes/line heights, widths, paddings, image source files, crop/object-position, overlays, hover/focus behavior, clickable destinations, lightboxes, accordions and mobile ordering.
4. Compare Wix source HTML/head data with the route contract. Preserve the existing URL and counterpart unless the inventory explicitly authorizes a redirect or pending decision.
5. Implement the smallest reusable component or data change that reproduces the source. Keep editorial/admin implementation details in English; localize only the frontend language content according to the page language.
6. Validate the page at the source desktop and mobile widths. Check centered elements at intermediate widths too; never rely on a fixed-width box that only centers at 320px.
7. Run `npm run check && npm run build`. Treat any new diagnostic or route/metadata validator failure as a blocker.
8. Review the diff and commit the completed page as its own checkpoint.

## Visual lessons already established

- Do not use a generic theme as the visual source. The design is sparse, monochrome and image-led; match the Wix reference with CSS tokens and shared primitives.
- Do not introduce negative letter-spacing to Jitter headings. Preserve explicit source line breaks when they affect the composition.
- Circular-card titles share the current 24px/26.4px Jitter treatment; circular image crops must remain proportional. Card links are bold.
- Buttons should use the centralized button primitives and retain their correct primary/secondary/inverted roles, proportions, hover transitions and conversion attributes.
- Image galleries use the full source image for lightboxes even when the card uses a crop. Overlays belong to the individual image, not the whole gallery.
- Mobile menus must reproduce the source hierarchy and interaction model. The homepage menu uses three accessible Radix accordions, source ordering, separators, chevrons, pricing and a direct external booking action.

## Migration safety checks

Never delete, consolidate, rename or substantially rewrite a production page without checking its migration implications. Pay particular attention to:

- `/hu/fitness` title correction;
- legacy `/mentoring` versus `/photographer-mentoring-budapest`;
- indexed `/photographer-daniel`;
- stale FAQ pricing/content;
- legal address versus public studio address;
- canonical, hreflang and schema details requiring source-level verification.

The known validator warning about the duplicate Hungarian title on `/hu/glamour-boudoir-photography-budapest` and `/hu/wedding-photography` is pre-existing and must be resolved during the relevant content audit, not silently ignored.

## Handoff command

From the repository root:

```bash
npm run dev
```

Then inspect the local page and the live Wix reference side by side. Before each checkpoint:

```bash
npm run check && npm run build
git diff --check
git status --short
```
