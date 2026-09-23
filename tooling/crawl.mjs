// Read-only crawl of the live site. Captures screenshots, raw HTML, rendered DOM,
// request log, axe-core results, structural inventory, keyboard focus walk, and
// safe interaction states (menu open, submenu hover, first lightbox). Never submits.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..');
const manifest = JSON.parse(readFileSync(join(here, 'pages.json'), 'utf8'));
const INVENTORY = readFileSync(join(here, 'inventory.js'), 'utf8');
const FOCUS_WALK = readFileSync(join(here, 'focus-walk.js'), 'utf8');
const AXE = readFileSync(join(here, 'node_modules/axe-core/axe.min.js'), 'utf8');
const only = process.argv.slice(2);

const ALLOWED_METHODS = new Set(['GET', 'OPTIONS', 'HEAD']);

function attachNetworkLog(page, log) {
  page.on('request', (req) => {
    if (!ALLOWED_METHODS.has(req.method())) {
      // Third-party analytics beacons are aborted by the route below; anything else is a bug in this crawler.
      log.push({ method: req.method(), url: req.url(), status: 'BLOCKED-NON-GET', resourceType: req.resourceType() });
    }
  });
  page.on('response', async (res) => {
    const req = res.request();
    let sizes = {};
    try { sizes = await req.sizes(); } catch { /* not all requests expose sizes */ }
    log.push({
      method: req.method(), url: res.url().slice(0, 300), status: res.status(), resourceType: req.resourceType(),
      contentType: (res.headers()['content-type'] || '').slice(0, 60), responseBodySize: sizes.responseBodySize ?? null,
      host: new URL(res.url()).host,
    });
  });
  page.on('requestfailed', (req) => {
    log.push({ method: req.method(), url: req.url().slice(0, 300), status: 'FAILED', failure: req.failure()?.errorText, resourceType: req.resourceType(), host: new URL(req.url()).host });
  });
}

async function blockWrites(context) {
  // Look-only guarantee: any POST/PUT/PATCH/DELETE (analytics beacons, visit counters) is aborted before it leaves.
  await context.route('**/*', (route) => {
    if (ALLOWED_METHODS.has(route.request().method())) return route.continue();
    return route.abort();
  });
}

async function capturePopup(page, width, shotDir) {
  // Strikingly promo popup. Record it as evidence, then close it so the page itself can be audited.
  const wrap = page.locator('.s-kit-modal-wrap').first();
  if (!(await wrap.count()) || !(await wrap.isVisible().catch(() => false))) return null;
  await page.screenshot({ path: join(shotDir, `${width}-popup.png`), fullPage: false });
  const info = await page.evaluate(() => {
    const m = document.querySelector('.s-kit-modal');
    const close = document.querySelector('button.s-kit-modal-close');
    return {
      text: (m?.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 300),
      role: m?.getAttribute('role') || '', ariaModal: m?.getAttribute('aria-modal') || '', ariaLabel: m?.getAttribute('aria-label') || m?.getAttribute('aria-labelledby') || '',
      focusInside: !!m && m.contains(document.activeElement),
      closeButton: close ? { tag: close.tagName.toLowerCase(), label: close.getAttribute('aria-label') || close.innerText.trim(), w: Math.round(close.getBoundingClientRect().width), h: Math.round(close.getBoundingClientRect().height) } : null,
      links: [...(m?.querySelectorAll('a') || [])].map((a) => ({ text: a.innerText.trim().slice(0, 40), href: a.getAttribute('href') })),
      fields: [...(m?.querySelectorAll('input,select,textarea') || [])].map((c) => `${c.tagName.toLowerCase()}:${c.name || c.placeholder || c.type}`),
    };
  });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  info.closedByEscape = !(await wrap.isVisible().catch(() => false));
  if (!info.closedByEscape) await page.locator('button.s-kit-modal-close').first().click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(400);
  return info;
}

async function settle(page) {
  await page.waitForLoadState('load', { timeout: 60000 }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
  // Scroll through to trigger lazy-loaded media, then return to top.
  await page.evaluate(async () => {
    const step = Math.max(400, window.innerHeight * 0.7);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 300)); }
    window.scrollTo(0, 0);
  });
  // Strikingly mounts form and embed sections a few seconds after they first scroll into view.
  await page.waitForTimeout(6000);
  await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(800);
}

async function runAxe(page) {
  await page.addScriptTag({ content: AXE });
  return page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
      resultTypes: ['violations', 'incomplete'],
    });
    const slim = (list) => list.map((v) => ({
      id: v.id, impact: v.impact, tags: v.tags, help: v.help, helpUrl: v.helpUrl,
      nodes: v.nodes.slice(0, 20).map((n) => ({ target: n.target, html: n.html.slice(0, 300), summary: n.failureSummary?.slice(0, 400) })),
      nodeCount: v.nodes.length,
    }));
    return { violations: slim(r.violations), incomplete: slim(r.incomplete), testEngine: r.testEngine.version };
  });
}

async function focusWalk(page, maxTabs = 80) {
  const seen = [];
  await page.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement) document.activeElement.blur(); });
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate(FOCUS_WALK);
    if (f.tag === 'body' && i > 0) break;
    seen.push(f);
  }
  return seen;
}

async function perfMetrics(page) {
  return page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const res = performance.getEntriesByType('resource');
    const byType = {};
    for (const r of res) {
      const t = r.initiatorType || 'other';
      byType[t] = byType[t] || { count: 0, transfer: 0 };
      byType[t].count++; byType[t].transfer += r.transferSize || 0;
    }
    const hosts = {};
    for (const r of res) { const h = new URL(r.name).host; hosts[h] = (hosts[h] || 0) + (r.transferSize || 0); }
    const lcp = performance.getEntriesByType('largest-contentful-paint').pop();
    return {
      domContentLoaded: Math.round(nav?.domContentLoadedEventEnd || 0), load: Math.round(nav?.loadEventEnd || 0),
      htmlTransfer: nav?.transferSize || 0, htmlDecoded: nav?.decodedBodySize || 0,
      transferTotal: res.reduce((a, r) => a + (r.transferSize || 0), 0) + (nav?.transferSize || 0),
      requestCount: res.length + 1, byType, hosts, lcpMs: lcp ? Math.round(lcp.startTime) : null,
    };
  });
}

async function navStructure(page) {
  return page.evaluate(() => {
    const nav = document.querySelector('ul.s-nav');
    if (!nav) return null;
    return [...nav.children].map((li) => {
      const a = li.querySelector(':scope > a, :scope > div > a, :scope > * > a, a');
      const subs = [...li.querySelectorAll('ul a')];
      const cs = a ? getComputedStyle(a) : null;
      return {
        text: (li.querySelector('a,span')?.innerText || '').trim().replace(/\s+/g, ' ').split('\n')[0].slice(0, 40),
        href: a?.getAttribute('href') || null, tag: a ? a.tagName.toLowerCase() : null, tabindex: a?.getAttribute('tabindex') ?? null,
        ariaHaspopup: a?.getAttribute('aria-haspopup') || li.querySelector('[aria-haspopup]')?.getAttribute('aria-haspopup') || '',
        ariaExpanded: li.querySelector('[aria-expanded]')?.getAttribute('aria-expanded') ?? null,
        color: cs?.color, fontSize: cs?.fontSize,
        children: subs.map((s) => ({ text: s.innerText.trim().slice(0, 40), href: s.getAttribute('href'), target: s.getAttribute('target') || '' })),
      };
    });
  });
}

async function interactionShots(page, slug, width, shotDir) {
  const notes = {};
  if (width === 375) {
    const toggle = page.locator('.s-mobile-nav-bar, .navbar-toggle, button[aria-label*="menu" i], [class*="hamburger"]').first();
    if (await toggle.count() && await toggle.isVisible().catch(() => false)) {
      notes.toggle = await toggle.evaluate((el) => ({ tag: el.tagName.toLowerCase(), role: el.getAttribute('role'), tabindex: el.getAttribute('tabindex'), ariaLabel: el.getAttribute('aria-label'), ariaExpanded: el.getAttribute('aria-expanded'), w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) }));
      await toggle.click({ timeout: 5000 });
      await page.waitForTimeout(700);
      await page.screenshot({ path: join(shotDir, `${width}-menu-open.png`), fullPage: false });
      notes.mobileMenu = await page.evaluate(() => {
        const items = [...document.querySelectorAll('.navbar-drawer .navbar-drawer-item, .navbar-drawer a')].filter((a) => a.getBoundingClientRect().height > 0);
        return items.map((a) => ({ tag: a.tagName.toLowerCase(), text: a.innerText.trim().replace(/\s+/g, ' ').split('\n')[0].slice(0, 40), href: a.getAttribute('href'), h: Math.round(a.getBoundingClientRect().height), dropdown: a.classList.contains('navbar-drawer-dropdown') }));
      });
      // Does a drawer dropdown expand on tap?
      const dd = page.locator('.navbar-drawer .navbar-drawer-dropdown').first();
      if (await dd.count()) {
        await dd.click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(500);
        await page.screenshot({ path: join(shotDir, `${width}-menu-dropdown-open.png`), fullPage: false });
        notes.drawerDropdownLinks = await page.evaluate(() => [...document.querySelectorAll('.navbar-drawer a')].filter((a) => a.getBoundingClientRect().height > 0).length);
      }
      await page.keyboard.press('Escape').catch(() => {});
      await toggle.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(300);
    } else {
      notes.mobileMenu = 'no toggle found';
    }
  }
  if (width === 1440) {
    const parent = page.locator('.s-nav li:has(ul), nav li:has(ul)').first();
    if (await parent.count()) {
      await parent.hover({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(500);
      await page.screenshot({ path: join(shotDir, `${width}-submenu-hover.png`), fullPage: false });
      notes.submenuVisibleOnHover = await page.evaluate(() => { const ul = document.querySelector('.s-nav li ul, nav li ul'); if (!ul) return null; const cs = getComputedStyle(ul); const r = ul.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' && r.height > 0; });
      await page.mouse.move(0, 0);
    }
    // Keyboard: does focusing the parent reveal the submenu?
    await page.evaluate(() => { const a = document.querySelector('.s-nav li:has(ul) > a, nav li:has(ul) > a'); a?.focus(); });
    await page.waitForTimeout(300);
    notes.submenuVisibleOnFocus = await page.evaluate(() => { const ul = document.querySelector('.s-nav li ul, nav li ul'); if (!ul) return null; const cs = getComputedStyle(ul); return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' && ul.getBoundingClientRect().height > 0; });
  }
  if (slug.startsWith('gallery') && width === 1440) {
    const first = page.locator('.s-gallery-item a, .s-gallery-item img, .s-gallery-item').first();
    if (await first.count()) {
      await first.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
      await first.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1200);
      await page.screenshot({ path: join(shotDir, `${width}-lightbox.png`), fullPage: false });
      notes.lightbox = await page.evaluate(() => {
        const lb = document.querySelector('.s-lightbox, .lightbox, [class*="lightbox"], .pswp, .mfp-wrap, [role=dialog]');
        if (!lb) return { found: false };
        const cs = getComputedStyle(lb);
        return { found: cs.display !== 'none' && cs.visibility !== 'hidden', cls: lb.className.slice(0, 80), role: lb.getAttribute('role'), ariaModal: lb.getAttribute('aria-modal'), focusInside: lb.contains(document.activeElement), closeButtons: [...lb.querySelectorAll('button, a, [role=button]')].map((b) => (b.getAttribute('aria-label') || b.innerText || b.className).trim().slice(0, 40)).slice(0, 6) };
      });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
      notes.lightboxClosedByEscape = await page.evaluate(() => { const lb = document.querySelector('.s-lightbox, .lightbox, [class*="lightbox"], .pswp, .mfp-wrap, [role=dialog]'); return !lb || getComputedStyle(lb).display === 'none' || getComputedStyle(lb).visibility === 'hidden'; });
    }
  }
  return notes;
}

async function crawlPage(browser, pageDef) {
  const url = manifest.base + pageDef.path;
  const dir = join(OUT, pageDef.slug);
  const shotDir = join(dir, 'screenshots');
  const srcDir = join(dir, 'source');
  mkdirSync(shotDir, { recursive: true });
  mkdirSync(srcDir, { recursive: true });
  const result = { slug: pageDef.slug, url, widths: {} };

  for (const width of manifest.widths) {
    const context = await browser.newContext({ viewport: { width, height: width < 768 ? 812 : 900 }, deviceScaleFactor: 1, colorScheme: 'light', isMobile: width < 768, hasTouch: width < 768 });
    await blockWrites(context);
    const page = await context.newPage();
    const log = [];
    const consoleMsgs = [];
    attachNetworkLog(page, log);
    page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) consoleMsgs.push({ type: m.type(), text: m.text().slice(0, 300) }); });
    page.on('pageerror', (e) => consoleMsgs.push({ type: 'pageerror', text: String(e).slice(0, 300) }));

    const t0 = Date.now();
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForLoadState('load', { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(2500);
    const popup = await capturePopup(page, width, shotDir);
    await settle(page);
    const settleMs = Date.now() - t0;

    await page.screenshot({ path: join(shotDir, `${width}-fold.png`), fullPage: false });
    await page.screenshot({ path: join(shotDir, `${width}-full.png`), fullPage: true });

    const inventory = await page.evaluate(INVENTORY);
    const perf = await perfMetrics(page);
    const nav = width === 1440 ? await navStructure(page) : null;
    const focus = width === 1440 ? await focusWalk(page) : (width === 375 ? await focusWalk(page, 40) : []);
    const axe = await runAxe(page);
    const interactions = await interactionShots(page, pageDef.slug, width, shotDir).catch((e) => ({ error: e.message.split('\n')[0] }));

    if (width === 1440) {
      writeFileSync(join(srcDir, 'dom.html'), await page.content());
      const raw = await context.request.get(url);
      writeFileSync(join(srcDir, 'raw.html'), await raw.text());
      if (nav) writeFileSync(join(srcDir, 'nav.json'), JSON.stringify(nav, null, 2));
    }
    writeFileSync(join(srcDir, `requests-${width}.json`), JSON.stringify(log, null, 2));
    writeFileSync(join(srcDir, `axe-${width}.json`), JSON.stringify(axe, null, 2));
    writeFileSync(join(srcDir, `inventory-${width}.json`), JSON.stringify({ ...inventory, perf, settleMs, httpStatus: resp?.status(), console: consoleMsgs, focus, interactions, popup }, null, 2));

    const nonGet = log.filter((r) => r.status === 'BLOCKED-NON-GET').length;
    result.widths[width] = {
      httpStatus: resp?.status(), settleMs, overflowX: inventory.overflowX, docH: inventory.viewport.docH,
      requests: log.length, blockedNonGet: nonGet, transferKB: Math.round(perf.transferTotal / 1024),
      axeViolations: axe.violations.map((v) => `${v.id}(${v.nodeCount})`), console: consoleMsgs.length,
      focusStops: focus.length, focusWithoutIndicator: focus.filter((f) => !f.visibleFocus).length,
    };
    await context.close();
    console.log(`[${pageDef.slug}@${width}] ${resp?.status()} settle ${settleMs}ms, ${log.length} req (${nonGet} non-GET blocked), ${Math.round(perf.transferTotal / 1024)}KB, overflowX ${inventory.overflowX}, axe ${axe.violations.length} rule(s)`);
  }
  writeFileSync(join(dir, 'summary.json'), JSON.stringify(result, null, 2));
  return result;
}

const browser = await chromium.launch();
const results = [];
for (const p of manifest.pages) {
  if (only.length && !only.includes(p.slug)) continue;
  try { results.push(await crawlPage(browser, p)); }
  catch (e) { console.log(`[${p.slug}] ERROR ${e.message.split('\n')[0]}`); results.push({ slug: p.slug, error: e.message }); }
}
await browser.close();
writeFileSync(join(OUT, 'tooling', `crawl-summary${only.length ? '-' + only.join('_') : ''}.json`), JSON.stringify(results, null, 2));
console.log('done');
