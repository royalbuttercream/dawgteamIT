// Captures the built mock in real Google Chrome (not the headless shell) for the sign-off record.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const slug = process.argv[2] || 'home';
const server = spawn('python3', ['-m', 'http.server', '8766', '--bind', '127.0.0.1'], { cwd: new URL('..', import.meta.url).pathname, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const b = await chromium.launch({ channel: 'chrome' });
for (const [w, h] of [[1440, 900], [375, 812]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(`http://127.0.0.1:8766/${slug}/mock/${slug}-mock.html`, { waitUntil: 'networkidle' });
  await p.screenshot({ path: `../${slug}/mock/screenshots/${w}-chrome-fold.png` });
  console.log(`chrome ${w}: ${await p.evaluate(() => navigator.userAgent.match(/Chrome\/[\d.]+/)[0])}, theme ${await p.evaluate(() => document.documentElement.dataset.theme)}`);
  await p.close();
}
await b.close(); server.kill();
