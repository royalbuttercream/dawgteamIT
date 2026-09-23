// Merges the configuration's full album lists into gallery.json where they are longer than what
// the rendered page exposed, and reports the result per album.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');
const html = readFileSync(join(ROOT, 'gallery-2022', 'source', 'raw.html'), 'utf8');
const anchor = html.indexOf('"pages":['); const start = html.lastIndexOf('={', anchor) + 1;
let depth = 0, end = start, inStr = false, esc = false;
for (let i = start; i < html.length; i++) { const c = html[i]; if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; } if (c === '"') inStr = true; else if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) { end = i + 1; break; } } }
const pages = JSON.parse(html.slice(start, end)).pageData.pages;
const strip = (v) => (v || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
const norm = (t) => strip(t).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const cfgAlbums = {};
for (const p of pages) {
  const path = p.path || p.name || '';
  for (const sec of p.sections || []) {
    const comps = sec.components || {};
    const gal = Object.values(comps).find((c) => c && c.type === 'Gallery' && Array.isArray(c.sources) && c.sources.length);
    if (!gal) continue;
    const title = strip(Object.values(comps).find((c) => c && c.type === 'RichText' && strip(c.value))?.value);
    (cfgAlbums[path] = cfgAlbums[path] || []).push({ title, photos: gal.sources.filter((s) => s.storageKey).map((s) => ({ id: s.storageKey.split('/').pop(), ext: (s.format || 'jpg').toLowerCase(), w: s.w, h: s.h, caption: strip(s.caption), description: strip(s.description) })) });
  }
}
const data = JSON.parse(readFileSync(join(here, 'mock-src', 'data', 'gallery.json'), 'utf8'));
for (const y of data) {
  for (const a of y.albums) {
    const c = (cfgAlbums[y.path] || []).find((x) => norm(x.title) === norm(a.title));
    if (c && c.photos.length > a.photos.length) {
      console.log(`${y.year} ${a.title}: page showed ${a.photos.length}, configuration has ${c.photos.length}; using configuration`);
      a.photos = c.photos; a.count = c.photos.length; a.source = 'configuration';
    } else a.source = 'page';
  }
  y.count = y.albums.reduce((s, a) => s + a.count, 0);
}
writeFileSync(join(here, 'mock-src', 'data', 'gallery.json'), JSON.stringify(data, null, 1));
for (const y of data) console.log(`${y.year}: ${y.albums.map((a) => `${a.title} (${a.count}, ${a.source})`).join('; ')} = ${y.count}`);
console.log('total', data.reduce((s, y) => s + y.count, 0), 'photos;', data.reduce((s, y) => s + y.albums.reduce((b, a) => b + a.photos.filter((p) => p.caption || p.description).length, 0), 0), 'captioned');
