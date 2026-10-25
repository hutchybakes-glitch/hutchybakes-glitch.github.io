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
    {
      id: "fuel-prices",
      title: "Fuel Prices",
      icon: "fuel",
      colour: "#F2994A",
      teaser: "Pump prices across the UK: where fuel is cheapest and how prices move.",
      report: {
        title: "UK Fuel Watch",
        date: "2026-10",
        summary: "Every forecourt in the UK on one live map, refreshed through the day: where fuel is cheapest near any town or postcode, which brands and regions charge most, what each fuel really costs per mile for a fleet vehicle, and how prices have moved since 2003.",
        liveUrl: "https://app.powerbi.com/view?r=eyJrIjoiMTQyYjJmMTItNmNmOS00MjI5LWE3ZDItNjk2MDdlODNjZWM2IiwidCI6ImJjOGIzMGJkLTlkMGUtNDZmNS1hNTI4LTE0NGVjZWRiODE2NyJ9",
        // Scheduled refresh times (UK time) set in the Power BI Service, about 50 minutes after each price snapshot
        refreshSchedule: ["07:30", "10:30", "13:30", "16:30", "19:30", "22:30"],
        pages: [
          { label: "UK today", src: "images/projects/uk-fuel-watch.webp", alt: "UK today page: a map of every UK forecourt coloured against the UK average with the cheapest and dearest called out, the 12 regions ranked, the UK average diesel price in large type with its change and how close it is to the record, and a chart of how all the prices are spread." },
          { label: "Find cheaper fuel", src: "images/projects/uk-fuel-watch-find.webp", alt: "Find cheaper fuel page for Manchester: a plain-English answer, five headline price tiles, a map with distance rings and the five cheapest stations numbered, and a ranked list of nearby stations." },
          { label: "Price league", src: "images/projects/uk-fuel-watch-league.webp", alt: "Price league page: brands ranked by average price with the spread of their prices, every station plotted by type of forecourt, and a grid of average prices by region and forecourt type." },
          { label: "Compare fuel types", src: "images/projects/uk-fuel-watch-compare.webp", alt: "Compare fuel types page: energy cost and greenhouse gas per mile for each fuel for a large van, with what-if inputs for depot electricity, Bio-CNG and the cost of switching." },
          { label: "Trends", src: "images/projects/uk-fuel-watch-trends.webp", alt: "Trends page: weekly UK petrol and diesel prices since 2003 with crude oil underneath and labelled events, a regional map, a rockets-and-feathers chart and what makes up a litre of diesel." },
        ],
        stats: [
          { value: "8,000+", label: "UK forecourts priced live" },
          { value: "6×", label: "price snapshots a day" },
          { value: "23 years", label: "of weekly prices and crude oil" },
          { value: "76k", label: "places and postcodes you can search" },
        ],
        features: [
          "A live map of every open UK forecourt, coloured by how far each price is above or below the UK average, with the cheapest and dearest called out and an inset for Orkney and Shetland. Hover a region to light up its stations.",
          "Type a town, postcode district or sector and get a plain-English answer (\"Cheapest diesel within 5 miles: 188.9p at Costco, Oldham, 4.2 miles\"), a map with distance rings, and a ranked list with 24-hour and AdBlue badges.",
          "Brands, forecourt types and regions compared on one shared colour scale: supermarkets average about 2.7p a litre below the UK average for diesel, motorway services about 18p above.",
          "Cost and CO2e per mile for petrol, diesel, HVO, LPG, Bio-CNG and EV charging by vehicle class, with what-if inputs and the break-even mileage for switching.",
          "Weekly UK prices since 2003 with crude oil, labelled events and each fuel's peak, plus a \"rockets and feathers\" chart: since 2003, falls in crude oil have reached the pump about 14% less than rises.",
          "A LIVE badge and freshness line on every page that turns into a STALE warning if the price snapshots stop.",
        ],
        uses: [
          { who: "Fleet managers", what: "Point drivers at the cheapest diesel near each depot or route stop, and see how much a 60-litre fill saves against the local average." },
          { who: "Fuel card managers", what: "Check whether the forecourts on a fuel card network are cheap or dear for their area, brand by brand and region by region." },
          { who: "Transport planners", what: "Choose refuelling points for regular routes, including 24-hour sites, AdBlue at the pump and where HVO is sold." },
          { who: "Finance and procurement", what: "Budget fuel spend with the current UK average, its four-week and yearly change, and how close prices are to the record." },
          { who: "Sustainability leads", what: "Compare the cost and CO2e per mile of moving vans or lorries to EV, HVO or Bio-CNG, with the break-even mileage." },
          { who: "Drivers and the public", what: "Find the cheapest fuel near a postcode in a few seconds, with the distance to each station." },
        ],
        usesNote: "Built on public data for planning and insight. Station prices are as reported to the government's Fuel Finder scheme; distances are straight-line, not driving distances.",
        pipeline: [
          { step: "Sources", detail: "Fuel Finder API, DESNZ weekly prices, GHG factors, HMRC, Ofgem, FRED, ONS places" },
          { step: "Snapshot", detail: "Python on a UK PC six times a day (Fuel Finder blocks non-UK servers), pushed to GitHub" },
          { step: "Power Query", detail: "Service-safe static URLs, gov.uk Content API for weekly files, quality flags" },
          { step: "Model", detail: "Stations, prices and history, a 76k-row place index, 91 documented DAX measures" },
          { step: "Visuals", detail: "Deneb / Vega maps and charts on one shared colour scale, generated from code" },
          { step: "Service", detail: "6 scheduled refreshes a day, published to the web" },
        ],
        techniques: [
          "A price snapshotter that runs where the API allows: Fuel Finder refuses non-UK servers, so a Windows scheduled task on a UK PC calls the OAuth2 API, checks every price (outliers and prices unchanged for 60 days are flagged) and pushes CSVs to GitHub. Power BI never sees the credentials.",
          "Search resolved once in DAX: a typed town or postcode becomes a place, its radius and its local average in one packed result, so the map, list and tiles agree.",
          "8,000 map points delivered as about 400 packed text rows and unpacked in Vega, which more than halved the page's load time in Desktop.",
          "One fixed-domain colour scale (pence against the average, blue to orange) shared by every map and list, with an Orkney and Shetland inset drawn in a second map projection.",
          "Pages generated from code (PBIP / PBIR), validated against Microsoft's schemas, rendered offline against real data, and headline numbers recomputed independently in Python.",
        ],
        tools: ["Power BI", "DAX", "Power Query (M)", "Deneb / Vega", "PBIP / TMDL", "REST APIs (OAuth2)", "Python", "GitHub"],
        dataSources: [
          { name: "Fuel Finder: statutory UK forecourt prices (DESNZ)", licence: "Open Government Licence", url: "https://www.developer.fuel-finder.service.gov.uk/" },
          { name: "DESNZ weekly road fuel prices", licence: "Open Government Licence", url: "https://www.gov.uk/government/statistics/weekly-road-fuel-prices" },
          { name: "DESNZ greenhouse gas conversion factors 2026", licence: "Open Government Licence", url: "https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting" },
          { name: "HMRC advisory fuel rates", licence: "Open Government Licence", url: "https://www.gov.uk/guidance/advisory-fuel-rates" },
          { name: "Ofgem energy price cap", licence: "Open Government Licence", url: "https://www.ofgem.gov.uk/energy-price-cap" },
          { name: "Zapmap Price Index (EV charging)", licence: "Cited with attribution", url: "https://www.zap-map.com/" },
          { name: "Brent crude (EIA) and USD/GBP via FRED", licence: "Public domain, cited", url: "https://fred.stlouisfed.org/series/DCOILBRENTEU" },
          { name: "ONS Postcode Directory and Index of Place Names", licence: "Open Government Licence", url: "https://geoportal.statistics.gov.uk/" },
        ],
      },
    },
    { id: "energy", title: "Energy", icon: "energy", colour: "#3DDC84", teaser: "Electricity generation and demand: the grid mix, hour by hour." },
    { id: "population-growth", title: "Population Growth", icon: "people", colour: "#C084FC", teaser: "How local populations are changing, and where growth is fastest." },
  ],
};
