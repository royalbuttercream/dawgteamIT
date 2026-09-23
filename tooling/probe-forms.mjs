// Verify whether the Strikingly forms render at desktop width given more time, and inventory their fields.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const pages = ['scholarships', 'essay-contest-registration', 'ylc-registration', 'contact-us', 'gallery-2017-2020'];
const b = await chromium.launch();
for (const slug of pages) {
  for (const width of [1440, 375]) {
    const ctx = await b.newContext({ viewport: { width, height: width < 768 ? 812 : 900 }, isMobile: width < 768, hasTouch: width < 768 });
    await ctx.route('**/*', (r) => (['GET', 'HEAD', 'OPTIONS'].includes(r.request().method()) ? r.continue() : r.abort()));
    const p = await ctx.newPage();
    const t0 = Date.now();
    await p.goto('https://www.lambdaxi1911.com/' + (slug.startsWith('gallery') ? slug.replace('gallery-', '') : slug), { waitUntil: 'load', timeout: 90000 });
    await p.waitForTimeout(2000);
    await p.keyboard.press('Escape').catch(() => {});
    // Wait up to 25 s for a form field or gallery item to appear.
    let appearedAt = null;
    try { await p.waitForSelector('form input, form textarea, .s-gallery-item img, .show-more, [class*="show-more"]', { timeout: 25000 }); appearedAt = Date.now() - t0; } catch {}
    await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 200)); } });
    await p.waitForTimeout(3000);
    const info = await p.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const forms = [...document.querySelectorAll('form')].map((f) => ({
        fields: [...f.querySelectorAll('input,select,textarea,[role=combobox],[role=listbox]')].filter((c) => c.type !== 'hidden').map((c) => {
          const lab = c.id ? document.querySelector(`label[for="${CSS.escape(c.id)}"]`) : null;
          const wrap = c.closest('.form-item, .s-form-item, [class*="form-item"], [class*="field"]');
          const labelText = (lab?.innerText || wrap?.querySelector('label, .s-form-label, [class*="label"]')?.innerText || '').trim().replace(/\s+/g, ' ');
          return `${c.tagName.toLowerCase()}[${c.type || c.getAttribute('role') || ''}] name=${c.name || c.id || ''} ph="${c.placeholder || ''}" label="${labelText.slice(0, 40)}" req=${c.required || c.getAttribute('aria-required') === 'true' || /\*/.test(labelText)} vis=${vis(c)}`;
        }),
        buttons: [...f.querySelectorAll('button')].map((b) => b.innerText.trim()),
        hcaptcha: !!f.querySelector('[class*="captcha"], iframe[src*="hcaptcha"]'),
        upload: !!f.querySelector('input[type=file], [class*="upload"]'),
        text: f.innerText.replace(/\s+/g, ' ').slice(0, 500),
      }));
      const galleryItems = document.querySelectorAll('.s-gallery-item').length;
      const galleryImgs = [...document.querySelectorAll('.s-gallery-item img')].filter((i) => i.naturalWidth > 0).length;
      const showMore = [...document.querySelectorAll('a,button,div')].find((el) => /show more/i.test(el.innerText || '') && el.children.length === 0);
      return { forms, galleryItems, galleryImgs, showMore: showMore ? showMore.tagName + '.' + showMore.className : null, h1s: [...document.querySelectorAll('h1,h2')].filter(vis).map((h) => h.innerText.trim().slice(0, 40)) };
    });
    console.log(`\n## ${slug}@${width} fieldAppearedAtMs=${appearedAt}`);
    console.log(JSON.stringify(info, null, 1).slice(0, 3000));
    mkdirSync(`../${slug}/screenshots`, { recursive: true });
    await p.screenshot({ path: `../${slug}/screenshots/${width}-form-late.png`, fullPage: true });
    await ctx.close();
  }
}
await b.close();
