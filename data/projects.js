/* =====================================================================================================
   PORTFOLIO CONTENT - the only file you edit to change what the site says.
   - profile: name, greeting and contact links (a link left as "" is hidden).
   - topics: the tiles on the portal page. A topic with a `report` is live and clickable; a topic without
     one shows "In the works". To publish a new report, fill in `report` on its topic (copy the Rainfall one)
     and add one screenshot to images/projects/. Full field list: README.md.
   Plain JavaScript (not JSON) so the page also works when opened straight from disk. Keep the quotes and
   commas as they are; a missing comma breaks the page (the browser console names the line).
   ===================================================================================================== */
window.PORTFOLIO = {
  profile: {
    name: "Sam Hutchinson",
    role: "Senior Analyst · Power BI",
    greeting: "Hi, my name is Sam Hutchinson. Please click the Power BI icon to view my project portfolio.",
    links: {
      linkedin: "",                          // e.g. "https://www.linkedin.com/in/your-name"
      github: "https://github.com/hutchybakes-glitch",
      email: "",                             // e.g. "you@example.com"
      cv: "",                                // e.g. "cv/Sam-Hutchinson-CV.pdf" (put the PDF in the cv folder)
    },
  },

  topics: [
    {
      id: "rainfall",                         // used in the link: #/portfolio/rainfall
      title: "Rainfall",
      icon: "rain",                           // rain | fuel | energy | people (drawn in assets/js/app.js)
      colour: "#4FA3FF",                      // the topic's accent colour
      teaser: "Live rain gauges and forecasts for any North West place or postcode.",
      report: {
        title: "NW Rainfall Watch",
        date: "2026-10",
        summary: "Type any North West town, village or postcode and see the rain that has fallen, the forecast hour by hour, and what is coming over the next few days, in plain English.",
        liveUrl: "https://app.powerbi.com/view?r=eyJrIjoiN2YxZjE4MzktYjkyNC00YWFmLWIyZjUtNTI1NDg3YTcxNmZkIiwidCI6ImJjOGIzMGJkLTlkMGUtNDZmNS1hNTI4LTE0NGVjZWRiODE2NyJ9",
        // Scheduled refresh times (UK time) set in the Power BI Service; the page shows the last and next update
        refreshSchedule: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
        pages: [
          { label: "Rain at a place", src: "images/projects/nw-rainfall-watch.webp", alt: "Report page for Manchester: a plain-English forecast summary, four headline rain totals, an hour-by-hour chart with chance of rain, day-by-day cards and a zoomed rain map." },
          { label: "Region overview", src: "images/projects/nw-rainfall-watch-region.webp", alt: "Region overview page: a smooth rain map of the North West, regional headline figures, an hourly chart for the region, an area comparison and the wettest places." },
        ],
        stats: [
          { value: "207k", label: "places and postcodes you can search" },
          { value: "200+", label: "live rain gauges blended in" },
          { value: "8×", label: "automatic refreshes a day" },
          { value: "< 1 s", label: "per visual, even from a cold cache" },
        ],
        features: [
          "Search any of 207,000 North West places and postcodes, with or without the space. Ambiguous names (there are several Newtons) become a pick list.",
          "A plain-English summary written by the model: \"Dry until about 22:00 today. Heaviest around 13:00 Saturday (4.6 mm in an hour).\"",
          "Rain so far from the nearest Environment Agency gauges, filled in by the weather model where no gauge reported. One honest series, with the source in the tooltip.",
          "Hour-by-hour forecast with the chance of rain, whole-day cards, and look-back / look-ahead pickers from 24 hours to 4 weeks.",
          "A zoomed rain map around the place, with the gauges actually used highlighted, plus a region page showing where the rain is heading.",
        ],
        uses: [
          { who: "Construction and site managers", what: "Plan concrete pours, roofing and earthworks around the next dry window, and check how much rain actually fell on site last week." },
          { who: "Water and drainage teams", what: "See where heavy rain is forecast across the region over the next three days and which areas have already had the most." },
          { who: "Events and outdoor hospitality", what: "Decide on marquees, covers and staffing with an hour-by-hour forecast and a clear chance of rain." },
          { who: "Farmers and land managers", what: "Time spraying, harvesting and field work, with measured rain from nearby gauges rather than a general forecast." },
          { who: "Insurers and claims handlers", what: "Check what rainfall was actually recorded near a postcode on a given day when a weather-related claim comes in." },
          { who: "Commuters and the public", what: "Answer \"will it rain on my walk home?\" for an exact postcode in a couple of seconds." },
        ],
        usesNote: "Built on public data for planning and insight; not a replacement for official Met Office or Environment Agency warnings.",
        pipeline: [
          { step: "Sources", detail: "Environment Agency gauges, Open-Meteo (Met Office model), ONS places" },
          { step: "Power Query", detail: "Batched API calls, retries, UTC to UK time with clock changes" },
          { step: "Model", detail: "Star schema, 207k-row place index, hourly facts" },
          { step: "DAX", detail: "Search resolution, distance blending, plain-English summary" },
          { step: "Visuals", detail: "17 Deneb / Vega visuals, smooth interpolated maps" },
          { step: "Service", detail: "8 scheduled refreshes a day, published to the web" },
        ],
        techniques: [
          "Cloud-refreshable Power Query: fixed base URLs with RelativePath/Query, multi-location API batching, and a retry-with-fallback helper for an API that sometimes serves cached 503 errors.",
          "Times stored in UTC and converted to UK time in M, including the night the clocks go back (25 local hours). \"Now\" is the refresh time, never the viewer's clock.",
          "Inverse-distance blending of the 4 nearest forecast points and up to 3 gauges within 15 km, with the weights worked out once per query for speed.",
          "One packed DAX result read by many measures (PATHITEM), so the search logic runs once per visual instead of once per measure.",
          "Pages generated from code (PBIP / PBIR), validated against Microsoft's schemas, and tuned with DAX query traces to under a second per visual.",
        ],
        tools: ["Power BI", "DAX", "Power Query (M)", "Deneb / Vega", "PBIP / TMDL", "REST APIs", "Python"],
        dataSources: [
          { name: "Environment Agency real-time flood-monitoring API (rainfall)", licence: "Open Government Licence", url: "https://environment.data.gov.uk/flood-monitoring/doc/rainfall" },
          { name: "Open-Meteo forecast API (Met Office UKMO model)", licence: "CC BY 4.0", url: "https://open-meteo.com/" },
          { name: "ONS Postcode Directory and Index of Place Names", licence: "Open Government Licence", url: "https://geoportal.statistics.gov.uk/" },
          { name: "ONS county and unitary authority boundaries", licence: "Open Government Licence", url: "https://geoportal.statistics.gov.uk/" },
        ],
      },
    },
    { id: "fuel-prices", title: "Fuel Prices", icon: "fuel", colour: "#F2994A", teaser: "Pump prices across the UK: where fuel is cheapest and how prices move." },
    { id: "energy", title: "Energy", icon: "energy", colour: "#3DDC84", teaser: "Electricity generation and demand: the grid mix, hour by hour." },
    { id: "population-growth", title: "Population Growth", icon: "people", colour: "#C084FC", teaser: "How local populations are changing, and where growth is fastest." },
  ],
};
