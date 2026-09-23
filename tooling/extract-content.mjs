// Extracts the visible text content of each rendered page (headings, paragraphs, lists,
// accordion bodies, link labels, image alt text) into <page>/source/content.txt so Phase B
// mocks can carry every word and every capability of the live page.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..');
const manifest = JSON.parse(readFileSync(join(here, 'pages.json'), 'utf8'));
const only = process.argv.slice(2);

const SKIP = /s-navbar|navbar-drawer|s-nav\b|s-footer|cookie|s-kit-modal|popups-container|s-mobile-actions|hcaptcha|s-kit-collapse-header-icon/i;

function clean(t) { return (t || '').replace(/\s+/g, ' ').trim(); }

for (const pg of manifest.pages) {
  if (only.length && !only.includes(pg.slug)) continue;
  const f = join(OUT, pg.slug, 'source', 'dom.html');
  if (!existsSync(f)) continue;
  const dom = new JSDOM(readFileSync(f, 'utf8'));
  const doc = dom.window.document;
  const out = [`# ${pg.slug}  ${manifest.base}${pg.path}`, `title: ${doc.title}`, `description: ${doc.querySelector('meta[name=description]')?.content || ''}`, ''];

  // Content sections in document order, excluding chrome.
  const sections = [...doc.querySelectorAll('#s-content .s-section, .s-section')].filter((s) => !SKIP.test(s.className));
  for (const s of sections) {
    const kind = (s.className.match(/s-(title|text|media|gallery|contact|html|accordion|blank|image|repeatable)[a-z-]*-section|s-[a-z-]+-section/) || [''])[0];
    out.push(`## section ${kind || s.className.split(' ').slice(0, 3).join(' ')}`);
    const walker = doc.createTreeWalker(s, dom.window.NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      if (SKIP.test(node.className || '')) continue;
      const tag = node.tagName.toLowerCase();
      if (/^h[1-6]$/.test(tag)) { const t = clean(node.textContent); if (t) out.push(`${tag}: ${t}`); }
      else if (tag === 'p' || tag === 'li') { const t = clean(node.textContent); if (t && !/^h[1-6]$/.test(node.parentElement?.tagName?.toLowerCase() || '')) out.push(`${tag === 'li' ? '  - ' : ''}${t}`); }
      else if (tag === 'a' && node.getAttribute('href')) { const t = clean(node.textContent) || `[img alt="${node.querySelector('img')?.getAttribute('alt') || ''}"]`; out.push(`link: ${t} -> ${node.getAttribute('href')}${node.target ? ' [' + node.target + ']' : ''}`); }
      else if (tag === 'img') { const src = (node.getAttribute('src') || node.getAttribute('data-src') || '').split('/').pop().slice(0, 60); out.push(`img: alt="${node.getAttribute('alt') || ''}" ${src}`); }
      else if (tag === 'iframe') out.push(`iframe: ${node.getAttribute('src')}`);
      else if (tag === 'input' || tag === 'textarea' || tag === 'select') out.push(`field: ${tag}[${node.type || ''}] name=${node.name || ''} placeholder="${node.placeholder || ''}" required=${node.required}`);
      else if (tag === 'button') out.push(`button: ${clean(node.textContent)}`);
      else if (tag === 'label') out.push(`label: ${clean(node.textContent)}`);
      else if (node.classList.contains('s-accordion-question-text')) out.push(`accordion-question: ${clean(node.textContent)}`);
      else if (node.classList.contains('s-accordion-answer-text')) out.push(`accordion-answer: ${clean(node.textContent)}`);
    }
    out.push('');
  }
  writeFileSync(join(OUT, pg.slug, 'source', 'content.txt'), out.join('\n'));
  console.log(`${pg.slug}: ${out.length} lines, ${sections.length} sections`);
}
