// Does the registration/scholarship form appear at desktop widths in real Google Chrome (not headless shell)?
import { chromium } from 'playwright';
const targets = ['/ylc-registration', '/essay-contest-registration', '/scholarships', '/contact-us'];
for (const channel of ['chrome', null]) {
  const b = await chromium.launch(channel ? { channel } : {});
  for (const width of [1440, 1024, 768]) {
    const ctx = await b.newContext({ viewport: { width, height: 900 } });
    await ctx.route('**/*', (r) => (['GET', 'HEAD', 'OPTIONS'].includes(r.request().method()) ? r.continue() : r.abort()));
    const p = await ctx.newPage();
    for (const t of targets) {
      await p.goto('https://www.lambdaxi1911.com' + t, { waitUntil: 'load', timeout: 90000 });
      await p.waitForTimeout(2000); await p.keyboard.press('Escape').catch(() => {});
      await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } });
      await p.waitForTimeout(6000);
      const r = await p.evaluate(() => ({
        docH: document.documentElement.scrollHeight,
        iframes: [...document.querySelectorAll('iframe')].map((f) => (f.src || '').replace(/^https?:\/\//, '').slice(0, 50) + ' ' + Math.round(f.getBoundingClientRect().width) + 'x' + Math.round(f.getBoundingClientRect().height)),
        inputs: [...document.querySelectorAll('input,textarea,select')].filter((c) => c.getBoundingClientRect().height > 0 && c.type !== 'hidden').length,
        sections: [...document.querySelectorAll('.s-section')].map((s) => s.className.replace(/\s+/g, ' ').match(/s-(form|html|contact|embed|kit)[a-z-]*/g)?.join(',') || '').filter(Boolean),
      }));
      console.log(`${channel || 'headless-shell'} @${width} ${t}: docH ${r.docH} inputs ${r.inputs} iframes ${JSON.stringify(r.iframes)} sections ${JSON.stringify(r.sections)}`);
    }
    await ctx.close();
  }
  await b.close();
}
