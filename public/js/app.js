/* KAZI Startfunding website.
 * Content lives in data/*.json — edit those files, not this script.
 * English interface texts are in index.html; French and Swahili ones in data/texts.json.
 */
(async function () {
'use strict';

/* ---------- Load data ---------- */
async function load(name) {
  try {
    const r = await fetch('data/' + name + '.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch (e) {
    console.error('Could not load data/' + name + '.json', e);
    return null;
  }
}
const [I18N, projectsData, teamData, partnersData, reportsData, statsData] = await Promise.all(
  ['texts', 'projects', 'team', 'partners', 'reports', 'stats'].map(load)
);
const PROJECTS = (projectsData && projectsData.projects) || [];
const TEAMS = (teamData && teamData.teams) || [];
const PARTNERS = partnersData || { partners: [] };
const REPORTS = (reportsData && reportsData.reports) || [];
const STATS = (statsData && statsData.stats) || [];
const LANGS = Object.assign({}, I18N || {});

/* Strings used only from script (English defaults) */
const SCRIPT_EN = {
  'bank.copy': 'Copy IBAN', 'bank.copied': 'Copied ✓', 'bank.copyfail': 'Select & copy manually',
  'projects.less': 'Show fewer projects',
  'projects.count': 'Showing {shown} of {total} projects',
  'team.more': '… See more', 'team.less': 'See less', 'team.soon': 'Bio coming soon',
  'reports.latest': 'Latest', 'team.contact': 'Contact the team',
  'cat.agriculture': 'Agriculture', 'cat.crafts': 'Crafts', 'cat.health': 'Hygiene & health',
  'cat.food': 'Food', 'cat.services': 'Services', 'cat.culture': 'Culture', 'cat.tech': 'Tech',
  'country.tz': 'Tanzania', 'country.td': 'Chad'
};

/* ---------- Helpers ---------- */
const $ = id => document.getElementById(id);
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let lang = 'en';
const EN = Object.assign({}, SCRIPT_EN);
const t = key => (LANGS[lang] && LANGS[lang][key] != null) ? LANGS[lang][key] : EN[key];
/* pick the current language from a {en, fr, sw} object, falling back to English */
const tr = obj => {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || '';
};
const CATEGORIES = ['agriculture', 'crafts', 'health', 'food', 'services', 'culture', 'tech'];

/* ---------- Stats ---------- */
function renderStats() {
  $('stats').innerHTML = STATS.map(s =>
    `<div class="stat"><b>${esc(s.value)}</b><span>${esc(tr(s.label))}</span></div>`).join('');
}

/* ---------- Hero photos ---------- */
function renderHero() {
  const withPhoto = PROJECTS.filter(p => p.photo);
  const featured = withPhoto.filter(p => p.featured);
  const pick = (featured.length >= 3 ? featured : featured.concat(withPhoto.filter(p => !p.featured))).slice(0, 3);
  $('hero-photos').innerHTML = pick.map((p, i) =>
    `<img src="${esc(p.photo)}" alt="" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">`).join('');
}

/* ---------- Projects ---------- */
const PAGE = 9;
let visible = PAGE;
const filters = { country: 'all', year: 'all', category: 'all', status: 'all' };

function fillFilterOptions() {
  const years = [...new Set(PROJECTS.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);
  const yearSel = $('f-year');
  yearSel.querySelectorAll('option:not([value=all])').forEach(o => o.remove());
  years.forEach(y => yearSel.insertAdjacentHTML('beforeend', `<option value="${y}">${y}</option>`));
  const used = new Set(PROJECTS.map(p => p.category));
  const catSel = $('f-category');
  catSel.querySelectorAll('option:not([value=all])').forEach(o => o.remove());
  CATEGORIES.filter(c => used.has(c)).forEach(c =>
    catSel.insertAdjacentHTML('beforeend', `<option value="${c}">${esc(t('cat.' + c))}</option>`));
  catSel.value = filters.category;
  yearSel.value = filters.year;
}

function matches(p) {
  if (filters.country !== 'all' && p.country !== filters.country) return false;
  if (filters.year !== 'all' && String(p.year) !== filters.year) return false;
  if (filters.category !== 'all' && p.category !== filters.category) return false;
  if (filters.status === 'second' && !p.second_loan) return false;
  if ((filters.status === 'ongoing' || filters.status === 'completed') && p.status !== filters.status) return false;
  return true;
}

function card(p) {
  const status = p.status === 'completed'
    ? `<span class="badge repaid">${t('status.done')}</span>`
    : `<span class="badge ongoing">${t('status.ongoing')}</span>`;
  const second = p.second_loan ? `<span class="badge second">${t('status.second')}</span>` : '';
  const report = REPORTS.find(r => r.id === String(p.report));
  const reportLink = report
    ? `<a class="more" href="#report-${esc(report.id)}">${esc(t('reports.in').replace('{year}', report.label))}</a>` : '';
  const img = p.photo
    ? `<img class="card-img" src="${esc(p.photo)}" alt="${esc(tr(p.title))}" loading="lazy" decoding="async">`
    : `<div class="ph card-img" aria-hidden="true"></div>`;
  return `<article class="card">
    ${img}
    <div class="card-body">
      <div class="tags"><span class="tag">${esc(t('country.' + p.country))}${p.place ? ' · ' + esc(p.place) : ''}</span><span class="tag">${esc(p.year)}</span><span class="tag">${esc(t('cat.' + p.category))}</span>${status}${second}</div>
      <h3>${esc(tr(p.title))}</h3>
      ${p.people ? `<div class="people">${esc(p.people)}</div>` : ''}
      <p>${esc(tr(p.summary))}</p>
      ${p.amount ? `<div class="amount">${esc(t('projects.loan'))} ${esc(p.amount)}</div>` : '<div class="amount"></div>'}
      ${reportLink}
    </div>
  </article>`;
}

function renderProjects() {
  const list = PROJECTS.filter(matches);
  const shown = list.slice(0, visible);
  $('cards').innerHTML = shown.map(card).join('');
  $('empty').hidden = list.length > 0;
  $('count').textContent = list.length
    ? t('projects.count').replace('{shown}', shown.length).replace('{total}', list.length) : '';
  const more = $('more');
  more.hidden = list.length <= PAGE;
  more.textContent = visible >= list.length ? t('projects.less') : t('projects.more');
}

['country', 'year', 'category', 'status'].forEach(k => {
  $('f-' + k).addEventListener('change', e => { filters[k] = e.target.value; visible = PAGE; renderProjects(); });
});
$('more').addEventListener('click', () => {
  const total = PROJECTS.filter(matches).length;
  if (visible >= total) {
    visible = PAGE;
    renderProjects();
    $('projects').scrollIntoView({ behavior: 'smooth' });
  } else {
    visible += PAGE;
    renderProjects();
  }
});
function setCountry(c) {
  filters.country = c; $('f-country').value = c; visible = PAGE; renderProjects();
}

/* ---------- Reports ---------- */
function renderReports() {
  $('reports-list').innerHTML = REPORTS.map(r => {
    const links = [
      r.pdf_fr ? `<a href="${esc(r.pdf_fr)}" target="_blank" rel="noopener">PDF FR</a>` : '',
      r.pdf_en ? `<a href="${esc(r.pdf_en)}" target="_blank" rel="noopener">PDF EN</a>` : ''
    ].join('');
    return `<div class="report${r.latest ? ' latest' : ''}" id="report-${esc(r.id)}">
      <small>${r.latest ? esc(t('reports.latest')) : '&nbsp;'}</small>
      <h3>${esc(r.label)}</h3>
      <small>${esc(tr(r.subtitle))}</small>
      <div class="dl">${links}</div>
    </div>`;
  }).join('');
}

/* ---------- Teams ---------- */
const openBios = new Set();
function renderTeams() {
  $('teams').innerHTML = TEAMS.map(team => `
    <div class="team-block" id="team-${esc(team.id)}">
      <div class="local-team">
        <div>
          <h3>${esc(tr(team.name))}</h3>
          ${tr(team.intro) ? `<p>${esc(tr(team.intro))}</p>` : ''}
        </div>
        ${team.id !== 'ch' ? `<a class="btn btn-outline" href="#contact">${t('team.contact')}</a>` : ''}
      </div>
      <div class="team">
        ${(team.members || []).map((m, i) => {
          const key = team.id + ':' + i;
          const bio = tr(m.bio);
          const open = openBios.has(key);
          const photo = m.photo
            ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy" decoding="async">`
            : `<div class="ph" aria-hidden="true"></div>`;
          return `<div class="member">
            ${photo}
            <b>${esc(m.name)}</b>
            <span class="role">${esc(tr(m.role))}</span>
            ${bio
              ? `<p class="bio${open ? ' open' : ''}" id="bio-${esc(team.id)}-${i}">${esc(bio)}</p>
                 <button type="button" class="bio-toggle" data-key="${esc(key)}" aria-expanded="${open}" aria-controls="bio-${esc(team.id)}-${i}">${esc(open ? t('team.less') : t('team.more'))}</button>`
              : `<p class="bio soon">${esc(t('team.soon'))}</p>`}
          </div>`;
        }).join('')}
      </div>
    </div>`).join('');
  hideUnneededToggles();
}
/* only show "See more" when the bio is actually longer than 2 lines */
function hideUnneededToggles() {
  document.querySelectorAll('.bio-toggle').forEach(btn => {
    const bio = document.getElementById(btn.getAttribute('aria-controls'));
    if (!bio.classList.contains('open')) btn.hidden = bio.scrollHeight <= bio.clientHeight + 2;
  });
}
$('teams').addEventListener('click', e => {
  const btn = e.target.closest('.bio-toggle');
  if (!btn) return;
  const key = btn.dataset.key;
  const bio = document.getElementById(btn.getAttribute('aria-controls'));
  const open = !openBios.has(key);
  if (open) openBios.add(key); else openBios.delete(key);
  bio.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
  btn.textContent = open ? t('team.less') : t('team.more');
});
let resizeTimer;
window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(hideUnneededToggles, 150); });

/* ---------- Partners ---------- */
function renderPartners() {
  $('partners-intro').textContent = tr(PARTNERS.intro);
  $('logos').innerHTML = (PARTNERS.partners || []).map(p => {
    const img = `<img src="${esc(p.logo)}" alt="${esc(p.name)}" loading="lazy">`;
    return p.url
      ? `<a class="logo-box" href="${esc(p.url)}" target="_blank" rel="noopener" title="${esc(p.name)}">${img}</a>`
      : `<div class="logo-box" title="${esc(p.name)}">${img}</div>`;
  }).join('');
}

/* ---------- Language switching ---------- */
const textNodes = [...document.querySelectorAll('[data-i18n]')];
const attrNodes = [...document.querySelectorAll('[data-i18n-attr]')];
textNodes.forEach(n => { if (!(n.dataset.i18n in EN)) EN[n.dataset.i18n] = n.innerHTML; });
attrNodes.forEach(n => n.dataset.i18nAttr.split(';').forEach(pair => {
  const [attr, key] = pair.split(':');
  if (!(key in EN)) EN[key] = n.getAttribute(attr);
}));
EN['reports.in'] = EN['reports.in'] || 'In the {year} report →';
EN['projects.loan'] = EN['projects.loan'] || 'Loan:';
LANGS.en = EN;

function renderAll() {
  renderStats();
  fillFilterOptions();
  renderProjects();
  renderReports();
  renderTeams();
  renderPartners();
}

function setLang(next, persist) {
  lang = LANGS[next] ? next : 'en';
  document.documentElement.lang = lang;
  textNodes.forEach(n => { n.innerHTML = t(n.dataset.i18n); });
  attrNodes.forEach(n => n.dataset.i18nAttr.split(';').forEach(pair => {
    const [attr, key] = pair.split(':');
    n.setAttribute(attr, t(key));
  }));
  document.title = t('meta.title').replace(/&amp;/g, '&');
  document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  renderAll();
  if (persist) {
    try { localStorage.setItem('kazi-lang', lang); } catch (e) {}
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
  }
}
document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang, true)));

(function initLang() {
  let pick = new URLSearchParams(location.search).get('lang');
  if (!pick) { try { pick = localStorage.getItem('kazi-lang'); } catch (e) {} }
  if (!pick) { const nav = (navigator.language || 'en').slice(0, 2); pick = LANGS[nav] ? nav : 'en'; }
  renderHero();
  setLang(pick, false);
})();

/* ---------- Mobile menu ---------- */
const burger = $('burger'), menu = $('menu');
burger.addEventListener('click', () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', String(o)); });
function closeMenu() { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }

/* ---------- In-page navigation: close menu, apply map filters, flash the target ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const target = document.getElementById(a.getAttribute('href').slice(1));
  if (!target) return;
  closeMenu();
  if (a.dataset.filter) setCountry(a.dataset.filter);
  const box = target.matches('.report,.bank,.join-card,.team-block') ? target : null;
  if (box) { box.classList.remove('flash'); void box.offsetWidth; box.classList.add('flash'); }
});

/* ---------- Highlight the current section in the menu ---------- */
const menuLinks = [...menu.querySelectorAll('a')];
const sectionFor = { home: null, impact: null, how: null, about: 'about', where: 'about', projects: 'projects', reports: 'reports', team: 'team', partners: 'partners', faq: 'faq', 'get-involved': null, donate: null, join: null, contact: 'contact' };
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const key = sectionFor[en.target.id];
    menuLinks.forEach(l => l.classList.toggle('active', key !== null && l.getAttribute('href') === '#' + key));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
Object.keys(sectionFor).map(id => document.getElementById(id)).filter(Boolean).forEach(s => io.observe(s));

/* ---------- Donation amounts & IBAN copy ---------- */
const amountBtns = [...document.querySelectorAll('.amount-btn')];
amountBtns.forEach(b => b.addEventListener('click', () => {
  amountBtns.forEach(x => x.setAttribute('aria-pressed', 'false'));
  b.setAttribute('aria-pressed', 'true');
  $('chosen').textContent = b.dataset.amount;
}));
$('copy').addEventListener('click', async e => {
  const btn = e.currentTarget;
  try { await navigator.clipboard.writeText($('iban').textContent.replace(/\s/g, '')); btn.textContent = t('bank.copied'); }
  catch (err) { btn.textContent = t('bank.copyfail'); }
  setTimeout(() => { btn.textContent = t('bank.copy'); }, 2500);
});

/* jump to a #hash target again once the dynamic sections have rendered */
if (location.hash) { const el = document.getElementById(location.hash.slice(1)); if (el) el.scrollIntoView(); }
})();
