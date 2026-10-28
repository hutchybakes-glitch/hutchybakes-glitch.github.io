# Sam Hutchinson · Data projects

My portfolio of personal data projects: Power BI reports (and later Python/Streamlit apps), built on public data and published so anyone can open them.

Live site: **https://swhutchinson.github.io/**

Plain HTML, CSS and JavaScript. There's no build step, so GitHub Pages serves the files as they are.

## Folder structure

```
index.html                  page layout (no content in here)
assets/css/styles.css       design: colours, type, spacing (tokens at the top)
assets/js/app.js            builds the page from the data file
data/projects.js            ALL the content: your profile, links and projects  <- edit this
data/nw_place_index.csv.gz  place/postcode index read by the NW Rainfall Watch report (public ONS data)
images/projects/            one screenshot per project (plus optional extras)
cv/                         put your CV PDF here (optional)
tools/crop_screenshot.py    crops a Power BI screenshot to the report page and saves a WebP
CLAUDE.md                   rules for Claude Code sessions that edit this site
```

## How the site works
Three screens, switched with links like `#/portfolio/rainfall`, so the browser's Back button works:
1. **Intro (`#/`):** an illustrated character with a speech bubble (`profile.greeting`) and a Power BI icon to click.
2. **Portal (`#/portfolio`):** one tile per topic. A topic with a `report` is live and clickable. A topic without one shows "In the works".
3. **Report page (`#/portfolio/<topic-id>`):** preview with page tabs, the live link, what it does, real-world uses, how it is built, and the data sources.

## Fill in your links (once)
Open `data/projects.js` and fill in `profile.links`: `linkedin`, `email` and `cv`, for example `"cv/Sam-Hutchinson-CV.pdf"` once the PDF is in `cv/`. Any link left as `""` is hidden.

## Adding a report
1. Save a screenshot of each report page in `images/projects/` (see below).
2. In `data/projects.js`, find the topic (for example `fuel-prices`) and add a `report: { ... }` block to it, copying the Rainfall one. To add a new topic, copy a whole topic entry and give it a new `id`, `title`, `icon` (`rain`, `fuel`, `energy` or `people`), `colour` and `teaser`.

| Report field | What to put |
|---|---|
| `title`, `date`, `summary` | Report name, year-month (`"2026-12"`), and one or two sentences |
| `liveUrl` | The **Publish to web** link (`https://app.powerbi.com/view?r=...`). Leave `""` to show "Live report coming soon" |
| `refreshSchedule` | Scheduled refresh times set in the Power BI Service, in UK time, e.g. `["06:00", "12:00"]`. The page shows the last and next update |
| `pages` | One entry per screenshot: `{ label: "Page name", src: "images/projects/x.webp", alt: "What it shows" }`. These become the tabs |
| `stats` | Four headline numbers: `{ value: "207k", label: "..." }` |
| `features` | What it does, one point per line |
| `uses` | Real-world uses: `{ who: "Who", what: "How they would use it" }` (plus an optional `usesNote`) |
| `pipeline` | How it is built, left to right: `{ step: "DAX", detail: "..." }` (six steps fit best) |
| `techniques` | Key techniques, one per line |
| `tools`, `dataSources` | Tags, and `{ name, licence, url }` for each source |

3. Open `index.html` in a browser to check it, then commit and push.

## Screenshots: how to take and size them

- In Power BI Desktop, open the page, collapse the side panes and choose **View → Fit to page**. Take a full-screen screenshot (Windows: **Win + Shift + S**, or **PrtScn**).
- Crop it to the report page and convert it to WebP:
  ```
  python tools/crop_screenshot.py screenshot.png images/projects/my-report.webp 071426 left,top,right,bottom
  ```
  - The hex colour is the page background.
  - The four numbers are the page's corners in the screenshot. Leave them out when the area around the page is a different colour from the page; the script then finds the page itself.
  - It needs `pip install pillow`.
- **Size:** a 16:9 crop at least 900 px wide, ideally 1600 px (the script never makes images bigger than 1600 px wide). Cards crop to 16:9 from the top-left, so keep the important content top-left.
- For a sharper image, capture with Desktop maximised on a larger monitor.

## Publishing to GitHub Pages

First time:
1. On GitHub (signed in as **swhutchinson**), create a **public** repository named exactly `swhutchinson.github.io`. Don't add a README.
2. In this folder:
   ```
   git remote add origin https://github.com/swhutchinson/swhutchinson.github.io.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages → Build and deployment**. Set **Source** to *Deploy from a branch*, **Branch** to `main` / `(root)`, then **Save**. After a minute or two the site is live at https://swhutchinson.github.io/.

Every update after that: `git add -A`, `git commit -m "Add <project>"`, `git push`. Pages republishes on its own.

## Public data only

Everything here is personal work on public data (Open Government Licence, CC BY). No employer data.
