# Homepage migration handoff

Checkpoint: 2026-09-05

## Current state

The English and Hungarian homepage routes (`/` and `/hu`) are implemented in Astro with the shared site shell, footer, metadata, hreflang, JSON-LD and conversion links. The current work is a visual and interaction parity checkpoint for the homepage, not a redesign.

The next page should be migrated incrementally from its Wix source, using the same audit-first process. The recommended next candidate is `/studio` and `/hu/studio`.

## Decisions to keep

- Keep production URLs, search intent, language counterparts and booking destinations unchanged unless the migration contract explicitly says otherwise.
- Keep Astro static generation, with React islands only where interaction is needed.
- Reuse Radix primitives for interactive behavior and Phosphor icons; tune the CSS to the Wix reference rather than replacing the design with a generic component-library theme.
- Use Jitter for display headings and Jura for body, navigation, buttons and metadata-like UI.
- Avoid negative letter-spacing on Jitter headings. Preserve intentional title line breaks with explicit mobile break elements where the Wix layout requires them.
- Keep reusable button, navigation, accordion, gallery/lightbox and card patterns centralized.

## Homepage parity notes

- The top navigation is approved for now. Desktop navigation uses Radix Navigation Menu; language switching uses Radix Dropdown Menu.
- The mobile hamburger menu matches the Wix structure: dark full-screen panel, centered Jura labels, 56px rows, separators, left chevrons, three accessible accordions, mentoring, pricing and a direct external Book Now action.
- The homepage hero keeps its image, overlay, icon, ellipse crop and separate mobile/desktop CTA labels.
- The three circular-card sections use a shared 24px/26.4px Jitter title size on mobile and desktop. Card links are bold. Circular images keep proportional crops and card-level hover zoom.
- The studio showcase uses the source images for both cropped gallery display and full-image lightbox; each individual gallery image has the subtle right-edge darkening gradient.
- Quote cards, booking cards, footer icon columns and responsive spacing were tuned against the Wix mobile reference. Do not reintroduce arbitrary fixed-width heading boxes: centered elements must remain centered at wider mobile widths.

## Verification baseline

Run:

```bash
npm run check && npm run build
```

The checkpoint passes with 0 Astro diagnostics and validates 54 generated routes plus 1 direct redirect for URL parity, metadata, canonicals, hreflang, internal links, sitemap and robots. The validator still reports the known duplicate Hungarian title shared by `/hu/glamour-boudoir-photography-budapest` and `/hu/wedding-photography`; investigate it during the relevant page/content audit.

## Next-page workflow

1. Inspect the live Wix desktop and mobile page, including source HTML, computed typography, image sources/crops, hover/focus states and click behavior.
2. Compare the route and counterpart against `src/data/routes.mjs` and the migration inventory before changing content or URLs.
3. Implement the page with existing shell, typography, button and media primitives.
4. Verify rendered HTML metadata, structured data, hreflang, internal links and conversion destinations.
5. Test at the source desktop/mobile widths, then run the full check/build before committing.
