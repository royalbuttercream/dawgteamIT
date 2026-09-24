// Produces the Phase B mocks by copy. Reads tooling/mock-src/pages/<slug>.html, inserts the
// shared header and footer partials, resolves {{href:key}}, {{img:path}} and {{asset:name}}
// placeholders, and writes:
//   <slug>/mock/<slug>-mock.html + tokens.css + mock.css + mock.js   (standalone, per page)
//   merged/<slug>.html + shared css/js + assets/                     (flat folder, links between mocks work)
//   docs/<path>/index.html + shared css/js, docs/assets/, and one redirect stub per live URL (data/redirects.json)
//   docs/ is the tree GitHub Pages serves (Settings > Pages: main, /docs).
// Nav targets without a mock yet point at the live page and are marked external by mock.js.
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, basename, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');
const SRC = join(here, 'mock-src');
const LIVE = 'https://www.lambdaxi1911.com';

// key -> { mock folder slug, live path }
export const PAGES = {
  home: { slug: 'home', live: '/', title: 'Home' },
  history: { slug: 'history-of-lambda-xi', live: '/history-of-lambda-xi', title: 'History' },
  leadership: { slug: 'leadership', live: '/executive-officers', title: 'Leadership and Lineage' },
  basilei: { slug: 'past-basilei', live: '/past-basilei', title: 'Past Basilei' },
  lineage: { slug: 'lineage', live: '/lineage', title: 'Lineage' },
  programs: { slug: 'mandated-programs', live: '/mandated-programs', title: 'Mandated Programs' },
  scholarships: { slug: 'scholarships', live: '/scholarships', title: 'Scholarships' },
  events: { slug: 'events', live: '/50th-anniversary-gala', title: 'Events' },
  achievementWeek: { slug: 'achievement-week', live: '/achievement-week', title: 'Achievement Week' },
  ylc: { slug: 'youth-leadership-conference', live: '/youth-leadership-conference', title: 'Youth Leadership Conference' },
  allStar: { slug: 'all-star-game', live: '/all-star-game', title: 'All Star Game' },
  anniversary: { slug: '50th-anniversary-gala', live: '/50th-anniversary-gala', title: '50th Anniversary' },
  gallery: { slug: 'gallery', live: '/2025', title: 'Gallery' },
  gallery2025: { slug: 'gallery-2025', live: '/2025', title: 'Gallery 2025' },
  gallery2024: { slug: 'gallery-2024', live: '/2024', title: 'Gallery 2024' },
  gallery2023: { slug: 'gallery-2023', live: '/2023', title: 'Gallery 2023' },
  gallery2022: { slug: 'gallery-2022', live: '/2022', title: 'Gallery 2022' },
  gallery2021: { slug: 'gallery-2021', live: '/2021', title: 'Gallery 2021' },
  gallery2017_2020: { slug: 'gallery-2017-2020', live: '/2017-2020', title: 'Gallery 2017 to 2020' },
  nye: { slug: 'new-years-eve-party', live: '/new-year-s-eve-party', title: "New Year's Eve Party" },
  news: { slug: 'news', live: '/news', title: 'News' },
  contact: { slug: 'contact-us', live: '/contact-us', title: 'Contact' },
};

// key -> folder in the built site (trailing slash implied; each folder gets an index.html)
export const SITE_PATHS = {
  home: '/', history: '/history/', leadership: '/leadership/',
  basilei: '/leadership/past-basilei/', lineage: '/leadership/lineage/', programs: '/programs/',
  scholarships: '/scholarships/', events: '/events/', achievementWeek: '/events/achievement-week/',
  ylc: '/events/youth-leadership-conference/', allStar: '/events/all-star-game/',
  anniversary: '/events/50th-anniversary/', nye: '/events/new-years-eve/', gallery: '/gallery/',
  gallery2025: '/gallery/2025/', gallery2024: '/gallery/2024/', gallery2023: '/gallery/2023/',
  gallery2022: '/gallery/2022/', gallery2021: '/gallery/2021/', gallery2017_2020: '/gallery/2017-2020/',
  news: '/news/', contact: '/contact/',
};
const relDir = (from, to) => { const r = posix.relative(from, to); return r ? `${r}/` : './'; };
const toRoot = (from) => relDir(from, '/');

const partial = (name) => readFileSync(join(SRC, 'partials', `${name}.html`), 'utf8');
const pageSources = readdirSync(join(SRC, 'pages')).filter((f) => f.endsWith('.html')).map((f) => basename(f, '.html'));
const hasMock = (key) => pageSources.includes(key);

// Content Security Policy for the served site. The only inline script is the theme pre-paint in
// partials/head.html; its hash is computed here so the policy stays valid when that script changes.
// Standalone and merged mocks are opened from file://, where 'self' is unreliable, so they get none.
const inlineScript = (partial('head').match(/<script>([\s\S]*?)<\/script>/) || [])[1];
if (!inlineScript) throw new Error('partials/head.html: inline theme script not found; CSP hash cannot be computed');
const scriptHash = `'sha256-${createHash('sha256').update(inlineScript).digest('base64')}'`;
const CSP = [
  "default-src 'self'",
  `script-src 'self' ${scriptHash}`,
  "style-src 'self' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data: https://custom-images.strikinglycdn.com",
  "frame-src https://docs.google.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');
const cspTag = `<meta http-equiv="Content-Security-Policy" content="${CSP}">\n`;
const eventsJson = readFileSync(join(SRC, 'data', 'events.json'), 'utf8').replace(/<\/script/gi, '<\\/script');
// Events are parsed and checked here so a bad edit fails the build instead of blanking the widget.
const eventsData = JSON.parse(readFileSync(join(SRC, 'data', 'events.json'), 'utf8'));
const eventsById = new Map();
for (const ev of eventsData.events) {
  for (const k of ['id', 'title', 'start', 'page']) if (!ev[k]) throw new Error(`events.json: "${ev.title || ev.id || '?'}" lacks ${k}`);
  if (!PAGES[ev.page]) throw new Error(`events.json: "${ev.id}" points at unknown page key ${ev.page}`);
  if (Number.isNaN(Date.parse(ev.start))) throw new Error(`events.json: "${ev.id}" has an unparseable start ${ev.start}`);
  if (eventsById.has(ev.id)) throw new Error(`events.json: duplicate id ${ev.id}`);
  eventsById.set(ev.id, ev);
}
// Same wording as events.js dateText, so a detail page and the events list never disagree.
const KST = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: '2-digit', hour12: true });
const kstParts = (iso) => Object.fromEntries(KST.formatToParts(new Date(iso.length === 10 ? `${iso}T12:00+09:00` : iso)).map((x) => [x.type, x.value]));
const dayText = (o) => `${o.weekday} ${o.day} ${o.month}`;
function eventWhen(ev) {
  const s = kstParts(ev.start);
  if (ev.approximate && ev.allDay) return `<time datetime="${ev.start.slice(0, 7)}">${s.month} ${s.year}</time>`;
  if (ev.allDay && ev.end && ev.end !== ev.start) { const e = kstParts(ev.end); return `<time datetime="${ev.start}">${dayText(s)}</time> to <time datetime="${ev.end}">${dayText(e)} ${e.year}</time>`; }
  const time = ev.allDay ? '' : `, ${s.hour}:${s.minute} ${s.dayPeriod}`;
  return `<time datetime="${ev.start}">${dayText(s)} ${s.year}${time}</time>`;
}
function eventField(id, field) {
  const ev = eventsById.get(id);
  if (!ev) throw new Error(`Unknown event id ${id} in {{event:${id}:${field}}}`);
  if (field === 'when') return eventWhen(ev);
  if (field === 'place') { if (!ev.place) throw new Error(`events.json: "${id}" has no place but a page asks for {{event:${id}:place}}`); return ev.place; }
  if (field === 'start') return ev.start;
  throw new Error(`Unknown event field ${field} in {{event:${id}:${field}}}`);
}
function resolve(html, { currentKey, mode }) {
  const withPartials = html.replace('{{head}}', partial('head')).replace('{{header}}', partial('header')).replace('{{footer}}', partial('footer')).replace('{{events:json}}', eventsJson).replace('{{csp}}', mode === 'site' ? cspTag : '');
  const assets = new Set();
  const out = withPartials
    .replace(/\{\{href:(\w+)\}\}/g, (_, key) => {
      const p = PAGES[key];
      if (!p) throw new Error(`Unknown page key ${key}`);
      if (!hasMock(key)) return `${LIVE}${p.live}`;
      if (mode === 'merged') return `${p.slug}.html`;
      if (mode === 'site') return relDir(SITE_PATHS[currentKey], SITE_PATHS[key]);
      return key === currentKey ? `${p.slug}-mock.html` : `../../${p.slug}/mock/${p.slug}-mock.html`;
    })
    .replace(/\{\{current:(\w+)\}\}/g, (_, key) => (key === currentKey ? ' aria-current="page"' : ''))
    .replace(/\{\{img:([\w./-]+)\}\}/g, (_, path) => { assets.add(path); if (mode === 'merged') return `assets/${path}`; if (mode === 'site') return `${toRoot(SITE_PATHS[currentKey])}assets/${path}`; return `../../${path}`; })
    .replace(/\{\{event:(\w+):(\w+)\}\}/g, (_, id, field) => eventField(id, field))
    .replace(/\{\{live\}\}/g, LIVE)
    .replace(/\{\{title:(\w+)\}\}/g, (_, key) => PAGES[key].title);
  return { html: out, assets };
}

function copyShared(dir) {
  for (const f of ['tokens.css', 'mock.css', 'mock.js', 'gallery.js', 'events.js']) copyFileSync(join(SRC, f), join(dir, f));
}

const mergedDir = join(ROOT, 'merged');
const siteRoot = join(ROOT, 'docs');
// Generated trees are rebuilt from scratch so a renamed page cannot leave a stale folder behind.
rmSync(mergedDir, { recursive: true, force: true });
rmSync(siteRoot, { recursive: true, force: true });
mkdirSync(mergedDir, { recursive: true });
copyShared(mergedDir);
const allAssets = new Set();
const missingAssets = [];

for (const key of pageSources) {
  const page = PAGES[key];
  const src = readFileSync(join(SRC, 'pages', `${key}.html`), 'utf8');
  const dir = join(ROOT, page.slug, 'mock');
  mkdirSync(dir, { recursive: true });
  const standalone = resolve(src, { currentKey: key, mode: 'standalone' });
  writeFileSync(join(dir, `${page.slug}-mock.html`), standalone.html);
  copyShared(dir);
  const merged = resolve(src, { currentKey: key, mode: 'merged' });
  writeFileSync(join(mergedDir, `${page.slug}.html`), merged.html);
  merged.assets.forEach((a) => allAssets.add(a));
  const siteDir = join(siteRoot, SITE_PATHS[key]);
  mkdirSync(siteDir, { recursive: true });
  writeFileSync(join(siteDir, 'index.html'), resolve(src, { currentKey: key, mode: 'site' }).html);
  copyShared(siteDir);
  console.log(`built ${page.slug}: ${dir}/${page.slug}-mock.html and merged/${page.slug}.html`);
}

for (const asset of allAssets) {
  const from = join(ROOT, asset);
  if (!existsSync(from)) { missingAssets.push(asset); continue; }
  const to = join(mergedDir, 'assets', asset);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}
console.log(`merged assets: ${allAssets.size}`);
if (missingAssets.length) {
  console.error(`BUILD FAILED: ${missingAssets.length} referenced asset(s) do not exist:\n  ${missingAssets.join('\n  ')}`);
  process.exit(1);
}
for (const asset of allAssets) {
  const from = join(ROOT, asset);
  if (!existsSync(from)) continue;
  const to = join(siteRoot, 'assets', asset);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

// Redirect stubs: one index.html per live URL, pointing at the page that replaces it.
const { redirects } = JSON.parse(readFileSync(join(SRC, 'data', 'redirects.json'), 'utf8'));
let stubs = 0;
for (const r of redirects) {
  const fromDir = `${r.from}/`;
  if (r.from === '/' || fromDir === SITE_PATHS[r.to]) continue; // same address before and after: the page itself lives here
  const target = relDir(fromDir, SITE_PATHS[r.to]) + (r.anchor ? `#${r.anchor}` : '');
  const title = PAGES[r.to].title;
  const dir = join(siteRoot, fromDir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="${target}"><meta name="robots" content="noindex"><title>${title}</title></head><body><p>This page has moved to <a href="${target}">${title}</a>.</p></body></html>\n`);
  stubs++;
}
console.log(`site: ${pageSources.length} pages, ${stubs} redirect stubs, ${allAssets.size} assets in docs/`);

// Review hub: one page listing every built mock with its status (tooling/mock-src/data/status.json).
const statusPath = join(SRC, 'data', 'status.json');
const status = existsSync(statusPath) ? JSON.parse(readFileSync(statusPath, 'utf8')) : {};
const rows = pageSources.map((key) => { const p = PAGES[key]; return `<tr><td><a href="${p.slug}.html">${p.title}</a></td><td>${status[key] || 'built'}</td><td><code>${p.slug}/mock/${p.slug}-mock.html</code></td></tr>`; }).join('\n');
writeFileSync(join(mergedDir, 'index.html'), `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Lambda Xi mocks: review hub</title><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="mock.css"></head><body><main id="main" class="container section"><h1>Lambda Xi rebuild: review hub</h1><p class="prose">Every built mock, with its status. Links between the pages work inside this folder. Rebuild with <code>node tooling/build-mocks.mjs</code>.</p><table class="table"><thead><tr><th scope="col">Page</th><th scope="col">Status</th><th scope="col">Standalone file</th></tr></thead><tbody>${rows}</tbody></table></main></body></html>\n`);
console.log(`review hub: merged/index.html (${pageSources.length} pages)`);
