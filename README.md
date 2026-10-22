# Sam Hutchinson · Data projects

My portfolio of personal data projects: Power BI reports (and later Python/Streamlit apps), built on public data and published so anyone can open them.

Live site: **https://hutchybakes-glitch.github.io/**

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

## Fill in your links (once)

Open `data/projects.js` and fill in `profile.links`: `linkedin`, `email` and `cv`, for example `"cv/Sam-Hutchinson-CV.pdf"` once the PDF is in `cv/`. Any link left as `""` is hidden.

## Adding a project

1. **Take a screenshot** (see below) and save it as `images/projects/<project-id>.webp`.
2. **Open `data/projects.js`.** Copy the template block at the bottom of the `projects` list, paste it above the template, remove the `/*` and `*/` around your copy, and fill it in:

| Field | Required | What to put |
|---|---|---|
| `id` | yes | Short, unique, lower case with dashes, e.g. `"energy-prices"`. Also the deep link: `#energy-prices` opens its case study |
| `title` | yes | Project name |
| `type` | yes | `"Power BI report"`, `"Python app"`, `"Tool"`... When there are two or more types, filter buttons appear automatically |
| `date` | yes | Year-month finished, `"2026-12"` |
| `featured` | no | `true` gives it the large slot at the top (only one project should be featured) |
| `summary` | yes | One sentence for the card |
| `image`, `imageAlt` | yes | Screenshot path, and one sentence describing what it shows (for screen readers) |
| `gallery` | no | Extra screenshots for the case study: `[{ src: "...", alt: "..." }]` |
| `liveUrl` | no | The **Publish to web** link (`https://app.powerbi.com/view?r=...`). Leave `""` to show "Live report coming soon" |
| `sourceUrl` | no | A GitHub repo, if there is one |
| `stats` | no | Up to 4 headline numbers for the featured slot: `{ value: "207k", label: "searchable places" }` |
| `problem` | no | The problem it solves (2–3 sentences) |
| `built` | no | What you built, one bullet per line |
| `techniques` | no | Key techniques (DAX patterns, modelling, APIs) |
| `tools` | yes | Tags such as `["Power BI", "DAX"]`. These also feed the Toolkit strip |
| `dataSources` | no | `[{ name: "...", licence: "...", url: "..." }]` |

3. **Check the page.** Open `index.html` in a browser (it works straight from disk), then commit and push (see below).

Keep the commas: every `{ ... }` in a list ends with `},`. If the page shows "Could not load data/projects.js", open the browser console (F12), which names the broken line.

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
1. On GitHub (signed in as **hutchybakes-glitch**), create a **public** repository named exactly `hutchybakes-glitch.github.io`. Don't add a README.
2. In this folder:
   ```
   git remote add origin https://github.com/hutchybakes-glitch/hutchybakes-glitch.github.io.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages → Build and deployment**. Set **Source** to *Deploy from a branch*, **Branch** to `main` / `(root)`, then **Save**. After a minute or two the site is live at https://hutchybakes-glitch.github.io/.

Every update after that: `git add -A`, `git commit -m "Add <project>"`, `git push`. Pages republishes on its own.

## Public data only

Everything here is personal work on public data (Open Government Licence, CC BY). No employer data.
