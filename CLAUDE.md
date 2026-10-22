# CLAUDE.md: rules for editing this portfolio

A static portfolio site for Sam Hutchinson, served by GitHub Pages from the repo root. Plain HTML/CSS/JS, with no build step and no dependencies apart from Google Fonts.

## Structure
- `data/projects.js` holds **all content**: `window.PORTFOLIO = { profile, projects }`. It's plain JS, not JSON, so `index.html` also works from `file://`.
- `index.html` has the layout skeleton only. `assets/js/app.js` renders everything from the data. `assets/css/styles.css` holds the design tokens and components.
- `images/projects/<id>.webp` is the screenshot for each project, a 16:9 crop of the report page, at least 900 px wide (up to 1600). Make it with `tools/crop_screenshot.py`.
- `data/nw_place_index.csv.gz` is **read by the NW Rainfall Watch Power BI report at refresh time**, via `raw.githubusercontent.com/hutchybakes-glitch/hutchybakes.github.io/main/data/...`. Don't move, rename or delete it.

## Adding a project (the usual task)
1. Add one entry to `projects` in `data/projects.js`, copying the template at the bottom. Add one screenshot. **Don't edit `index.html`, `app.js` or `styles.css` to add content.**
2. Write it from the project's real files (PBIP: pages, visuals, measures, Power Query sources), not generic filler. UK English. Use specific numbers.
3. `liveUrl` must be a **Publish to web** link (`https://app.powerbi.com/view?r=...`). A workspace link (`/groups/me/reports/...`) needs sign-in, so never use one. Use `""` for "coming soon".
4. Only one project has `featured: true`.
5. Check in a browser at 1440 px and 390 px wide (headless Edge has a minimum window width, so render the 390 px view inside an iframe), in light and dark mode, and with the case study open (`index.html#<id>`).

## Design rules
- One accent colour (`--accent`) and one warm highlight (`--warm`, used sparingly). Fraunces for display, Inter for text, JetBrains Mono for eyebrows and tags.
- Every colour comes from the tokens at the top of `styles.css`, with light and dark sets. Contrast is at least 4.5:1, and no text is smaller than 0.8rem.
- Screenshots are the hero content: 16:9, framed (`.shot.framed`), with a subtle lift on hover. Every image has meaningful alt text.
- Accessibility: semantic landmarks, a visible `:focus-visible` ring, a skip link, the `<dialog>` case study (Esc closes it and focus returns), and `prefers-reduced-motion` respected. External links open in a new tab, with a screen-reader note.
- No frameworks, trackers or build tools. Keep the page fast.
- Content is personal work on public data only. Never add employer or confidential data.
