# CLAUDE.md: rules for editing this portfolio

A static portfolio site for Sam Hutchinson, served by GitHub Pages from the repo root. Plain HTML/CSS/JS, with no build step and no dependencies apart from Google Fonts.

## Structure
- `data/projects.js` holds **all content**: `window.PORTFOLIO = { profile, topics }`. Each topic is a portal tile; a topic with `report` is live. It's plain JS, not JSON, so `index.html` also works from `file://`.
- `index.html` is a shell. `assets/js/app.js` is a small hash router with three views (intro `#/`, portal `#/portfolio`, report `#/portfolio/<topic-id>`) rendered from the data. `assets/css/styles.css` holds the design tokens and components.
- `images/projects/<id>.webp` is the screenshot for each project, a 16:9 crop of the report page, at least 900 px wide (up to 1600). Make it with `tools/crop_screenshot.py`.
- `data/nw_place_index.csv.gz` is **read by the NW Rainfall Watch Power BI report at refresh time**, via `raw.githubusercontent.com/hutchybakes-glitch/hutchybakes-glitch.github.io/main/data/...`. Don't move, rename or delete it.

## Adding a report (the usual task)
1. Add `report: { ... }` to the right topic in `data/projects.js`, copying the Rainfall one, and add its screenshots. **Don't edit `index.html`, `app.js` or `styles.css` to add content.**
2. Write it from the project's real files (PBIP: pages, visuals, measures, Power Query sources), not generic filler. UK English. Use specific numbers and honest, practical real-world uses.
3. `liveUrl` must be a **Publish to web** link (`https://app.powerbi.com/view?r=...`). A workspace link (`/groups/me/reports/...`) needs sign-in, so never use one.
4. Check every view in a browser at 1440 px and 390 px wide, in light and dark mode. Headless Edge has a minimum window width, so render the 390 px view inside an iframe.

## Design rules
- Near-black charcoal (light mode available), **Power BI yellow** (`--brand`) as the single brand accent, and one colour per topic (`colour`, exposed as `--c`). Avoid cream/serif or purple-gradient "AI template" looks.
- Bricolage Grotesque for display, IBM Plex Sans for text, IBM Plex Mono for labels.
- Every colour comes from the tokens at the top of `styles.css`. Contrast is at least 4.5:1, and no text is smaller than 0.78rem.
- The intro character is an illustration (inline SVG in `app.js`), not a likeness of a real person.
- Accessibility: semantic landmarks, a visible `:focus-visible` ring, a skip link, the `<dialog>` case study (Esc closes it and focus returns), and `prefers-reduced-motion` respected. External links open in a new tab, with a screen-reader note.
- No frameworks, trackers or build tools. Keep the page fast.
- Content is personal work on public data only. Never add employer or confidential data.
