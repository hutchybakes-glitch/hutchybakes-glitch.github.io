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
      github: "https://github.com/swhutchinson",
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
    {
      id: "energy",
      title: "Energy",
      icon: "energy",
      colour: "#3DDC84",
      teaser: "When a battery should charge and use its power, what that saves, and whether one is worth buying.",
      report: {
        title: "GB Battery Watch",
        date: "2026-10",
        summary: "Every evening, a machine-learning forecast of tomorrow's electricity prices and an exact plan for when a battery should charge and when it should use its power. Every past day is settled at the real prices, so the report shows what each way of running a battery would have earned, how long one takes to pay for itself, and how much a good forecast is worth.",
        liveUrl: "https://app.powerbi.com/view?r=eyJrIjoiMTBmN2VhODYtM2MzMC00ZGVmLTllNTEtOGU3N2QxOGE1Y2RjIiwidCI6ImJjOGIzMGJkLTlkMGUtNDZmNS1hNTI4LTE0NGVjZWRiODE2NyJ9",
        // Scheduled refresh times (UK time) set in the Power BI Service, after the 06:15 and 17:20 UTC pipeline runs
        refreshSchedule: ["08:00", "19:30"],
        pages: [
          { label: "Tomorrow's plan", src: "images/projects/gb-battery-watch.webp", alt: "Tomorrow's plan page: the expected saving in large type, the charge and use-it times, a chart of the forecast price for each half-hour coloured by what the battery does, how full the battery is through the day, and how yesterday's plan did against the best possible." },
          { label: "Why prices move", src: "images/projects/gb-battery-watch-prices.webp", alt: "Why prices move page: a calendar of every half-hour of the last 12 months coloured from cheap blue to dear gold, with the daily price gap above and a typical day beside it, and a chart showing prices rise as wind and sun cover less of demand." },
          { label: "What it would have earned", src: "images/projects/gb-battery-watch-earned.webp", alt: "What it would have earned page: money made over the last 12 months by four ways of running the same battery, from a simple timer to the best possible, with a running total and money made each month." },
          { label: "Is it worth buying?", src: "images/projects/gb-battery-watch-payback.webp", alt: "Is it worth buying page: years to pay for itself in large type, cash over the battery's life crossing from minus the price into profit, the highest price worth paying, and a grid of payback years by battery type and installed price." },
          { label: "Where in GB", src: "images/projects/gb-battery-watch-regions.webp", alt: "Where in GB page: a tile map of the 14 regions shaded by yearly saving, and a ranked table with each region's tariff multiplier and evening extra charge." },
          { label: "Can I trust it?", src: "images/projects/gb-battery-watch-trust.webp", alt: "Can I trust it page: the forecast's average miss each month against a same-time-last-week guess, how the forecast and plan work, the assumptions to read with care, and where the data comes from." },
        ],
        stats: [
          { value: "64%", label: "of days the forecast beat a simple guess" },
          { value: "85%", label: "of the best possible saving captured by the plan" },
          { value: "2×", label: "a day: forecast, plan and refresh" },
          { value: "< 0.2 s", label: "per visual, even from a cold cache" },
        ],
        features: [
          "Tomorrow's plan in plain English: \"Charge 00:00–01:00, 22:30–00:00. Use it 16:00–16:30, 17:00–17:30, 18:00–19:00\", with the expected saving, the forecast price for every half-hour, how full the battery is and the extra grid CO₂.",
          "Pick a region, battery size (5 kWh home battery to 1 MWh site battery), how fast it charges and how efficient it is, and every page updates.",
          "Four ways of running the same battery settled at real prices over 12 months: a simple timer, last week's prices, our forecast and the best possible with hindsight. Planning on the forecast captured 85% of the best possible.",
          "A payback calculator: years to pay for itself, the highest installed price worth paying, and a grid of payback years by battery type and price.",
          "A 12-month calendar of every half-hour price, and a chart showing why prices move: when wind and sun covered most of demand, power averaged £65/MWh; when they covered least, £123.",
          "An honest test of the forecast on every day since January 2025, using only what was known at 17:15 the day before, plus a plain list of the assumptions.",
        ],
        uses: [
          { who: "Households with a battery or thinking of one", what: "See when to charge and when to use the stored power on a dynamic tariff, and how long a battery at a given price takes to pay back." },
          { who: "Businesses and site managers", what: "Size a battery from 50 kWh to 1 MWh, see the yearly saving and payback, and how much smarter planning adds over a timer." },
          { who: "Installers and sales teams", what: "Show customers a realistic payback by region and battery type, with the assumptions stated rather than hidden." },
          { who: "Energy and sustainability analysts", what: "Understand how wind, sun and demand drive half-hourly prices, and what shifting load is worth in pounds and CO₂." },
          { who: "Fleet and EV charging operators", what: "Use the same price forecast and plan logic to time charging into the cheapest hours." },
        ],
        usesNote: "Built on public data for planning and insight. Tariff prices are an estimate fitted to a typical dynamic tariff, not any supplier's prices; on a dynamic tariff, plan on your supplier's real prices once they are published.",
        pipeline: [
          { step: "Sources", detail: "Elexon BMRS prices and day-ahead wind, solar and demand forecasts; NESO carbon intensity" },
          { step: "Python", detail: "GitHub Actions twice a day: a LightGBM price forecast and a linear-programme optimiser" },
          { step: "Data branch", detail: "Results published as CSVs to a GitHub branch, read without a gateway" },
          { step: "Model", detail: "Half-hourly facts, daily results for 4 strategies × 14 regions × 3 types × 3 efficiencies, 71 DAX measures" },
          { step: "Visuals", detail: "14 Deneb / Vega visuals generated from code" },
          { step: "Service", detail: "2 scheduled refreshes a day, published to the web" },
        ],
        techniques: [
          "A forecast that can't cheat: a LightGBM model trained only on what Elexon had published by 17:15 the day before, backtested on every day since January 2025 against a same-time-last-week guess.",
          "An exact optimiser (a linear programme) plans each day's charging for every battery type and efficiency, and the same optimiser settles each past day at the real prices, so strategies are compared like for like.",
          "One pipeline, two products: the GitHub Actions job that feeds the GB Grid Live website also publishes this report's data to an orphan branch, which Power BI reads with static Web.Contents URLs, so it refreshes in the Service with no gateway.",
          "Expensive statistics (a regression slope and quartile averages over 17,500 half-hours) worked out once at refresh in a calculated table, taking the slowest visual from 1.4 s to 0.05 s.",
          "Pages generated from code (PBIP / PBIR), validated against Microsoft's schemas, and 17 headline numbers recomputed independently in Python to match the DAX.",
        ],
        tools: ["Power BI", "DAX", "Power Query (M)", "Deneb / Vega", "PBIP / TMDL", "Python", "LightGBM", "Linear programming", "GitHub Actions"],
        dataSources: [
          { name: "Elexon Insights (BMRS): market index prices, day-ahead wind and solar, national demand forecast", licence: "Elexon BMRS licence", url: "https://www.elexon.co.uk/bsc/data/balancing-mechanism-reporting-agent/copyright-licence-bmrs-data/" },
          { name: "NESO Carbon Intensity API", licence: "CC BY 4.0", url: "https://carbonintensity.org.uk/" },
        ],
      },
    },
    {
      id: "population-growth",
      title: "Population Growth",
      icon: "people",
      colour: "#C084FC",
      teaser: "How local populations are changing, and where growth is fastest.",
      report: {
        title: "UK Population Watch",
        date: "2026-10",
        summary: "How the UK's population has grown and shrunk, from the four nations down to 7,000 towns and villages: where it is growing fastest, whether births, deaths or people moving drove the change, and where official projections say it is heading, from 1851 to 2050.",
        liveUrl: "https://app.powerbi.com/view?r=eyJrIjoiMzhlZDJmYWEtNmJkYS00NTlmLTkzYjAtYWZkMzczODFiMmQyIiwidCI6ImJjOGIzMGJkLTlkMGUtNDZmNS1hNTI4LTE0NGVjZWRiODE2NyJ9",
        // Scheduled refresh time (UK time) set in the Power BI Service; the data changes once a year
        refreshSchedule: ["06:00"],
        pages: [
          { label: "UK now", src: "images/projects/uk-population-watch.webp", alt: "UK now page: 69.5 million people at mid-2025 in large type with the latest year's change of +227,665, a sparkline since 1991, the four nations ranked by growth, a map of every council coloured green for growing and red for shrinking with councils, counties and regions buttons and a play button, and the fastest-growing and fastest-shrinking councils." },
          { label: "Your place", src: "images/projects/uk-population-watch-place.webp", alt: "Your place page for Manchester: a search box and list of matches, a plain-English answer with six tiles, the population every year since 1991 with official projections dashed, and an age pyramid compared with 1991." },
          { label: "Why it changed", src: "images/projects/uk-population-watch-why.webp", alt: "Why it changed page for Manchester: births minus deaths, moves within the UK, moves to and from abroad and other changes as bars to the left or right of a centre line with a sentence for each, the same parts year by year, and every council plotted by births minus deaths against migration." },
          { label: "League tables", src: "images/projects/uk-population-watch-league.webp", alt: "League tables page: all 361 councils by growth per year as a strip, the top 15 and bottom 15, and a full table with growth-coloured cells." },
          { label: "The long view", src: "images/projects/uk-population-watch-long.webp", alt: "The long view page: the UK population from 1851 to 2050 with labelled events such as the world wars, the baby boom and EU enlargement, and the four nations since 1971." },
        ],
        stats: [
          { value: "69.5m", label: "people in the UK at mid-2025" },
          { value: "200 years", label: "from 1851 to projections for 2050" },
          { value: "7,455", label: "areas, from nations to villages" },
          { value: "76k", label: "towns, councils and postcodes you can search" },
        ],
        features: [
          "A map of every council, county or region coloured green for growing and red for shrinking, with a Play button that replays the change year by year, and the fastest-growing and fastest-shrinking areas beside it.",
          "Type a town, council or postcode and get a plain-English answer (\"Manchester had 588,256 people in mid-2025, 85,354 more than in mid-2011: growth of 1.13% a year, faster than the North West and the UK\"), its population line with official projections, and its age pyramid against 1991.",
          "Why it changed, in plain words: births minus deaths, moves within the UK and moves to and from abroad, each with a sentence that follows the numbers (\"More people moved away to other parts of the UK than moved here\"), year by year and for every council at once.",
          "League tables for any level, from nations to 7,058 towns and villages, ranked by growth, % change, people or density, with any start and end year from 1991 to 2050.",
          "Two centuries on one chart, with honest notes: before 1911 the ONS figure includes the whole of Ireland, and in both world wars troops abroad were not counted.",
          "Every council named with its county or region (\"Dartford (Kent)\", \"Salford (North West)\"), and one colour scale for growth shared by every map, chart and table.",
        ],
        uses: [
          { who: "Councils and planners", what: "See how fast their area is growing against its region and the UK, and whether births or migration are driving it." },
          { who: "Housing developers", what: "Find the towns and councils growing fastest, and where official projections expect growth to continue." },
          { who: "Retailers and site selectors", what: "Rank towns by growth and density when choosing where to open, using any start year from 1991." },
          { who: "NHS and school-place planners", what: "Compare an area's age pyramid with 1991 or 2001 to see an ageing population or a growing number of children." },
          { who: "Journalists", what: "Check a claim about local growth or migration in seconds, with the source and the caveats on the page." },
          { who: "Students and the public", what: "Look up their own town and see how it has changed and why." },
        ],
        usesNote: "Built on official public statistics for insight and planning. Projections show what happens if past trends continue; they are not forecasts.",
        pipeline: [
          { step: "Sources", detail: "Nomis (ONS, NRS and NISRA estimates and projections), NISRA PxStat, ONS boundaries and places" },
          { step: "Data repo", detail: "Python builds the area table and place index, and copies the ONS tables that Power BI is blocked from" },
          { step: "Power Query", detail: "Service-safe static URLs, paged API calls with a row-cap check, no gateway" },
          { step: "Model", detail: "120k population rows, 7,455 areas, a 76k-row place index, 116 documented DAX measures" },
          { step: "Visuals", detail: "Deneb / Vega maps and charts on one shared growth scale, generated from code" },
          { step: "Service", detail: "Daily scheduled refresh, published to the web" },
        ],
        techniques: [
          "Working around a blocked source: ons.gov.uk refuses Power BI's requests, so a Python script copies the ONS long-run and migration tables into a public GitHub repo, and the report reads them from there.",
          "Paged calls to the Nomis API, which silently stops at 25,000 rows: every query pages with an offset and fails loudly if a page comes back full.",
          "Search resolved once in DAX into one packed result, so the header, answer card, charts and age pyramid all show the same place, and a fast pattern (precomputed year columns behind thin wrapper measures) that cut the all-towns table from 8 seconds to 1.",
          "A map with councils, counties and regions in one Deneb visual: county and region shapes dissolved from council boundaries at build time, switched and animated in Vega.",
          "Pages generated from code (PBIP / PBIR), validated against Microsoft's schemas, rendered offline against real data, and 41 headline numbers recomputed independently in Python.",
        ],
        tools: ["Power BI", "DAX", "Power Query (M)", "Deneb / Vega", "PBIP / TMDL", "REST APIs", "Python", "GitHub"],
        dataSources: [
          { name: "ONS, NRS and NISRA mid-year population estimates (via Nomis)", licence: "Open Government Licence", url: "https://www.nomisweb.co.uk/" },
          { name: "ONS small-area estimates for built-up areas (via Nomis)", licence: "Open Government Licence", url: "https://www.nomisweb.co.uk/" },
          { name: "ONS components of change (births, deaths, migration)", licence: "Open Government Licence", url: "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates" },
          { name: "ONS long-run UK population series since 1851", licence: "Open Government Licence", url: "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates" },
          { name: "ONS sub-national and national population projections (via Nomis)", licence: "Open Government Licence", url: "https://www.nomisweb.co.uk/" },
          { name: "NISRA population projections (PxStat)", licence: "Open Government Licence", url: "https://data.nisra.gov.uk/" },
          { name: "ONS boundaries, built-up areas and Postcode Directory", licence: "Open Government Licence", url: "https://geoportal.statistics.gov.uk/" },
        ],
      },
    },
  ],
};
