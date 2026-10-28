/* Three-screen portfolio, rendered from window.PORTFOLIO (data/projects.js). Content lives only in the data file.
   Routes (hash-based, so the browser Back button and shared links work):
     #/                      intro: character + speech bubble + Power BI icon
     #/portfolio             portal: topic tiles
     #/portfolio/<topic-id>  report page for a topic
   No dependencies, no build step. */
(function () {
  'use strict';
  const data = window.PORTFOLIO;
  const app = document.getElementById('app');
  if (!data) { app.innerHTML = '<p class="wrap">Could not load data/projects.js (check it for a missing comma).</p>'; return; }
  const { profile, topics } = data;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const monthName = d => { const [y, m] = String(d || '').split('-'); return m ? new Date(+y, +m - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : (y || ''); };

  // ---------- icons ----------
  const ICONS = {
    rain: '<path d="M7 15a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 8.5 3.5 3.5 0 0 1 17.5 15Z"/><path d="M8 18l-1 2.5M12 18l-1 2.5M16 18l-1 2.5" stroke-linecap="round"/>',
    fuel: '<path d="M5 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M4 20h12M7 8h6"/><path d="M15 9h1.5a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 3 0V8.5L18 6" stroke-linecap="round"/>',
    energy: '<path d="M13 2 5 13h6l-1 9 8-11h-6l1-9Z" stroke-linejoin="round"/>',
    people: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.2A5 5 0 0 1 21 19"/>',
    arrow: '<path d="M7 17 17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round"/>',
    back: '<path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/>',
    home: '<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z" stroke-linejoin="round"/>',
    linkedin: '<path d="M4 9h3v11H4zM5.5 4a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zM10 9h2.9v1.5h.04c.4-.76 1.4-1.6 2.9-1.6 3.1 0 3.66 2 3.66 4.7V20h-3v-5.6c0-1.3 0-3-1.85-3s-2.13 1.45-2.13 2.9V20H10z" fill="currentColor" stroke="none"/>',
    github: '<path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.65-.2.65-.46v-1.7c-2.65.58-3.2-1.13-3.2-1.13-.44-1.1-1.06-1.4-1.06-1.4-.87-.6.06-.58.06-.58.96.07 1.47.99 1.47.99.85 1.46 2.24 1.04 2.78.8.09-.62.33-1.04.6-1.28-2.11-.24-4.33-1.06-4.33-4.7 0-1.04.37-1.89.98-2.55-.1-.24-.42-1.21.09-2.53 0 0 .8-.26 2.62.97a9 9 0 0 1 4.76 0c1.82-1.23 2.62-.97 2.62-.97.51 1.32.19 2.29.1 2.53.6.66.97 1.51.97 2.55 0 3.65-2.22 4.45-4.34 4.69.34.29.65.87.65 1.76v2.6c0 .26.17.57.66.47A9.5 9.5 0 0 0 12 2.5z" fill="currentColor" stroke="none"/>',
    email: '<path d="M3 6h18v12H3z"/><path d="m3.5 6.5 8.5 7 8.5-7"/>',
    cv: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  };
  const icon = (k, cls = 'ic') => `<svg viewBox="0 0 24 24" class="${cls}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8">${ICONS[k] || ''}</svg>`;
  // The Power BI-style mark: three rising bars
  const pbiMark = `<svg viewBox="0 0 64 64" aria-hidden="true" class="pbi-mark"><rect x="12" y="30" width="11" height="24" rx="3.5" fill="#C8930A"/><rect x="26.5" y="19" width="11" height="35" rx="3.5" fill="#E8B10D"/><rect x="41" y="9" width="11" height="45" rx="3.5" fill="#F2C811"/></svg>`;

  // ---------- footer links ----------
  const LABELS = { linkedin: 'LinkedIn', github: 'GitHub', email: 'Email', cv: 'CV' };
  document.getElementById('footer-links').innerHTML = Object.entries(profile.links).filter(([, v]) => v).map(([k, v]) =>
    `<li><a href="${esc(k === 'email' ? 'mailto:' + v : v)}"${k === 'email' || k === 'cv' ? '' : ' target="_blank" rel="noopener"'}>${icon(k)}<span>${LABELS[k]}</span></a></li>`).join('');

  // ---------- shared bits ----------
  const refreshStatus = r => {
    const times = (r.refreshSchedule || []).slice().sort();
    if (!times.length) return '';
    const now = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
    const past = times.filter(t => t <= now);
    const last = past.length ? past[past.length - 1] : times[times.length - 1];
    const next = times.find(t => t > now) || times[0];
    return `<p class="status"><span class="dot" aria-hidden="true"></span><span><strong>Live data</strong> · refreshes ${times.length === 1 ? 'once' : times.length + ' times'} a day · last scheduled update ${last}${past.length ? '' : ' yesterday'}, next ${next} (UK time)</span></p>`;
  };
  const liveButton = (r, cls = '') => r.liveUrl
    ? `<a class="btn primary ${cls}" href="${esc(r.liveUrl)}" target="_blank" rel="noopener">Open the live report ${icon('arrow')}<span class="sr">(opens in a new tab)</span></a>`
    : `<span class="btn soon ${cls}" aria-disabled="true">Live report coming soon</span>`;
  // Link to the report's source on GitHub (the Power BI Project files), when the topic has one
  const codeButton = (r, cls = '') => r.codeUrl
    ? `<a class="btn ghost ${cls}" href="${esc(r.codeUrl)}" target="_blank" rel="noopener">${icon('github')} View the code<span class="sr">(GitHub, opens in a new tab)</span></a>`
    : '';
  const browser = (r, id) => `
    <div class="browser">
      <div class="browser-bar">
        <span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
        <div class="tabs" role="tablist" aria-label="Report pages">${r.pages.map((p, i) => `<button type="button" role="tab" id="tab-${id}-${i}" aria-selected="${i === 0}" aria-controls="pane-${id}" data-src="${esc(p.src)}" data-alt="${esc(p.alt)}">${esc(p.label)}</button>`).join('')}</div>
      </div>
      <figure class="shot" id="pane-${id}" role="tabpanel" aria-labelledby="tab-${id}-0"><img src="${esc(r.pages[0].src)}" alt="${esc(r.pages[0].alt)}" width="1600" height="894" decoding="async"><span class="shot-loading" role="status"><span class="spinner" aria-hidden="true"></span><span class="shot-loading-text">Loading page…</span></span></figure>
    </div>`;

  // ---------- the character (an illustration, not a likeness) ----------
  const character = `
    <svg class="character" viewBox="0 0 220 250" role="img" aria-label="An illustrated man in a suit with glasses and a moustache, waving hello">
      <ellipse cx="110" cy="246" rx="80" ry="5" class="c-shadow"/>
      <path class="c-suit" d="M58 174c0-10 18-16 34-17h36c16 1 34 7 34 17l-9 76H67Z"/>
      <path class="c-shirt" d="M90 158h40l-20 58Z"/>
      <path class="c-lapel" d="M90 158l20 58-28-26 8-8-12-10Z"/>
      <path class="c-lapel" d="M130 158l-20 58 28-26-8-8 12-10Z"/>
      <path class="c-tie" d="M104 160h12l-2 9h-8Z"/>
      <path class="c-tie" d="M106 169h8l5 32-9 11-9-11Z"/>
      <path class="c-sleeve" d="M58 174c-14 6-20 24-20 44v14h18v-14c0-10 2-20 6-26Z"/>
      <rect class="c-cuff" x="38" y="228" width="18" height="6" rx="2"/>
      <circle class="c-skin" cx="47" cy="241" r="9"/>
      <g class="c-arm-wave">
        <path class="c-sleeve" d="M160 172c12-6 22-16 26-34l4-30h-16l-3 26c-2 12-8 20-17 24Z"/>
        <rect class="c-cuff" x="173" y="102" width="18" height="7" rx="2"/>
        <circle class="c-skin" cx="182" cy="92" r="11"/>
      </g>
      <rect class="c-skin" x="100" y="128" width="20" height="32" rx="8"/>
      <circle class="c-skin" cx="70" cy="100" r="8"/><circle class="c-skin" cx="150" cy="100" r="8"/>
      <ellipse class="c-skin" cx="110" cy="94" rx="40" ry="44"/>
      <path class="c-hair" d="M70 96c-6-34 14-54 40-54 28 0 48 20 40 54-4-14-12-24-24-28-14-5-30-4-42 4-7 5-12 13-14 24Z"/>
      <path class="c-part" d="M90 46c-4 8-6 16-6 24"/>
      <path class="c-comb" d="M98 52c16-4 32 0 42 10M96 60c16-4 30 0 40 10"/>
      <path class="c-brow" d="M86 84h15M119 84h15"/>
      <circle class="c-glasses" cx="94" cy="98" r="12"/><circle class="c-glasses" cx="126" cy="98" r="12"/><path class="c-glasses-bridge" d="M106 97h8M82 96l-11-3M138 96l11-3"/>
      <circle class="c-eye" cx="94" cy="99" r="3"/><circle class="c-eye" cx="126" cy="99" r="3"/>
      <path class="c-tache" d="M95 118c5-6 11-5 15-1 4-4 10-5 15 1-6 5-11 4-15 1-4 3-9 4-15-1Z"/>
      <path class="c-smile" d="M102 127q8 5 16 0"/>
    </svg>`;

  // ---------- views ----------
  const views = {
    intro() {
      document.title = `${profile.name} · Power BI portfolio`;
      return `
        <section class="intro" aria-labelledby="intro-title">
          <div class="intro-stage">
            <div class="speech" id="speech">
              <p class="sr">${esc(profile.greeting)}</p>
              <p class="typed" aria-hidden="true"><span id="typed"></span><span class="caret"></span></p>
            </div>
            ${character}
          </div>
          <h1 id="intro-title" class="intro-name">${esc(profile.name)}<span>${esc(profile.role)}</span></h1>
          <a class="pbi-button" href="#/portfolio" aria-label="Open the Power BI project portfolio">
            <span class="pbi-tile">${pbiMark}</span>
            <span class="pbi-label">Open portfolio</span>
          </a>
        </section>`;
    },
    portal() {
      document.title = `Portfolio · ${profile.name}`;
      const tile = t => {
        const live = !!t.report;
        const inner = `
          <span class="tile-icon" style="--c:${esc(t.colour)}">${icon(t.icon)}</span>
          <span class="tile-text">
            <span class="tile-status ${live ? 'is-live' : ''}">${live ? '<span class="dot" aria-hidden="true"></span>Live report' : 'In the works'}</span>
            <span class="tile-title">${esc(t.title)}</span>
            <span class="tile-teaser">${esc(t.teaser)}</span>
            ${live ? `<span class="tile-cta">Explore ${esc(t.report.title)} ${icon('arrow')}</span>` : ''}
          </span>
          ${live ? `<span class="tile-preview"><img src="${esc(t.report.pages[0].src.replace('images/projects/', 'images/projects/thumbs/'))}" alt="" width="800" height="450" loading="lazy" decoding="async"></span>` : ''}`;
        return live
          ? `<li class="tile live" style="--c:${esc(t.colour)}"><a href="#/portfolio/${esc(t.id)}">${inner}</a></li>`
          : `<li class="tile soon" style="--c:${esc(t.colour)}" aria-disabled="true"><div>${inner}</div></li>`;
      };
      return `
        <section class="portal wrap" aria-labelledby="portal-title">
          <p class="eyebrow">Power BI portfolio · ${esc(profile.name)}</p>
          <h1 id="portal-title">Choose a topic</h1>
          <p class="lede">Each topic is a Power BI report built end to end on live public data: the API pipeline, the data model, the DAX and the visual design.</p>
          <ul class="tiles">${topics.map(tile).join('')}</ul>
        </section>`;
    },
    topic(t) {
      const r = t.report;
      document.title = `${r.title} · ${profile.name}`;
      return `
        <article class="report wrap" aria-labelledby="report-title" style="--c:${esc(t.colour)}">
          <a class="back" href="#/portfolio">${icon('back')}<span>All topics</span></a>
          <header class="report-head">
            <span class="tile-icon big" style="--c:${esc(t.colour)}">${icon(t.icon)}</span>
            <div>
              <p class="eyebrow">${esc(t.title)} · Power BI report · ${esc(monthName(r.date))}</p>
              <h1 id="report-title">${esc(r.title)}</h1>
            </div>
          </header>
          <p class="lede">${esc(r.summary)}</p>
          <div class="actions">${liveButton(r, 'big')}${codeButton(r, 'big')}<a class="btn ghost big" href="#/portfolio">${icon('back')} Back to topics</a></div>
          ${refreshStatus(r)}
          ${browser(r, t.id)}
          <dl class="stats">${(r.stats || []).map(s => `<div><dd>${esc(s.value)}</dd><dt>${esc(s.label)}</dt></div>`).join('')}</dl>

          <nav class="jump" aria-label="On this page"><a href="#what">What it does</a><a href="#uses">Real-world uses</a><a href="#built">How it is built</a><a href="#sources">Data and tools</a></nav>

          <section class="block" id="what" aria-labelledby="what-h"><h2 id="what-h">What it does</h2>
            <ul class="points">${r.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul></section>

          <section class="block" id="uses" aria-labelledby="uses-h"><h2 id="uses-h">Real-world uses</h2>
            <ul class="uses">${r.uses.map(u => `<li><h3>${esc(u.who)}</h3><p>${esc(u.what)}</p></li>`).join('')}</ul>
            ${r.usesNote ? `<p class="note">${esc(r.usesNote)}</p>` : ''}</section>

          <section class="block" id="built" aria-labelledby="built-h"><h2 id="built-h">How it is built</h2>
            <ol class="pipeline">${r.pipeline.map((s, i) => `<li><span class="step-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><strong>${esc(s.step)}</strong><span>${esc(s.detail)}</span></li>`).join('')}</ol>
            <h3 class="sub">Key techniques</h3>
            <ul class="points">${r.techniques.map(f => `<li>${esc(f)}</li>`).join('')}</ul></section>

          <section class="block" id="sources" aria-labelledby="sources-h"><h2 id="sources-h">Data and tools</h2>
            <div class="two">
              <ul class="sources">${r.dataSources.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a><span>${esc(s.licence)}</span></li>`).join('')}</ul>
              <ul class="tags">${r.tools.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
            </div></section>

          <div class="report-end">${liveButton(r, 'big')}${codeButton(r, 'big')}<a class="btn ghost big" href="#/portfolio">${icon('back')} Back to topics</a><a class="btn ghost big" href="#/">${icon('home')} Home</a></div>
        </article>`;
    },
  };

  // ---------- breadcrumbs ----------
  const crumbs = trail => {
    const el = document.getElementById('crumbs');
    el.innerHTML = `<a class="home-link" href="#/" aria-label="Home">${pbiMark}<span>${esc(profile.name)}</span></a>` +
      trail.map((c, i) => i === trail.length - 1 ? `<span class="sep" aria-hidden="true">/</span><span aria-current="page">${esc(c.label)}</span>` : `<span class="sep" aria-hidden="true">/</span><a href="${c.href}">${esc(c.label)}</a>`).join('');
  };

  // ---------- typing effect for the speech bubble ----------
  let typingTimer = null;
  const typeGreeting = () => {
    const el = document.getElementById('typed'); if (!el) return;
    const text = profile.greeting;
    if (reduceMotion) { el.textContent = text; return; }
    let i = 0; el.textContent = '';
    clearInterval(typingTimer);
    setTimeout(() => { typingTimer = setInterval(() => { el.textContent = text.slice(0, ++i); if (i >= text.length) clearInterval(typingTimer); }, 34); }, 650);
  };

  // ---------- router ----------
  const render = () => {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    // Older links (#nw-rainfall-watch) go to the Rainfall report
    if (parts[0] === 'nw-rainfall-watch') { location.replace('#/portfolio/rainfall'); return; }
    let html, view = 'intro';
    if (parts[0] === 'portfolio' && parts[1]) {
      const t = topics.find(x => x.id === parts[1] && x.report);
      if (t) { html = views.topic(t); view = 'topic'; crumbs([{ label: 'Portfolio', href: '#/portfolio' }, { label: t.title }]); }
      else { location.replace('#/portfolio'); return; }
    } else if (parts[0] === 'portfolio') { html = views.portal(); view = 'portal'; crumbs([{ label: 'Portfolio' }]); }
    else { html = views.intro(); crumbs([]); }
    const swap = () => {
      document.body.dataset.view = view;
      app.innerHTML = html;
      window.scrollTo(0, 0);
      if (view === 'topic') app.querySelectorAll('.tabs [data-src]').forEach(b => { const pre = new Image(); pre.decoding = 'async'; pre.src = b.dataset.src; });
      if (view === 'intro') typeGreeting(); else { clearInterval(typingTimer); const h = app.querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
    };
    if (document.startViewTransition && !reduceMotion && app.innerHTML) document.startViewTransition(swap); else swap();
  };
  window.addEventListener('hashchange', render);
  render();

  // ---------- page tabs on the report preview ----------
  document.addEventListener('click', e => {
    const tab = e.target.closest('.tabs [role="tab"]'); if (!tab) return;
    const frame = tab.closest('.browser');
    frame.querySelectorAll('[role="tab"]').forEach(b => b.setAttribute('aria-selected', b === tab));
    const pane = frame.querySelector('[role="tabpanel"]'), img = pane.querySelector('img');
    if (img.getAttribute('src') !== tab.dataset.src) {
      // Overlay on until the picture has loaded (or failed), so a slow page never looks broken
      const done = () => { pane.classList.remove('loading'); pane.removeAttribute('aria-busy'); };
      pane.classList.add('loading'); pane.setAttribute('aria-busy', 'true');
      img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true });
      img.src = tab.dataset.src;
      if (img.complete) done();
    }
    img.alt = tab.dataset.alt;
    frame.querySelector('[role="tabpanel"]').setAttribute('aria-labelledby', tab.id);
  });
  // In-page jump links must not change the route
  document.addEventListener('click', e => {
    const a = e.target.closest('.jump a'); if (!a) return;
    e.preventDefault();
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  // ---------- theme toggle ----------
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.dataset.theme || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();
