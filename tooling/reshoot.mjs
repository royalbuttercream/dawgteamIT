// Re-captures only the full-page screenshots with a slow scroll so that the theme's
// animate-on-scroll sections (opacity 0 until in view) are rendered before capture.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..');
const manifest = JSON.parse(readFileSync(join(here, 'pages.json'), 'utf8'));
const only = process.argv.slice(2);
const ALLOWED = new Set(['GET', 'HEAD', 'OPTIONS']);

const browser = await chromium.launch();
for (const p of manifest.pages) {
  if (only.length && !only.includes(p.slug)) continue;
  for (const width of manifest.widths) {
    const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 812 : 900 }, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
    await ctx.route('**/*', (r) => (ALLOWED.has(r.request().method()) ? r.continue() : r.abort()));
    const page = await ctx.newPage();
    try {
      await page.goto(manifest.base + p.path, { waitUntil: 'load', timeout: 90000 });
      // The theme's promo popup fires several seconds after load; wait for it, then close it.
      const closePopup = async () => {
        const wrap = page.locator('.s-kit-modal-wrap').first();
        if (await wrap.count() && await wrap.isVisible().catch(() => false)) { await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
      };
      await page.waitForTimeout(8000);
      await closePopup();
      // Slow scroll so every section's in-view animation has fired.
      await page.evaluate(async () => {
        const step = Math.round(window.innerHeight * 0.6);
        let y = 0;
        while (y < document.documentElement.scrollHeight) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 350)); y += step; }
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((r) => setTimeout(r, 600));
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(5000);
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(800);
      await page.waitForTimeout(2000);
      await closePopup();
      await page.screenshot({ path: join(OUT, p.slug, 'screenshots', `${width}-full.png`), fullPage: true });
      console.log(`[${p.slug}@${width}] reshot`);
    } catch (e) {
      console.log(`[${p.slug}@${width}] ERROR ${e.message.split('\n')[0]}`);
    }
    await ctx.close();
  }
}
await browser.close();
console.log('done');
