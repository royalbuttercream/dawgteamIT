// Clicks every "Show more" on a gallery page and records the requests it triggers and the per-album counts.
import { chromium } from 'playwright';
const path = process.argv[2] || '/2021';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route('**/*', (r) => (['GET', 'HEAD', 'OPTIONS'].includes(r.request().method()) ? r.continue() : r.abort()));
const p = await ctx.newPage();
const reqs = [];
p.on('request', (r) => { if (/lambdaxi1911\.com\/(r\/|s\/|api|show|more|gallery|section)/i.test(r.url()) && !/popups|ecommerce|portfolio|membership/.test(r.url())) reqs.push(r.method() + ' ' + r.url().slice(0, 160)); });
await p.goto('https://www.lambdaxi1911.com' + path, { waitUntil: 'load' });
await p.waitForTimeout(6000); await p.keyboard.press('Escape');
for (let i = 0; i < 40; i++) {
  const more = p.locator('a.more-link:visible').first();
  if (!(await more.count())) break;
  await more.scrollIntoViewIfNeeded(); await more.click({ timeout: 5000 }).catch(() => {}); await p.waitForTimeout(1500);
}
const counts = await p.evaluate(() => [...document.querySelectorAll('.s-section')].filter((s) => s.querySelector('.s-gallery-item')).map((s) => ({ title: (s.querySelector('h1,h2,h3')?.innerText || '').trim(), items: s.querySelectorAll('.s-gallery-item').length, more: !!s.querySelector('a.more-link:not([style*="display: none"])') })));
console.log(JSON.stringify({ path, counts, reqs }, null, 1));
await b.close();
