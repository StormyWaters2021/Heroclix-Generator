## PDF modes

- Max tokens per page: 30 with cutting gaps, 35 tightly packed, or 20 with ¼-inch bleed
- Avery 8293: exact 4 × 5 label-center positions on US Letter paper

Generated PDFs are exact US Letter dimensions. Print at Actual Size / 100%.

## Template shape and bleed configuration

Each template may define its physical shape in `settings/app-settings.js`:

```js
{
  id: "classic",
  label: "Classic blank token",
  image: "assets/templates/classic-token.png",
  bleedImage: "assets/templates/classic-token-bleed.png", // optional
  layoutId: "classic",
  shape: "circle" // "circle" or "square"
}
```

`image` is the normal 1254 × 1254 template. With the current 1.5-inch token and
0.25-inch bleed settings, an optional `bleedImage` should be 1672 × 1672. The
normal 1254 × 1254 design area must be centered in it, leaving 209 pixels on each
side. Layout coordinates remain unchanged between the two images.

When no `bleedImage` is supplied, the normal template remains centered while
uploaded artwork is allowed to extend into the bleed area. The red cut guide is
preview-only and is never written to the PDF.

The layout can also define a fallback `shape` and an `artwork.clipInset` in
`settings/token-layouts.js`.

## Two-sided printing

Every print-list entry contains an independent Front and Back token. The exported
PDF alternates front and back pages. Back-side positions are mirrored horizontally
for portrait duplex printing with **Flip on long edge**. Token artwork itself is
not mirrored.
