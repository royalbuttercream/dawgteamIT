// Keyboard test of the gallery lightbox and the Show more control on a built year page.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const slug = process.argv[2] || 'gallery-2022';
const server = spawn('python3', ['-m', 'http.server', '8767', '--bind', '127.0.0.1'], { cwd: new URL('..', import.meta.url).pathname, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto(`http://127.0.0.1:8767/${slug}/mock/${slug}-mock.html`, { waitUntil: 'load' });
const first = p.locator('a.photo').first();
await first.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
const s1 = await p.evaluate(() => { const lb = document.getElementById('lightbox'); return { open: lb.open === true, focusInside: lb.contains(document.activeElement), caption: document.getElementById('lightbox-caption').textContent, src: document.getElementById('lightbox-img').src.slice(-40) }; });
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(200);
const s2 = await p.evaluate(() => document.getElementById('lightbox-caption').textContent);
await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
const trapped = await p.evaluate(() => document.getElementById('lightbox').contains(document.activeElement));
await p.keyboard.press('Escape'); await p.waitForTimeout(200);
const s3 = await p.evaluate(() => ({ closed: document.getElementById('lightbox').open === false, focusBackOnLink: document.activeElement.classList.contains('photo') }));
const more = p.locator('[data-show-more]').first();
const before = await p.evaluate(() => document.querySelectorAll('.album-section:first-of-type .photo-grid li:not([hidden])').length);
if (await more.count()) { await more.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(200); }
const after = await p.evaluate(() => ({ visible: document.querySelectorAll('.album-section:first-of-type .photo-grid li:not([hidden])').length, label: document.querySelector('[data-show-more]')?.textContent, focusOnPhoto: document.activeElement.classList.contains('photo') }));
console.log(JSON.stringify({ openWithEnter: s1, afterArrowRight: s2, focusTrapped: trapped, afterEscape: s3, showMore: { before, ...after } }, null, 1));
await b.close(); server.kill();
