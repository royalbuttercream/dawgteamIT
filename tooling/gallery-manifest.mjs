// Builds mock-src/data/gallery.json: for each live gallery year page, loads the page, expands every
// "Show more", reads the albums in page order with their photo ids and any alt text, then merges
// captions and descriptions from the inlined site configuration where an id matches.
// Read-only: GET requests only; the popup is dismissed with Escape.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');
const YEARS = [['2025', '/2025'], ['2024', '/2024'], ['2023', '/2023'], ['2022', '/2022'], ['2021', '/2021'], ['2017-2020', '/2017-2020']];

const html = readFileSync(join(ROOT, 'gallery-2022', 'source', 'raw.html'), 'utf8');
const anchor = html.indexOf('"pages":[');
const start = html.lastIndexOf('={', anchor) + 1;
let depth = 0, end = start, inStr = false, esc = false;
for (let i = start; i < html.length; i++) {
  const c = html[i];
  if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
  if (c === '"') inStr = true; else if (c === '{') depth++; else if (c === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
}
const cfg = JSON.parse(html.slice(start, end));
const strip = (v) => (v || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
const meta = new Map();
const walk = (o) => {
  if (!o || typeof o !== 'object') return;
  if (Array.isArray(o)) { o.forEach(walk); return; }
  if (o.type === 'Gallery' && Array.isArray(o.sources)) for (const s of o.sources) if (s.storageKey) meta.set(s.storageKey.split('/').pop(), { caption: strip(s.caption), description: strip(s.description), w: s.w, h: s.h, ext: (s.format || '').toLowerCase() });
  Object.values(o).forEach(walk);
};
walk(cfg.pageData);
console.log(`configuration: ${meta.size} photos with metadata, ${[...meta.values()].filter((m) => m.caption || m.description).length} captioned`);

const browser = await chromium.launch();
const out = [];
for (const [year, path] of YEARS) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route('**/*', (r) => (['GET', 'HEAD', 'OPTIONS'].includes(r.request().method()) ? r.continue() : r.abort()));
  const page = await ctx.newPage();
  await page.goto('https://www.lambdaxi1911.com' + path, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(7000);
  await page.keyboard.press('Escape');
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } });
  await page.waitForTimeout(3000);
  for (let i = 0; i < 60; i++) {
    const more = page.locator('a.more-link:visible').first();
    if (!(await more.count())) break;
    await more.scrollIntoViewIfNeeded().catch(() => {});
    await more.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1200);
  }
  const albums = await page.evaluate(() => {
    const idOf = (u) => { const m = /\/1312902\/([\w-]+)\.(jpe?g|png|webp|gif)/i.exec(u || ''); return m ? { id: m[1], ext: m[2].toLowerCase() } : null; };
    return [...document.querySelectorAll('.s-section')].filter((s) => s.querySelector('.s-gallery-item')).map((s) => {
      const title = (s.querySelector('h1, h2, h3')?.textContent || '').trim().replace(/\s+/g, ' ');
      const seen = new Set(); const photos = [];
      for (const item of s.querySelectorAll('.s-gallery-item')) {
        const a = item.querySelector('a[href]'); const img = item.querySelector('img');
        const bg = item.querySelector('[style*="background-image"]');
        const bgUrl = bg ? /url\(["']?([^"')]+)/.exec(bg.getAttribute('style'))?.[1] : null;
        const ref = idOf(a?.getAttribute('href')) || idOf(img?.getAttribute('data-src')) || idOf(img?.getAttribute('src')) || idOf(bgUrl);
        if (!ref || seen.has(ref.id)) continue;
        seen.add(ref.id);
        const alt = (img?.getAttribute('alt') || '').trim();
        photos.push({ id: ref.id, ext: ref.ext, alt: alt === 'Thumbnail Gallery' ? '' : alt });
      }
      return { title, photos };
    });
  });
  const merged = albums.map((a) => ({
    title: a.title || 'Album', count: a.photos.length,
    photos: a.photos.map((p) => { const m = meta.get(p.id) || {}; return { id: p.id, ext: m.ext || p.ext, w: m.w, h: m.h, caption: m.caption || p.alt || '', description: m.description || '' }; }),
  }));
  out.push({ year, path, albums: merged, count: merged.reduce((s, a) => s + a.count, 0) });
  console.log(`${year}: ${merged.map((a) => `${a.title} (${a.count})`).join('; ')} = ${merged.reduce((s, a) => s + a.count, 0)}`);
  await ctx.close();
}
await browser.close();
writeFileSync(join(here, 'mock-src', 'data', 'gallery.json'), JSON.stringify(out, null, 1));
const total = out.reduce((a, y) => a + y.count, 0);
const captioned = out.reduce((a, y) => a + y.albums.reduce((b, al) => b + al.photos.filter((p) => p.caption || p.description).length, 0), 0);
console.log(`total ${total} photos in ${out.reduce((a, y) => a + y.albums.length, 0)} albums; ${captioned} with a caption`);
