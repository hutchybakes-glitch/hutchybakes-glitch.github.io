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
    return `<p class="status"><span class="dot" aria-hidden="true"></span><span><strong>Live data</strong> · refreshes ${times.length} times a day · last scheduled update ${last}${past.length ? '' : ' yesterday'}, next ${next} (UK time)</span></p>`;
  };
  const liveButton = (r, cls = '') => r.liveUrl
    ? `<a class="btn primary ${cls}" href="${esc(r.liveUrl)}" target="_blank" rel="noopener">Open the live report ${icon('arrow')}<span class="sr">(opens in a new tab)</span></a>`
    : `<span class="btn soon ${cls}" aria-disabled="true">Live report coming soon</span>`;
  const browser = (r, id) => `
    <div class="browser">
      <div class="browser-bar">
        <span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
        <div class="tabs" role="tablist" aria-label="Report pages">${r.pages.map((p, i) => `<button type="button" role="tab" id="tab-${id}-${i}" aria-selected="${i === 0}" aria-controls="pane-${id}" data-src="${esc(p.src)}" data-alt="${esc(p.alt)}">${esc(p.label)}</button>`).join('')}</div>
      </div>
      <figure class="shot" id="pane-${id}" role="tabpanel" aria-labelledby="tab-${id}-0"><img src="${esc(r.pages[0].src)}" alt="${esc(r.pages[0].alt)}" width="1600" height="894" decoding="async"></figure>
    </div>`;

  // ---------- the character (an illustration, not a likeness) ----------
  const character = `
    <svg class="character" viewBox="0 0 260 300" role="img" aria-label="An illustrated character waving hello">
      <ellipse cx="130" cy="292" rx="88" ry="8" class="c-shadow"/>
      <path class="c-body" d="M44 300c0-62 36-98 86-98s86 36 86 98Z"/>
      <path class="c-collar" d="M108 206l22 26 22-26"/>
      <rect class="c-lanyard" x="127" y="232" width="6" height="40" rx="3"/>
      <rect class="c-badge" x="117" y="268" width="26" height="20" rx="4"/>
      <g class="c-arm-wave">
        <path class="c-body" d="M196 228c22-20 30-58 26-86l-18-2c2 26-4 54-22 70Z"/>
        <circle class="c-skin" cx="214" cy="132" r="15"/>
      </g>
      <rect class="c-skin" x="116" y="176" width="28" height="32" rx="10"/>
      <circle class="c-skin" cx="77" cy="134" r="11"/><circle class="c-skin" cx="183" cy="134" r="11"/>
      <circle class="c-skin" cx="130" cy="128" r="54"/>
      <path class="c-hair" d="M76 124c-4-40 22-66 56-66 30 0 54 18 54 52-12-14-30-20-52-20-24 0-42 10-58 34Z"/>
      <circle class="c-eye" cx="110" cy="132" r="5"/><circle class="c-eye" cx="150" cy="132" r="5"/>
      <rect class="c-glasses" x="96" y="120" width="28" height="22" rx="9"/><rect class="c-glasses" x="136" y="120" width="28" height="22" rx="9"/><path class="c-glasses-bridge" d="M124 130h12"/>
      <path class="c-smile" d="M114 156c8 9 24 9 32 0"/>
      <circle class="c-cheek" cx="98" cy="152" r="7"/><circle class="c-cheek" cx="162" cy="152" r="7"/>
    </svg>`;

  // ---------- views ----------
  const views = {
    intro() {
      document.title = `${profile.name} · Power BI portfolio`;
      return `
        <section class="intro" aria-labelledby="intro-title">
          <div class="rain" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="--x:${(i * 53) % 100}%;--d:${(i * 0.37) % 2.4}s;--h:${30 + (i * 17) % 50}px"></i>`).join('')}</div>
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
          ${live ? `<span class="tile-preview"><img src="${esc(t.report.pages[0].src)}" alt="" loading="lazy" decoding="async"></span>` : ''}`;
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
          <div class="actions">${liveButton(r, 'big')}<a class="btn ghost big" href="#/portfolio">${icon('back')} Back to topics</a></div>
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

          <div class="report-end">${liveButton(r, 'big')}<a class="btn ghost big" href="#/portfolio">${icon('back')} Back to topics</a><a class="btn ghost big" href="#/">${icon('home')} Home</a></div>
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
    const img = frame.querySelector('img'); img.src = tab.dataset.src; img.alt = tab.dataset.alt;
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
    const current = root.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();
