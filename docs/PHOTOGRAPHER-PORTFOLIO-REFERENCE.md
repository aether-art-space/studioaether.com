# Photographer portfolio reference stack

This project is the reference implementation for the upcoming photographer portfolio. Reuse the principles below unless the new portfolio has a clear reason to diverge.

## Recommended foundation

- **Astro 7.2.2** with static output (`output: "static"`): fast, crawlable pages with no public server runtime.
- **Astro components** for the page shell and content sections.
- **React 19.2.8** only for interactive islands such as navigation, dialogs, filters, or a gallery lightbox. Hydrate with Astro directives only where interaction is needed.
- **TypeScript 6.0.3** with Astro strict configuration.
- **ES modules** throughout (`"type": "module"`), with small Node.js scripts for build-time tasks.
- **Plain CSS** in the existing project, with design tokens and component-level class naming. There is no Tailwind dependency.

## Dependencies to reuse selectively

### Runtime/build dependencies

- `astro@7.2.2`
- `@astrojs/react@^6.0.5`
- `@astrojs/mdx@7.0.5` for editorial or long-form content when useful
- `@astrojs/sitemap@3.7.3` as the sitemap integration option
- `react@^19.2.8` and `react-dom@^19.2.8`
- `@phosphor-icons/react@^2.1.10` for consistent icons
- `@radix-ui/react-dialog@^1.1.23` for accessible modals/lightboxes
- `@radix-ui/react-accordion@^1.2.20` for FAQ or collapsible mobile content
- `@radix-ui/react-navigation-menu@^1.2.22` for accessible responsive navigation
- `@radix-ui/react-dropdown-menu@^2.1.24` when a menu/dropdown is needed

### Development and image tooling

- `@astrojs/check@0.9.10` for Astro/TypeScript diagnostics
- `sharp@^0.35.4` for build-time image processing and responsive AVIF/WebP/JPEG variants
- `playwright@^1.63.0` for visual baselines and browser smoke checks

## Architecture patterns worth carrying forward

- Keep the site **static-first** and use React only where the browser needs state or event handling.
- Keep content, routes, gallery metadata, and SEO inputs in explicit data modules rather than scattering them through templates.
- Use a shared layout for navigation, footer, metadata, canonical URLs, language alternates, JSON-LD, and consent/tracking.
- Create reusable Astro components for hero images, responsive images, gallery tiles, masonry galleries, pricing/content cards, lightboxes, and contact/booking CTAs.
- Store original photography separately from generated public variants. Generate a checked-in image manifest with dimensions, hashes, and responsive sources.
- Render responsive images with `<picture>`, AVIF/WebP sources, fallback formats, `srcset`, `sizes`, intrinsic `width`/`height`, meaningful alt text, and intentional lazy/eager loading.
- Keep the portfolio gallery accessible: keyboard-operable lightbox, focusable controls, visible focus states, captions where useful, and reduced-motion-friendly transitions.
- Validate the built output, not just source code: routes, canonical/hreflang, metadata, JSON-LD, sitemap, redirects, internal links, image dimensions, responsive sources, and missing assets.
- Use Playwright screenshots at representative mobile and desktop viewports to catch visual regressions.

## Delivery model

- Build with `npm run build` into `dist`.
- Preview with Astro locally and deploy the static artifact to **Cloudflare Pages**.
- Preserve preview/production environment separation; keep analytics identifiers out of previews by default.
- Use Git as the source of truth and deploy the reviewed commit.

## Existing project commands to use as a model

```text
npm run dev             # local Astro development server
npm run check           # Astro diagnostics plus generated-output validation
npm run build           # static production build
npm run preview         # serve the production build locally
npm run gallery:update  # intentionally refresh selected image variants
npm run baseline:visual # capture Playwright visual baselines
```

## Deliberate non-goals for the new portfolio

- Do not add a server framework, database, or CMS unless the portfolio actually needs authenticated editing or dynamic data.
- Do not add a UI framework for static presentation alone.
- Do not ship original, oversized camera files when generated responsive variants are sufficient.
- Do not make the gallery dependent on JavaScript for basic image discovery, SEO, or navigation.
