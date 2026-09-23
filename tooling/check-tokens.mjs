// Verifies every text and UI colour pair used by the mocks against WCAG 2.2 AA
// (4.5:1 text, 3:1 large text and UI) for both themes. Exit code 1 on any failure.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, 'mock-src', 'tokens.css'), 'utf8');

function block(selector) {
  const m = new RegExp(selector.replace(/[[\]]/g, '\\$&') + '\\s*{([^}]*)}').exec(css);
  const vars = {};
  for (const [, k, v] of m[1].matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) vars[k] = v;
  return vars;
}
const light = block(':root');
const dark = { ...light, ...block(':root[data-theme="dark"]') };

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// [foreground, background, minimum, description]
const pairs = [
  ['fg', 'bg', 4.5, 'body text on page'],
  ['fg', 'panel', 4.5, 'body text on card'],
  ['muted', 'bg', 4.5, 'muted text on page'],
  ['muted', 'panel', 4.5, 'muted text on card'],
  ['link', 'bg', 4.5, 'link on page'],
  ['link', 'panel', 4.5, 'link on card'],
  ['on-accent', 'accent', 4.5, 'button label on accent'],
  ['accent', 'accent-soft', 4.5, 'accent text on accent tint'],
  ['rule', 'bg', 3, 'input border on page'],
  ['rule', 'field', 3, 'input border on field'],
  ['fg', 'field', 4.5, 'input text'],
  ['ok', 'bg', 4.5, 'ok text'],
  ['ok', 'ok-soft', 4.5, 'ok text on tint'],
  ['warn', 'bg', 4.5, 'warn text'],
  ['warn', 'warn-soft', 4.5, 'warn text on tint'],
  ['info', 'bg', 4.5, 'info text'],
  ['info', 'info-soft', 4.5, 'info text on tint'],
  ['on-brand', 'brand-purple', 4.5, 'header text'],
  ['on-brand-muted', 'brand-purple', 4.5, 'header secondary text'],
  ['brand-gold-text', 'brand-purple', 4.5, 'gold eyebrow on purple'],
  ['on-gold', 'brand-gold', 4.5, 'text on gold button'],
  ['on-brand', 'brand-purple-2', 4.5, 'submenu text'],
  ['focus', 'bg', 3, 'focus ring on page'],
  ['focus', 'panel', 3, 'focus ring on card'],
  ['focus', 'brand-purple', 3, 'focus ring on header'],
  ['accent', 'bg', 3, 'accent as UI border on page'],
];

let failed = 0;
for (const [name, t] of [['light', light], ['dark', dark]]) {
  console.log(`\n## ${name}`);
  for (const [fg, bg, min, label] of pairs) {
    const r = ratio(t[fg], t[bg]);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${r.toFixed(2).padStart(6)} (min ${min}) --${fg} on --${bg}  ${label}`);
  }
}
if (failed) { console.log(`\n${failed} pair(s) failed`); process.exit(1); }
console.log('\nall pairs pass');
