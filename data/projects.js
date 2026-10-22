/* =====================================================================================================
   PORTFOLIO CONTENT - the only file you edit to change what the site says.
   - profile: your name, intro and links (leave a link as "" to hide its button).
   - projects: one entry per project, newest first. Copy an existing entry, change the values, add one
     screenshot to images/projects/ and you are done. Full field list: README.md -> "Adding a project".
   Plain JavaScript (not JSON) so the page also works when opened straight from disk. Keep the quotes and
   commas as they are; a missing comma breaks the page (the browser console names the line).
   ===================================================================================================== */
window.PORTFOLIO = {
  profile: {
    name: "Sam Hutchinson",
    role: "Senior Analyst · Power BI, Python and data engineering",
    positioning: "I turn messy, live data into reports people can actually use.",
    intro: [
      "I design and build Power BI reports end to end: the data pipeline, the semantic model, the DAX and the visual design.",
      "These are personal projects built on public data, published so you can open and use them, not just look at screenshots.",
    ],
    links: {
      linkedin: "",                          // e.g. "https://www.linkedin.com/in/your-name"
      github: "https://github.com/hutchybakes",
      email: "",                             // e.g. "you@example.com" (shown as a mailto link)
      cv: "",                                // e.g. "cv/Sam-Hutchinson-CV.pdf" (put the PDF in the cv folder)
    },
    // Extra skills to show in the toolkit strip, alongside the tools listed on projects
    coreSkills: ["Data modelling", "DAX", "Power Query (M)", "Python", "SQL", "Data visualisation", "REST APIs"],
  },

  projects: [
    {
      id: "nw-rainfall-watch",                    // short, unique, lower-case-with-dashes
      title: "NW Rainfall Watch",
      type: "Power BI report",                    // e.g. "Power BI report", "Python app", "Tool"
      date: "2026-10",                            // year-month finished
      featured: true,                             // the featured project gets the large slot at the top
      summary: "Type any North West place or postcode and see the rain that has fallen, the forecast hour by hour, and what is coming over the next few days.",
      image: "images/projects/nw-rainfall-watch.webp",
      imageAlt: "NW Rainfall Watch report page for Manchester: a plain-English forecast summary, four headline rain totals, an hour-by-hour chart with chance of rain, day-by-day cards and a zoomed rain map.",
      gallery: [
        { src: "images/projects/nw-rainfall-watch-region.webp", alt: "Region overview page: a smooth rain map of the North West, regional headline figures, an hourly chart for the region, an area comparison and the wettest places." },
      ],
      liveUrl: "",                                // paste the Publish to web link here: https://app.powerbi.com/view?r=...
      sourceUrl: "",                              // optional: a GitHub repo for the project
      stats: [
        { value: "207k", label: "searchable places and postcodes" },
        { value: "200+", label: "live rain gauges blended" },
        { value: "280", label: "forecast points, 8 km apart" },
        { value: "< 1 s", label: "per visual, from a cold cache" },
      ],
      problem: "Rain data for a specific place is scattered: gauges report in 15-minute batches from one government API, the forecast lives in another, and neither knows what a postcode is. I wanted one page where anyone can type a town or postcode and get a clear answer: how much has fallen, when the next rain arrives, how heavy, and how sure.",
      built: [
        "A search box over 207,000 North West places, postcode districts and full postcodes (with or without the space). One DAX measure resolves the search: exact matches first, nearby duplicates grouped, ambiguous names offered as a pick list.",
        "Live Environment Agency rain gauges (15-minute readings) blended with the Met Office forecast model, weighted by distance to the searched place. Past hours use the gauges where they reported and the model where they did not, shown as one series with the source in the tooltip.",
        "A plain-English summary written by DAX (\"Dry until about 22:00 today. Heaviest around 13:00 Saturday\"), headline tiles, an hourly chart with chance of rain, whole-day cards and look-back / look-ahead pickers.",
        "Smooth, zoomed rain maps drawn with Deneb (Vega 6): the 8 km forecast grid is interpolated onto a fine lattice and clipped to the coastline, with non-overlapping town labels and the gauges used for the place highlighted.",
        "A region page with averages, the wettest places and an area comparison, and a sources page with data freshness and full attribution.",
      ],
      techniques: [
        "Cloud-refreshable Power Query: fixed base URLs with RelativePath/Query, multi-location API batching, and a retry-with-fallback helper for an API that intermittently serves cached 503 errors",
        "UTC storage with UK clock-change handling in M (25 local hours on the night the clocks go back); \"now\" is the refresh time, never the viewer's clock",
        "Inverse-distance blending of the 4 nearest grid points and up to 3 gauges within 15 km, with weights worked out once per query for speed",
        "One packed DAX result read by many measures (PATHITEM), so the search logic runs once per visual",
        "17 Deneb/Vega visuals with responsive design units, empty states and field-map diagnostics; pages generated from code (PBIP/PBIR) and validated against Microsoft's schemas",
        "Performance tuned with DAX query traces: every visual under about 1 second from a cold cache",
      ],
      tools: ["Power BI", "DAX", "Power Query (M)", "Deneb / Vega", "PBIP / TMDL", "Python", "Node.js"],
      dataSources: [
        { name: "Environment Agency real-time flood-monitoring API (rainfall)", licence: "Open Government Licence", url: "https://environment.data.gov.uk/flood-monitoring/doc/rainfall" },
        { name: "Open-Meteo forecast API (Met Office UKMO model)", licence: "CC BY 4.0", url: "https://open-meteo.com/" },
        { name: "ONS Postcode Directory and Index of Place Names", licence: "Open Government Licence", url: "https://geoportal.statistics.gov.uk/" },
        { name: "ONS county and unitary authority boundaries", licence: "Open Government Licence", url: "https://geoportal.statistics.gov.uk/" },
      ],
    },

    /* ----- Copy this block to add a project (remove the slash-star and star-slash around it) -----
    {
      id: "my-next-report",
      title: "My next report",
      type: "Power BI report",
      date: "2026-12",
      featured: false,
      summary: "One sentence on what it does and who it is for.",
      image: "images/projects/my-next-report.webp",
      imageAlt: "What the screenshot shows, in one sentence.",
      gallery: [],
      liveUrl: "",
      sourceUrl: "",
      stats: [],
      problem: "The problem it solves, in two or three sentences.",
      built: ["What you built, one point per line."],
      techniques: ["Key techniques: DAX patterns, modelling, APIs."],
      tools: ["Power BI", "DAX"],
      dataSources: [{ name: "Source name", licence: "Licence", url: "" }],
    },
    ----- end of template ----- */
  ],
};
