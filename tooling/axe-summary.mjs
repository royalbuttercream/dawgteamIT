// Aggregates axe-core results across all pages: rule counts, and every distinct
// colour-contrast pair with its ratio and where it occurs.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..');
const manifest = JSON.parse(readFileSync(join(here, 'pages.json'), 'utf8'));
const rules = {};
const contrast = {};
for (const pg of manifest.pages) {
  for (const w of [375, 1440]) {
    const f = join(OUT, pg.slug, 'source', `axe-${w}.json`);
    if (!existsSync(f)) continue;
    const a = JSON.parse(readFileSync(f, 'utf8'));
    for (const v of a.violations) {
      rules[v.id] = rules[v.id] || { impact: v.impact, help: v.help, pages: new Set(), nodes: 0 };
      rules[v.id].pages.add(pg.slug); rules[v.id].nodes += v.nodeCount;
      if (v.id === 'color-contrast') {
        for (const n of v.nodes) {
          const m = /contrast of ([\d.]+) \(foreground color: (#[0-9a-f]{6}), background color: (#[0-9a-f]{6}), font size: ([\d.]+pt) \(([\d.]+px)\), font weight: (\w+)/i.exec(n.summary || '');
          if (!m) continue;
          const key = `${m[2]} on ${m[3]}`;
          contrast[key] = contrast[key] || { ratio: m[1], size: m[5], weight: m[6], where: new Set(), sample: n.html.replace(/\s+/g, ' ').slice(0, 110), text: '' };
          contrast[key].where.add(`${pg.slug}@${w}`);
        }
      }
    }
  }
}
console.log('## Rule totals (pages affected / node instances, across 375 and 1440)');
for (const [id, r] of Object.entries(rules).sort((a, b) => b[1].pages.size - a[1].pages.size)) console.log(`${id.padEnd(22)} ${String(r.impact).padEnd(9)} pages ${String(r.pages.size).padStart(2)}  nodes ${String(r.nodes).padStart(3)}  ${r.help}`);
console.log('\n## Distinct failing colour pairs');
for (const [k, c] of Object.entries(contrast).sort((a, b) => b[1].where.size - a[1].where.size)) console.log(`${c.ratio.padStart(5)}:1  ${k}  ${c.size} ${c.weight}  on ${c.where.size} page-widths  e.g. ${[...c.where].slice(0, 3).join(', ')}\n        ${c.sample}`);
