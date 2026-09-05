# Visual baseline

This directory is the visual source of truth for the migration. It is separate
from the SEO baseline because it records rendered layout, not just page metadata.

Run `npm run baseline:visual` to capture the Wix homepage at the fixed desktop
and mobile reference sizes. Each capture produces:

- a full-page PNG;
- a JSON file with viewport, page dimensions, shared-header geometry, headings,
  and visible image boxes; and
- `manifest.json`, which lists the generated files.

The current live Wix implementation has a 980px minimum layout width on its
mobile delivery. The mobile capture intentionally records that observed source
behaviour; V2 can improve mobile reflow later, but must not accidentally alter
desktop search/conversion behaviour during the initial migration.

Before rebuilding a page, capture it here. After implementation, capture the
same V2 route at the same viewports and compare section structure, imagery,
type, dimensions, and responsive behaviour against this reference.
