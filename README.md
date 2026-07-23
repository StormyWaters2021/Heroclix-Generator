# Custom Token Maker

A static, browser-only token editor designed for GitHub Pages. No build tools, server, npm, or installation are required.

## Run locally

Because the project uses JavaScript modules, serve the folder with any simple static web server rather than opening `index.html` directly. For example:

```text
python -m http.server 8000
```

Then open `http://localhost:8000/heroclix-token-maker/` when serving from the parent folder, or `http://localhost:8000/` when serving from inside the project folder.

## GitHub Pages

Upload the contents of this folder to a repository and enable GitHub Pages for the branch containing `index.html`.

## Settings

- `settings/app-settings.js`: fonts, template list, canvas size, physical token size
- `settings/token-layouts.js`: coordinates and dimensions for each template
- `settings/icon-options.js`: stat icon dropdowns
- `settings/ability-colors.js`: ability/color dropdowns
- `settings/print-layouts.js`: PDF page layouts

## Templates

The blank token is not hard-coded. Add another entry to `APP_SETTINGS.templates` and a corresponding layout in `TOKEN_LAYOUTS`. The template dropdown appears automatically.

## Fonts

Name and stat fonts are independently configured in `settings/app-settings.js`. Add web-font files under `assets/fonts/`, define them using `@font-face` in `css/base.css`, and reference the matching family name in settings.

## PDF modes

- Max tokens per page: 30 with cutting gaps, 35 tightly packed, or 20 with ¼-inch bleed
- Avery 8293: exact 4 × 5 label-center positions on US Letter paper

Generated PDFs are exact US Letter dimensions. Print at Actual Size / 100%.
