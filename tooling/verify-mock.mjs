// Verifies a built mock: axe-core at 375, 768 and 1440 in light and dark, horizontal overflow,
// keyboard focus walk (menu reachable, focus visible), theme persistence, and screenshots.
// Usage: node verify-mock.mjs <slug>   (reads <slug>/mock/<slug>-mock.html)
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');
const slug = process.argv[2];
if (!slug) { console.error('usage: node verify-mock.mjs <slug>'); process.exit(2); }
// Serve the repo root over HTTP so axe can read the stylesheets (file:// blocks that with CORS).
import { spawn } from 'node:child_process';
const PORT = 8765;
const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
process.on('exit', () => server.kill());
const url = `http://127.0.0.1:${PORT}/${slug}/mock/${slug}-mock.html`;
const AXE = readFileSync(join(here, 'node_modules/axe-core/axe.min.js'), 'utf8');
const FOCUS_WALK = readFileSync(join(here, 'focus-walk.js'), 'utf8');
const shotDir = join(ROOT, slug, 'mock', 'screenshots');
mkdirSync(shotDir, { recursive: true });

const browser = await chromium.launch();
const results = { slug, url, widths: {} };
let failures = 0;

for (const width of [320, 375, 768, 1280, 1440]) {
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 812 : 900 }, colorScheme: scheme });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(600);

    const overflowX = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await page.addScriptTag({ content: AXE });
    const axe = await page.evaluate(async () => {
      const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
      return { violations: r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => ({ target: n.target.join(' '), summary: (n.failureSummary || '').slice(0, 200) })) })), incomplete: r.incomplete.map((v) => `${v.id}(${v.nodes.length})`) };
    });
    await page.screenshot({ path: join(shotDir, `${width}-${scheme}-full.png`), fullPage: true });

    // Keyboard: walk the whole page; record stops without a visible indicator and whether the dropdown opens.
    await page.evaluate(() => window.scrollTo(0, 0));
    const stops = [];
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press('Tab');
      const f = await page.evaluate(FOCUS_WALK);
      if (f.tag === 'body' && i > 0) break;
      stops.push(f);
    }
    const noIndicator = stops.filter((s) => !s.visibleFocus);
    // Open the first dropdown with the keyboard and read its state.
    const dropdown = await page.evaluate(() => {
      const btn = document.querySelector('.nav__item--has-menu > button');
      if (!btn) return { present: false };
      btn.focus();
      return { present: true, expandedBefore: btn.getAttribute('aria-expanded') };
    });
    if (dropdown.present) {
      // At mobile widths the nav is hidden until the menu button opens it.
      if (width < 901) { await page.locator('[data-menu-toggle]').click(); await page.waitForTimeout(200); }
      await page.locator('.nav__item--has-menu > button').first().focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);
      dropdown.expandedAfter = await page.evaluate(() => document.querySelector('.nav__item--has-menu > button').getAttribute('aria-expanded'));
      dropdown.focusInMenu = await page.evaluate(() => !!document.activeElement.closest('.nav__menu'));
      if (width < 901) { await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({ path: join(shotDir, `${width}-${scheme}-menu-open.png`) }); }
      await page.keyboard.press('Escape');
      dropdown.closedByEscape = await page.evaluate(() => document.querySelector('.nav__item--has-menu > button').getAttribute('aria-expanded') === 'false');
    }

    const summary = { theme, overflowX, axeViolations: axe.violations.length, axeIds: axe.violations.map((v) => `${v.id}(${v.nodes.length})`), incomplete: axe.incomplete, focusStops: stops.length, focusWithoutIndicator: noIndicator.map((s) => `${s.tag}:${s.text}`), dropdown, errors };
    results.widths[`${width}-${scheme}`] = summary;
    if (overflowX > 0 || axe.violations.length || noIndicator.length || errors.length || (dropdown.present && (dropdown.expandedAfter !== 'true' || !dropdown.focusInMenu || !dropdown.closedByEscape))) failures++;
    console.log(`[${slug}@${width} ${scheme}] theme=${theme} overflow=${overflowX} axe=${summary.axeIds.join(',') || 'clean'} focusStops=${stops.length} noIndicator=${noIndicator.length} dropdown=${JSON.stringify(dropdown)} errors=${errors.length}`);
    if (axe.violations.length) for (const v of axe.violations) console.log('   ', v.id, v.impact, v.nodes.slice(0, 3).map((n) => n.target).join(' | '));
    await ctx.close();
  }
}

// Theme persistence: choose Dark, reload, expect dark regardless of OS scheme.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.locator('[data-theme-toggle] input[value="dark"]').check({ force: true });
  await page.reload({ waitUntil: 'load' });
  const afterReload = await page.evaluate(() => [document.documentElement.getAttribute('data-theme'), document.querySelector('[data-theme-toggle] input:checked').value]);
  await page.locator('[data-theme-toggle] input[value="system"]').check({ force: true });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForTimeout(200);
  const systemDark = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  await page.emulateMedia({ colorScheme: 'light' });
  await page.waitForTimeout(200);
  const systemLight = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  results.themePersistence = { afterReload, systemDark, systemLight };
  const ok = afterReload[0] === 'dark' && afterReload[1] === 'dark' && systemDark === 'dark' && systemLight === 'light';
  if (!ok) failures++;
  console.log(`[theme] persisted after reload: ${afterReload.join('/')}; system follows OS: dark=${systemDark} light=${systemLight} ${ok ? 'OK' : 'FAIL'}`);
  await ctx.close();
}

await browser.close();
writeFileSync(join(ROOT, slug, 'mock', 'verify.json'), JSON.stringify(results, null, 2));
console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
process.exit(failures ? 1 : 0);
