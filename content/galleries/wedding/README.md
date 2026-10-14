# Wedding galleries

Photos directly in this folder appear in the main wedding gallery.

Drop category favourites into these subfolders for the coverage-card lightboxes:

- preparations
- couple
- ceremony
- reception
- group-family
- party

Supported: JPG, JPEG, PNG, WebP and AVIF. Files sort naturally by filename; use 01-, 02-, etc. to control order. A photo can be copied into more than one category.

After adding or changing photos, run `npm run gallery:sync -- --galleries=wedding`, then restart the local dev server or rebuild. Empty category folders keep the current starter selection.
