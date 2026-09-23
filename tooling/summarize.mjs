// Prints a compact per-page digest from the crawl artifacts for report writing.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..');
const manifest = JSON.parse(readFileSync(join(here, 'pages.json'), 'utf8'));
const only = process.argv.slice(2);
const J = (p) => JSON.parse(readFileSync(p, 'utf8'));
const kb = (n) => `${Math.round(n / 1024)}KB`;
const short = (u) => u.replace(/^https?:\/\//, '').slice(0, 90);

for (const pg of manifest.pages) {
  if (only.length && !only.includes(pg.slug)) continue;
  const dir = join(OUT, pg.slug, 'source');
  if (!existsSync(join(dir, 'inventory-1440.json'))) { console.log(`## ${pg.slug}: NOT CRAWLED`); continue; }
  const inv = { 375: J(join(dir, 'inventory-375.json')), 768: J(join(dir, 'inventory-768.json')), 1440: J(join(dir, 'inventory-1440.json')) };
  const req = { 375: J(join(dir, 'requests-375.json')), 1440: J(join(dir, 'requests-1440.json')) };
  const axe = J(join(dir, 'axe-1440.json'));
  const axeM = J(join(dir, 'axe-375.json'));
  const i = inv[1440];
  const m = inv[375];
  const bytes = (log) => log.reduce((a, r) => a + (r.responseBodySize || 0), 0);
  const hosts = (log) => { const h = {}; for (const r of log) { h[r.host] = (h[r.host] || 0) + (r.responseBodySize || 0); } return Object.entries(h).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k}:${kb(v)}`).join(' '); };

  console.log(`\n## ${pg.slug}  (${i.title})  ${pg.path}`);
  console.log(`status ${i.httpStatus} | settle ${m.settleMs}/${inv[768].settleMs}/${i.settleMs} ms | docH ${m.viewport.docH}/${inv[768].viewport.docH}/${i.viewport.docH} | overflowX ${m.overflowX}/${inv[768].overflowX}/${i.overflowX} | html ${kb(i.perf.htmlDecoded)} | dcl ${i.perf.domContentLoaded} load ${i.perf.load}`);
  console.log(`requests 375:${req[375].length} 1440:${req[1440].length} | bytes 375:${kb(bytes(req[375]))} 1440:${kb(bytes(req[1440]))} | blocked non-GET ${req[1440].filter((r) => r.status === 'BLOCKED-NON-GET').length}`);
  console.log(`hosts@1440: ${hosts(req[1440])}`);
  const types = {}; for (const r of req[1440]) { types[r.resourceType] = types[r.resourceType] || { n: 0, b: 0 }; types[r.resourceType].n++; types[r.resourceType].b += r.responseBodySize || 0; }
  console.log(`types@1440: ${Object.entries(types).map(([k, v]) => `${k}:${v.n}/${kb(v.b)}`).join(' ')}`);
  const big = req[1440].filter((r) => r.responseBodySize > 200000).sort((a, b) => b.responseBodySize - a.responseBodySize).slice(0, 6);
  if (big.length) console.log(`largest: ${big.map((r) => `${kb(r.responseBodySize)} ${r.resourceType} ${short(r.url)}`).join(' ; ')}`);
  const bad = req[1440].filter((r) => typeof r.status === 'number' && r.status >= 400);
  if (bad.length) console.log(`4xx/5xx: ${bad.map((r) => `${r.status} ${short(r.url)}`).join(' ; ')}`);
  console.log(`meta: lang=${i.lang} desc="${i.metaDescription.slice(0, 90)}" og=${i.og.length} canonical=${i.canonical} favicon=${i.favicon} viewport="${i.viewportMeta}"`);
  console.log(`a11y: main=${i.hasMain} skip=${i.hasSkipLink} landmarks=${i.landmarks.map((l) => l.tag + (l.role ? '[' + l.role + ']' : '')).join(',') || 'none'} inline=${i.inlineStyleCount}/${i.totalEls} text=${i.bodyTextLength}`);
  console.log(`headings: ${i.headings.map((h) => `h${h.level}:${h.text.slice(0, 45)}${h.visible ? '' : '[hidden]'}`).join(' | ')}`);
  if (i.popup || m.popup) console.log(`popup: ${JSON.stringify(m.popup || i.popup).slice(0, 500)}`);
  const ext = i.links.filter((l) => l.kind === 'external' && l.visible);
  console.log(`links: ${i.links.length} total, ${i.links.filter((l) => l.visible).length} visible, ext ${[...new Set(ext.map((l) => short(l.href)))].join(' ')} | _blank ${i.links.filter((l) => l.target === '_blank').length} | aria-current ${i.links.filter((l) => l.ariaCurrent).length} | img-only/empty ${i.links.filter((l) => l.visible && (!l.text || l.text.startsWith('[img'))).length}`);
  const content = i.links.filter((l) => l.visible && !/^(Home|Our Legacy|History of|Executive Officers|Past Basilei|Lineage|Programs|Mandated|Scholarships|Upcoming|50th|Achievement|All Star|Youth|Gallery|20\d\d|2017-2020|News|Members|Contact Us|Seeking|Find Us|Learn More)/.test(l.text));
  console.log(`content links: ${content.map((l) => `"${l.text.slice(0, 35)}"->${short(l.href || '')}${l.target ? '[' + l.target + ']' : ''}`).join(' ; ').slice(0, 900)}`);
  console.log(`forms: ${JSON.stringify(i.forms).slice(0, 600)}`);
  console.log(`controls: ${i.controls.filter((c) => c.visible).map((c) => `${c.tag}${c.type ? '[' + c.type + ']' : ''}:${(c.text || c.name || c.placeholder).slice(0, 25)}${c.required ? '*' : ''} name="${c.accessibleName.slice(0, 30)}"`).join(' ; ').slice(0, 900)}`);
  console.log(`iframes: ${JSON.stringify(i.iframes).slice(0, 400)}`);
  if (i.videos.length) console.log(`videos: ${JSON.stringify(i.videos)}`);
  const imgs = i.images.filter((im) => im.visible);
  console.log(`images: ${i.images.length} in DOM, ${imgs.length} visible, no-alt ${i.images.filter((im) => !im.hasAlt).length}, empty-alt ${i.images.filter((im) => im.hasAlt && !im.alt).length}, srcset ${i.images.filter((im) => im.hasSrcset).length}, lazy ${i.images.filter((im) => im.loading === 'lazy').length}`);
  console.log(`image sizes: ${imgs.slice(0, 14).map((im) => `${im.naturalWidth}x${im.naturalHeight}->${im.renderedWidth}x${im.renderedHeight}`).join(' ')}`);
  console.log(`bg images: ${i.bgImages.length} ${i.bgImages.slice(0, 3).map((b) => `${b.w}x${b.h}`).join(' ')}`);
  console.log(`small text: ${JSON.stringify(m.small.slice(0, 6))} | tap<24 @375: ${m.tapTargets.length} ${JSON.stringify(m.tapTargets.slice(0, 5))}`);
  console.log(`fonts: ${i.fonts.join(', ')} | sheets ${i.styleSheets.length}`);
  const fw = i.focus;
  console.log(`focus@1440: ${fw.length} stops; no indicator ${fw.filter((f) => !f.visibleFocus).length}; hidden ${fw.filter((f) => f.hiddenByCss).length}; order: ${fw.map((f) => `${f.tag}:${((f.text || f.href || f.tag) + "").slice(0, 14)}${f.visibleFocus ? '' : '[NF]'}${f.hiddenByCss ? '[HID]' : ''}`).join(' > ').slice(0, 700)}`);
  console.log(`focus@375: ${m.focus.length} stops; hidden ${m.focus.filter((f) => f.hiddenByCss).length}; order: ${m.focus.map((f) => `${f.tag}:${((f.text || f.href || f.tag) + "").slice(0, 12)}${f.hiddenByCss ? '[HID]' : ''}`).join(' > ').slice(0, 400)}`);
  console.log(`interactions@1440: ${JSON.stringify(i.interactions).slice(0, 400)}`);
  console.log(`interactions@375: ${JSON.stringify(m.interactions).slice(0, 900)}`);
  console.log(`axe@1440: ${axe.violations.map((v) => `${v.id}[${v.impact}]x${v.nodeCount}`).join(', ')}`);
  console.log(`axe@375: ${axeM.violations.map((v) => `${v.id}[${v.impact}]x${v.nodeCount}`).join(', ')}`);
  console.log(`axe incomplete: ${axe.incomplete.map((v) => `${v.id}x${v.nodeCount}`).join(', ')}`);
  console.log(`console: ${i.console.length} msgs; ${[...new Set(i.console.map((c) => c.text.slice(0, 70)))].slice(0, 4).join(' | ')}`);
}
