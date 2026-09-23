// Produces the Phase B mocks by copy. Reads tooling/mock-src/pages/<slug>.html, inserts the
// shared header and footer partials, resolves {{href:key}}, {{img:path}} and {{asset:name}}
// placeholders, and writes:
//   <slug>/mock/<slug>-mock.html + tokens.css + mock.css + mock.js   (standalone, per page)
//   merged/<slug>.html + shared css/js + assets/                     (flat folder, links between mocks work)
// Nav targets without a mock yet point at the live page and are marked external by mock.js.
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
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
  officers: { slug: 'executive-officers', live: '/executive-officers', title: 'Executive Officers' },
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

const partial = (name) => readFileSync(join(SRC, 'partials', `${name}.html`), 'utf8');
const pageSources = readdirSync(join(SRC, 'pages')).filter((f) => f.endsWith('.html')).map((f) => basename(f, '.html'));
const hasMock = (key) => pageSources.includes(key);

const eventsJson = readFileSync(join(SRC, 'data', 'events.json'), 'utf8').replace(/<\/script/gi, '<\\/script');
function resolve(html, { currentKey, mode }) {
  const withPartials = html.replace('{{head}}', partial('head')).replace('{{header}}', partial('header')).replace('{{footer}}', partial('footer')).replace('{{events:json}}', eventsJson);
  const assets = new Set();
  const out = withPartials
    .replace(/\{\{href:(\w+)\}\}/g, (_, key) => {
      const p = PAGES[key];
      if (!p) throw new Error(`Unknown page key ${key}`);
      if (!hasMock(key)) return `${LIVE}${p.live}`;
      if (mode === 'merged') return `${p.slug}.html`;
      return key === currentKey ? `${p.slug}-mock.html` : `../../${p.slug}/mock/${p.slug}-mock.html`;
    })
    .replace(/\{\{current:(\w+)\}\}/g, (_, key) => (key === currentKey ? ' aria-current="page"' : ''))
    .replace(/\{\{img:([\w./-]+)\}\}/g, (_, path) => { assets.add(path); return mode === 'merged' ? `assets/${path}` : `../../${path}`; })
    .replace(/\{\{live\}\}/g, LIVE)
    .replace(/\{\{title:(\w+)\}\}/g, (_, key) => PAGES[key].title);
  return { html: out, assets };
}

function copyShared(dir) {
  for (const f of ['tokens.css', 'mock.css', 'mock.js', 'gallery.js', 'events.js']) copyFileSync(join(SRC, f), join(dir, f));
}

const mergedDir = join(ROOT, 'merged');
mkdirSync(mergedDir, { recursive: true });
copyShared(mergedDir);
const allAssets = new Set();

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
  console.log(`built ${page.slug}: ${dir}/${page.slug}-mock.html and merged/${page.slug}.html`);
}

for (const asset of allAssets) {
  const from = join(ROOT, asset);
  if (!existsSync(from)) { console.log(`MISSING asset ${asset}`); continue; }
  const to = join(mergedDir, 'assets', asset);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}
console.log(`merged assets: ${allAssets.size}`);

// Review hub: one page listing every built mock with its status (tooling/mock-src/data/status.json).
const statusPath = join(SRC, 'data', 'status.json');
const status = existsSync(statusPath) ? JSON.parse(readFileSync(statusPath, 'utf8')) : {};
const rows = pageSources.map((key) => { const p = PAGES[key]; return `<tr><td><a href="${p.slug}.html">${p.title}</a></td><td>${status[key] || 'built'}</td><td><code>${p.slug}/mock/${p.slug}-mock.html</code></td></tr>`; }).join('\n');
writeFileSync(join(mergedDir, 'index.html'), `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Lambda Xi mocks: review hub</title><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="mock.css"></head><body><main id="main" class="container section"><h1>Lambda Xi rebuild: review hub</h1><p class="prose">Every built mock, with its status. Links between the pages work inside this folder. Rebuild with <code>node tooling/build-mocks.mjs</code>.</p><table class="table"><thead><tr><th scope="col">Page</th><th scope="col">Status</th><th scope="col">Standalone file</th></tr></thead><tbody>${rows}</tbody></table></main></body></html>\n`);
console.log(`review hub: merged/index.html (${pageSources.length} pages)`);
