// Imports gallery photos into the repo: images/gallery/<year>/<id>-t.jpg (thumbnail) and
// <id>-v.jpg (large view), fetched from the current host's image service with size transforms.
// Resumable: existing files are skipped. GET only.
// Usage: node gallery-import.mjs [--thumb=400] [--view=1200] [--quality=auto:good] [--only=2025] [--views=no]
import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
const THUMB = Number(args.thumb || 400), VIEW = Number(args.view || 1200), Q = args.quality || 'auto:good';
const ONLY = args.only, VIEWS = args.views !== 'no', CONCURRENCY = Number(args.concurrency || 6);
const CDN = 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload';
const data = JSON.parse(readFileSync(join(here, 'mock-src', 'data', 'gallery.json'), 'utf8'));

const jobs = [];
for (const y of data) {
  if (ONLY && y.year !== ONLY) continue;
  const dir = join(ROOT, 'images', 'gallery', y.year);
  mkdirSync(dir, { recursive: true });
  for (const a of y.albums) for (const p of a.photos) {
    jobs.push({ url: `${CDN}/c_limit,w_${THUMB},h_${THUMB},q_${Q},f_jpg/1312902/${p.id}.${p.ext}`, out: join(dir, `${p.id}-t.jpg`) });
    if (VIEWS) jobs.push({ url: `${CDN}/c_limit,w_${VIEW},h_${VIEW},q_${Q},f_jpg/1312902/${p.id}.${p.ext}`, out: join(dir, `${p.id}-v.jpg`) });
  }
}
const pending = jobs.filter((j) => !existsSync(j.out) || statSync(j.out).size === 0);
console.log(`${jobs.length} files planned, ${pending.length} to fetch (thumb ${THUMB}px, view ${VIEWS ? VIEW + 'px' : 'skipped'}, quality ${Q})`);

let done = 0, bytes = 0, failed = [];
async function worker() {
  while (pending.length) {
    const j = pending.shift();
    try {
      const res = await fetch(j.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(j.out, buf);
      bytes += buf.length; done++;
      if (done % 100 === 0) console.log(`${done} fetched, ${(bytes / 1048576).toFixed(1)} MB so far`);
    } catch (e) { failed.push(`${j.url} ${e.message}`); }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`done: ${done} files, ${(bytes / 1048576).toFixed(1)} MB fetched this run, ${failed.length} failed`);
if (failed.length) { writeFileSync(join(here, 'gallery-import-failed.txt'), failed.join('\n')); console.log('failures listed in gallery-import-failed.txt'); }
