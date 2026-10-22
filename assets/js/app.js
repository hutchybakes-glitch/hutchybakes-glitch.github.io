/* Renders the portfolio from window.PORTFOLIO (data/projects.js). Layout lives here and in styles.css;
   content lives only in the data file. No dependencies, no build step. */
(function () {
  'use strict';
  const data = window.PORTFOLIO;
  if (!data) { document.getElementById('grid').innerHTML = '<li>Could not load data/projects.js (check it for a missing comma).</li>'; return; }
  const { profile, projects } = data;
  const $ = id => document.getElementById(id);

  // Escape text for safe insertion into HTML
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const monthName = d => { const [y, m] = String(d || '').split('-'); return m ? new Date(+y, +m - 1, 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : (y || ''); };

  const ICONS = {
    linkedin: '<path d="M4 9h3v11H4zM5.5 4a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zM10 9h2.9v1.5h.04c.4-.76 1.4-1.6 2.9-1.6 3.1 0 3.66 2 3.66 4.7V20h-3v-5.6c0-1.3 0-3-1.85-3s-2.13 1.45-2.13 2.9V20H10z"/>',
    github: '<path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.65-.2.65-.46v-1.7c-2.65.58-3.2-1.13-3.2-1.13-.44-1.1-1.06-1.4-1.06-1.4-.87-.6.06-.58.06-.58.96.07 1.47.99 1.47.99.85 1.46 2.24 1.04 2.78.8.09-.62.33-1.04.6-1.28-2.11-.24-4.33-1.06-4.33-4.7 0-1.04.37-1.89.98-2.55-.1-.24-.42-1.21.09-2.53 0 0 .8-.26 2.62.97a9 9 0 0 1 4.76 0c1.82-1.23 2.62-.97 2.62-.97.51 1.32.19 2.29.1 2.53.6.66.97 1.51.97 2.55 0 3.65-2.22 4.45-4.34 4.69.34.29.65.87.65 1.76v2.6c0 .26.17.57.66.47A9.5 9.5 0 0 0 12 2.5z"/>',
    email: '<path d="M3 6h18v12H3z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m3.5 6.5 8.5 7 8.5-7" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    cv: '<path d="M6 3h8l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M14 3v4h4M9 12h6M9 16h6" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    arrow: '<path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  const icon = k => `<svg viewBox="0 0 24 24" aria-hidden="true" class="ic">${ICONS[k]}</svg>`;
  const LINK_LABELS = { linkedin: 'LinkedIn', github: 'GitHub', email: 'Email', cv: 'CV' };

  // ---------- profile ----------
  $('hero-role').textContent = profile.role;
  $('hero-name').textContent = profile.name;
  $('hero-positioning').textContent = profile.positioning;
  $('hero-intro').innerHTML = profile.intro.map(p => `<p>${esc(p)}</p>`).join('');
  $('footer-name').textContent = profile.name;
  const linkItems = Object.entries(profile.links).filter(([, v]) => v).map(([k, v]) => {
    const href = k === 'email' ? `mailto:${v}` : v;
    const ext = k === 'linkedin' || k === 'github';
    return `<li><a class="pill-link" href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${icon(k)}<span>${LINK_LABELS[k]}</span></a></li>`;
  }).join('');
  $('hero-links').innerHTML = linkItems;
  $('footer-links').innerHTML = linkItems;

  // ---------- shared bits ----------
  const tags = list => `<ul class="tags">${(list || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
  const liveButton = (p, big) => p.liveUrl
    ? `<a class="btn primary${big ? ' big' : ''}" href="${esc(p.liveUrl)}" target="_blank" rel="noopener">Open live report ${icon('arrow')}<span class="sr">(opens in a new tab)</span></a>`
    : `<span class="btn soon${big ? ' big' : ''}" aria-disabled="true">Live report coming soon</span>`;
  const detailButton = (p, big) => `<button class="btn ghost${big ? ' big' : ''}" type="button" data-detail="${esc(p.id)}">Read the case study</button>`;
  const shot = (p, cls, eager) => `<figure class="shot ${cls || ''}"><img src="${esc(p.image)}" alt="${esc(p.imageAlt)}" width="1600" height="894" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></figure>`;

  // ---------- featured ----------
  const featured = projects.find(p => p.featured) || projects[0];
  // Last and next scheduled refresh (UK time) from the project's refreshSchedule, e.g. ["06:00", "09:00"]
  const refreshStatus = p => {
    const times = (p.refreshSchedule || []).slice().sort();
    if (!times.length) return '';
    const now = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
    const past = times.filter(t => t <= now);
    const last = past.length ? past[past.length - 1] : times[times.length - 1];
    const next = times.find(t => t > now) || times[0];
    const every = times.length > 1 ? Math.round(24 / times.length) : 24;
    return `<p class="status"><span class="dot" aria-hidden="true"></span><span><strong>Live data</strong> · refreshes every ${every} hours · last scheduled update ${last}${past.length ? '' : ' yesterday'}, next ${next} (UK time)</span></p>`;
  };
  // "From API to answer" pipeline
  const pipeline = p => (p.pipeline && p.pipeline.length) ? `
    <ol class="pipeline" aria-label="How it is built">${p.pipeline.map((s, i) => `<li><span class="step-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><strong>${esc(s.step)}</strong><span>${esc(s.detail)}</span></li>`).join('')}</ol>` : '';
  // Screenshot in a browser-style frame, with tabs when the project has several pages
  const browser = p => {
    const pages = [{ label: p.imageLabel || 'Report', src: p.image, alt: p.imageAlt }, ...(p.gallery || []).map(g => ({ label: g.label || 'Page', src: g.src, alt: g.alt }))];
    return `
      <div class="browser">
        <div class="browser-bar">
          <span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
          ${pages.length > 1 ? `<div class="tabs" role="tablist" aria-label="Report pages">${pages.map((pg, i) => `<button type="button" role="tab" aria-selected="${i === 0}" aria-controls="pane-${esc(p.id)}" data-src="${esc(pg.src)}" data-alt="${esc(pg.alt)}">${esc(pg.label)}</button>`).join('')}</div>` : `<span class="browser-title">${esc(pages[0].label)}</span>`}
        </div>
        <figure class="shot" id="pane-${esc(p.id)}" role="tabpanel"><img src="${esc(pages[0].src)}" alt="${esc(pages[0].alt)}" width="1600" height="894" fetchpriority="high" decoding="async"></figure>
      </div>`;
  };
  document.addEventListener('click', e => {
    const tab = e.target.closest('.tabs [role="tab"]'); if (!tab) return;
    const frame = tab.closest('.browser');
    frame.querySelectorAll('[role="tab"]').forEach(b => b.setAttribute('aria-selected', b === tab));
    const img = frame.querySelector('img'); img.src = tab.dataset.src; img.alt = tab.dataset.alt;
  });

  if (featured) {
    $('featured').innerHTML = `
      <div class="featured-card">
        <div class="featured-media">${browser(featured)}</div>
        <div class="featured-text">
          <p class="eyebrow">Featured · ${esc(featured.type)} · ${esc(monthName(featured.date))}</p>
          <h2>${esc(featured.title)}</h2>
          <p class="lede">${esc(featured.summary)}</p>
          ${refreshStatus(featured)}
          ${featured.stats && featured.stats.length ? `<dl class="stats">${featured.stats.map(s => `<div><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join('')}</dl>` : ''}
          <div class="actions">${liveButton(featured, true)}${detailButton(featured, true)}</div>
        </div>
        ${featured.pipeline && featured.pipeline.length ? `<div class="featured-pipeline"><p class="eyebrow">From API to answer</p>${pipeline(featured)}</div>` : ''}
      </div>`;
  }

  // ---------- live panel: current rain at a few places, straight from Open-Meteo in the browser ----------
  const live = profile.live;
  if (live && live.places && live.places.length) {
    const box = $('live');
    const describe = (mm, code) => mm > 0 ? (code >= 80 ? 'Showers' : code >= 51 && code <= 57 ? 'Drizzle' : 'Rain') : code >= 45 && code <= 48 ? 'Fog' : code === 0 ? 'Clear' : code <= 2 ? 'Bright spells' : 'Cloudy';
    box.innerHTML = `<p class="eyebrow"><span class="dot" aria-hidden="true"></span>Live</p><h2 id="live-title">${esc(live.title)}</h2><p class="live-sub">Fetching current conditions…</p>`;
    const q = new URLSearchParams({ latitude: live.places.map(p => p.lat).join(','), longitude: live.places.map(p => p.lon).join(','), current: 'precipitation,temperature_2m,weather_code', timezone: 'Europe/London' });
    fetch(`https://api.open-meteo.com/v1/forecast?${q}`).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(json => {
      const rows = (Array.isArray(json) ? json : [json]).map((d, i) => ({ name: live.places[i].name, mm: d.current.precipitation, t: d.current.temperature_2m, code: d.current.weather_code, time: d.current.time }));
      const wet = rows.filter(r => r.mm > 0).length;
      const at = rows[0] && rows[0].time ? rows[0].time.slice(11, 16) : '';
      box.innerHTML = `
        <p class="eyebrow"><span class="dot" aria-hidden="true"></span>Live · ${esc(at)} UK time</p>
        <h2 id="live-title">${esc(live.title)}</h2>
        <p class="live-sub">${wet ? `Rain falling in <strong>${wet} of ${rows.length}</strong> places` : `Dry in all ${rows.length} places`}</p>
        <ul class="live-list">${rows.map(r => `
          <li class="${r.mm > 0 ? 'wet' : ''}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C12 3 5 11 5 15a7 7 0 0 0 14 0C19 11 12 3 12 3Z"/></svg>
            <span class="place">${esc(r.name)}</span>
            <span class="cond">${esc(describe(r.mm, r.code))}${r.mm > 0 ? ` · ${r.mm.toFixed(1)} mm` : ''}</span>
            <span class="temp">${Math.round(r.t)}°</span>
          </li>`).join('')}</ul>
        <p class="live-note">Fetched in your browser just now, from the same forecast service the report uses. Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo.com</a>.</p>`;
    }).catch(() => {
      box.innerHTML = `<p class="eyebrow">Live</p><h2 id="live-title">${esc(live.title)}</h2><p class="live-sub">Live conditions are unavailable right now. The report itself refreshes on a schedule.</p>`;
    });
  }

  // ---------- grid ----------
  const others = projects.filter(p => p !== featured);
  const card = p => `
    <li class="card" data-type="${esc(p.type)}">
      <button class="card-media" type="button" data-detail="${esc(p.id)}" aria-label="Read the case study: ${esc(p.title)}">${shot(p)}</button>
      <div class="card-body">
        <p class="eyebrow">${esc(p.type)} · ${esc(monthName(p.date))}</p>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.summary)}</p>
        ${tags(p.tools)}
        <div class="actions">${liveButton(p)}${detailButton(p)}</div>
      </div>
    </li>`;
  const placeholder = `<li class="card placeholder"><div><p class="eyebrow">Next up</p><h3>More projects on the way</h3><p>I add each report here when it is finished. Power BI first, with Python and Streamlit apps to follow.</p></div></li>`;
  const renderGrid = type => {
    const list = others.filter(p => !type || p.type === type);
    $('grid').innerHTML = list.map(card).join('') + (type ? '' : placeholder);
  };
  renderGrid('');
  const types = [...new Set(projects.map(p => p.type))];
  if (types.length > 1) {
    const f = $('filters');
    f.hidden = false;
    f.innerHTML = ['All', ...types].map((t, i) => `<button type="button" class="chip" aria-pressed="${i === 0}" data-type="${i ? esc(t) : ''}">${esc(t)}</button>`).join('');
    f.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      f.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
      renderGrid(b.dataset.type);
    });
  }

  // ---------- toolkit (from the projects plus core skills, most used first) ----------
  const counts = {};
  projects.forEach(p => (p.tools || []).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
  (profile.coreSkills || []).forEach(t => { counts[t] = counts[t] || 0.5; });
  $('tools').innerHTML = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b)).map(t => `<li>${esc(t)}</li>`).join('');

  // ---------- case study dialog ----------
  const dialog = $('detail');
  let lastFocus = null;
  const openDetail = id => {
    const p = projects.find(x => x.id === id); if (!p) return;
    const images = [{ src: p.image, alt: p.imageAlt }, ...(p.gallery || [])];
    $('detail-body').innerHTML = `
      <div class="detail-head">
        <div>
          <p class="eyebrow">${esc(p.type)} · ${esc(monthName(p.date))}</p>
          <h2 id="detail-title">${esc(p.title)}</h2>
        </div>
        <button class="close" type="button" aria-label="Close case study">&times;</button>
      </div>
      <p class="lede">${esc(p.summary)}</p>
      <div class="actions">${liveButton(p)}${p.sourceUrl ? `<a class="btn ghost" href="${esc(p.sourceUrl)}" target="_blank" rel="noopener">Source code ${icon('arrow')}<span class="sr">(opens in a new tab)</span></a>` : ''}</div>
      <div class="gallery">${images.map(im => `<figure class="shot framed"><img src="${esc(im.src)}" alt="${esc(im.alt)}" width="1600" height="894" loading="lazy" decoding="async"></figure>`).join('')}</div>
      ${refreshStatus(p)}
      ${p.problem ? `<h3>The problem</h3><p>${esc(p.problem)}</p>` : ''}
      ${p.pipeline && p.pipeline.length ? `<h3>How it is built</h3>${pipeline(p)}` : ''}
      ${p.built && p.built.length ? `<h3>What I built</h3><ul class="points">${p.built.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
      ${p.techniques && p.techniques.length ? `<h3>Key techniques</h3><ul class="points">${p.techniques.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
      <div class="detail-cols">
        <div><h3>Tools</h3>${tags(p.tools)}</div>
        ${p.dataSources && p.dataSources.length ? `<div><h3>Data sources</h3><ul class="sources">${p.dataSources.map(s => `<li>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>` : esc(s.name)}${s.licence ? `<span>${esc(s.licence)}</span>` : ''}</li>`).join('')}</ul></div>` : ''}
      </div>`;
    lastFocus = document.activeElement;
    dialog.showModal();
    dialog.querySelector('.close').focus();
    if (location.hash !== `#${p.id}`) history.replaceState(null, '', `#${p.id}`);
  };
  const closeDetail = () => { dialog.close(); };
  dialog.addEventListener('close', () => { history.replaceState(null, '', location.pathname + location.search); if (lastFocus) lastFocus.focus(); });
  dialog.addEventListener('click', e => { if (e.target === dialog || e.target.closest('.close')) closeDetail(); });
  document.addEventListener('click', e => { const b = e.target.closest('[data-detail]'); if (b) openDetail(b.dataset.detail); });
  // Deep link: index.html#nw-rainfall-watch opens that case study
  const fromHash = location.hash.slice(1);
  if (fromHash && projects.some(p => p.id === fromHash)) openDetail(fromHash);

  // ---------- theme toggle ----------
  document.querySelector('.theme-toggle').addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();
