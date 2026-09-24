// Generates mock-src/pages/lineage.html and mock-src/pages/basilei.html from the data files,
// so the name lists are never hand-edited in markup.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, 'mock-src');
const lineage = JSON.parse(readFileSync(join(SRC, 'data', 'lineage.json'), 'utf8'));
const basilei = JSON.parse(readFileSync(join(SRC, 'data', 'basilei.json'), 'utf8'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const totalBrothers = lineage.reduce((a, d) => a + d.semesters.reduce((b, s) => b + s.brothers.length, 0), 0);
const totalSemesters = lineage.reduce((a, d) => a + d.semesters.length, 0);
const decadeId = (d) => `decade-${d.decade.replace(/\D/g, '')}`;

const decadesHtml = lineage.map((d) => d.semesters.length === 0 ? `
      <section class="decade" id="${decadeId(d)}" aria-labelledby="${decadeId(d)}-title">
        <h2 id="${decadeId(d)}-title">${d.decade}</h2>
        <p class="legend">No lines are recorded for this decade yet. The chapter is gathering the names; they will appear here when received.</p>
      </section>` : `
      <section class="decade" id="${decadeId(d)}" aria-labelledby="${decadeId(d)}-title">
        <h2 id="${decadeId(d)}-title">${d.decade}</h2>
        <p class="legend">${d.semesters.length} line${d.semesters.length === 1 ? '' : 's'}, ${d.semesters.reduce((a, s) => a + s.brothers.length, 0)} brothers</p>
        <div class="semesters">${d.semesters.map((s) => `
          <div class="semester">
            <h3>${s.label}</h3>
            <ol>${s.brothers.map((b) => `
              <li>${esc(b.name)}${b.omegaChapter ? ' <span class="omega" aria-hidden="true">&#937;</span><span class="visually-hidden"> (entered Omega Chapter)</span>' : ''}</li>`).join('')}
            </ol>
          </div>`).join('')}
        </div>
      </section>`).join('\n');


const lineagePage = `<!DOCTYPE html>
<html lang="en">
<head>
{{head}}
<title>Lineage | Lambda Xi Chapter</title>
<meta name="description" content="Line history of the Lambda Xi Chapter of Omega Psi Phi Fraternity, Inc.: every line from Fall 1977 to Fall 2025, by decade and semester, with notable chapter brothers.">
</head>
<body>
{{header}}

<main id="main">
  <div class="page-head">
    <div class="container">
      <nav aria-label="Breadcrumb"><ol class="crumbs"><li><a href="{{href:leadership}}">Leadership and Lineage</a></li><li aria-current="page">Lineage</li></ol></nav>
      <p class="eyebrow">Our Legacy</p>
      <h1>Lineage</h1>
      <p>Every line that crossed at Lambda Xi, from Fall 1977 to Fall 2025: ${totalSemesters} lines and ${totalBrothers} brothers across six decades, one of them awaiting data. Names are listed in the order the chapter records them.</p>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <nav aria-label="Decades">
        <ul class="jump">${lineage.map((d) => `<li><a href="#${decadeId(d)}">${d.decade}</a></li>`).join('')}</ul>
      </nav>
      <p class="legend"><span class="omega" aria-hidden="true">&#937;</span> marks a brother who has entered Omega Chapter.</p>
${decadesHtml}
    </div>
  </section>

  <section class="section section--alt" aria-labelledby="notable-title">
    <div class="container prose">
      <h2 id="notable-title">Notable chapter brothers</h2>
      <ul>
        <li><strong>Freddie Thompson, IV</strong> (Spring 2018): Twelfth 13th District Representative, and recipient of the fraternity's 2024 to 2025 Brigadier General Charles Young Military Leadership Award.</li>
      </ul>
    </div>
  </section>
</main>

{{footer}}
</body>
</html>
`;
writeFileSync(join(SRC, 'pages', 'lineage.html'), lineagePage);

// Past Basilei: one row per served year; gaps are stated once per decade rather than printed as empty years.
const byDecade = {};
for (const b of basilei) { const d = `${Math.floor(b.year / 10) * 10}s`; (byDecade[d] = byDecade[d] || []).push(b); }
const gaps = (rows, start, end) => { const have = new Set(rows.map((r) => r.year)); const missing = []; for (let y = start; y <= end; y++) if (!have.has(y)) missing.push(y); return missing; };
const decadeTables = Object.entries(byDecade).map(([d, rows]) => {
  const start = Math.max(1977, Number(d.slice(0, 4))); const end = Math.min(2026, start + 9 - (start % 10));
  const missing = gaps(rows, start, end);
  return `
      <section class="decade" id="basilei-${d}" aria-labelledby="basilei-${d}-title">
        <h2 id="basilei-${d}-title">${d}</h2>
        <table class="table">
          <caption class="visually-hidden">Basilei who served in the ${d}</caption>
          <thead><tr><th scope="col">Year</th><th scope="col">Basileus</th></tr></thead>
          <tbody>${rows.map((r) => `
            <tr><th scope="row">${r.year}</th><td>${esc(r.name)}</td></tr>`).join('')}
          </tbody>
        </table>${missing.length ? `
        <p class="legend">No record for ${missing.length === 1 ? missing[0] : missing.length + ' years'} in this decade (${missing.join(', ')}).</p>` : ''}
      </section>`;
}).join('\n');

const basileiPage = `<!DOCTYPE html>
<html lang="en">
<head>
{{head}}
<title>Past Basilei | Lambda Xi Chapter</title>
<meta name="description" content="The Basilei who have led the Lambda Xi Chapter of Omega Psi Phi Fraternity, Inc. since its charter in 1977, by year.">
</head>
<body>
{{header}}

<main id="main">
  <div class="page-head">
    <div class="container">
      <nav aria-label="Breadcrumb"><ol class="crumbs"><li><a href="{{href:leadership}}">Leadership and Lineage</a></li><li aria-current="page">Past Basilei</li></ol></nav>
      <p class="eyebrow">Our Legacy</p>
      <h1>Past Basilei</h1>
      <p>The brothers who have served as Basileus, the chapter's presiding officer, since 1977. ${basilei.length} years are recorded; the current Basileus is <a href="{{href:officers}}">Brother Eugene Gibbs</a>.</p>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <nav aria-label="Decades"><ul class="jump">${Object.keys(byDecade).map((d) => `<li><a href="#basilei-${d}">${d}</a></li>`).join('')}</ul></nav>
${decadeTables}
    </div>
  </section>
</main>

{{footer}}
</body>
</html>
`;
writeFileSync(join(SRC, 'pages', 'basilei.html'), basileiPage);
console.log(`lineage: ${totalSemesters} semesters, ${totalBrothers} brothers; basilei: ${basilei.length} rows`);
