// Generates the Gallery index and one page per year from mock-src/data/gallery.json.
// IMAGE_BASE decides where photos are read from: "local" uses images/gallery/<year>/<id>-{t,v}.jpg
// in the repo; "cdn" uses Strikingly CDN transforms. Set in mock-src/data/gallery-config.json.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, 'mock-src');
const years = JSON.parse(readFileSync(join(SRC, 'data', 'gallery.json'), 'utf8'));
const cfgPath = join(SRC, 'data', 'gallery-config.json');
const cfg = existsSync(cfgPath) ? JSON.parse(readFileSync(cfgPath, 'utf8')) : { imageBase: 'cdn', pageSize: 48 };
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const slugify = (s) => s.toLowerCase().replace(/&amp;|&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const CDN = 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload';
const where = (kind) => cfg[kind === 'thumb' ? 'thumbs' : 'views'] || cfg.imageBase;
const src = (year, ph, kind) => {
  if (where(kind) === 'local') return `{{img:images/gallery/${year}/${ph.id}-${kind === 'thumb' ? 't' : 'v'}.jpg}}`;
  const t = kind === 'thumb' ? 'c_limit,w_480,h_480,q_auto:good,f_jpg' : 'c_limit,w_1200,h_1200,q_auto:good,f_jpg';
  return `${CDN}/${t}/1312902/${ph.id}.${ph.ext}`;
};
const yearKey = (y) => `gallery${y.year.replace(/-/g, '_')}`;
const total = years.reduce((a, y) => a + y.count, 0);
const albumsTotal = years.reduce((a, y) => a + y.albums.length, 0);

// Index page
const index = `<!DOCTYPE html>
<html lang="en">
<head>
{{head}}
<title>Gallery | Lambda Xi Chapter</title>
<meta name="description" content="Photographs of the Lambda Xi Chapter of Omega Psi Phi Fraternity, Inc. from 2017 to 2025: ${albumsTotal} albums and ${total.toLocaleString('en-US')} photos, by year and event.">
</head>
<body>
{{header}}

<main id="main">
  <div class="page-head">
    <div class="container">
      <p class="eyebrow">Chapter moments</p>
      <h1>Gallery</h1>
      <p>${total.toLocaleString('en-US')} photographs in ${albumsTotal} albums, filed by year and event. Pick a year, then an album. Every photo opens large on its own page position, and the arrow keys move between photos.</p>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <nav aria-label="Years"><ul class="jump">${years.map((y) => `<li><a href="{{href:${yearKey(y)}}}">${y.year}</a></li>`).join('')}</ul></nav>
${years.map((y) => `
      <section class="decade" aria-labelledby="y-${y.year}">
        <h2 id="y-${y.year}"><a href="{{href:${yearKey(y)}}}">${y.year}</a></h2>
        <p class="legend">${y.albums.length} album${y.albums.length === 1 ? '' : 's'}, ${y.count.toLocaleString('en-US')} photos</p>
        <ul class="grid grid--albums list-plain" role="list">${y.albums.map((a) => `
          <li class="card album">
            <a href="{{href:${yearKey(y)}}}#${slugify(a.title)}">
              <img src="${src(y.year, a.photos[0], 'thumb')}" alt="" width="480" height="360" loading="lazy">
              <span class="album__title">${esc(a.title)}</span>
            </a>
            <span class="album__count">${a.count} photo${a.count === 1 ? '' : 's'}</span>
          </li>`).join('')}
        </ul>
      </section>`).join('')}
      <p class="data-note stack-top">Album names, order and photo sets are those published on lambdaxi1911.com as captured on 23 September 2026. Photographs are the chapter's own.${where('view') === 'cdn' ? ' Thumbnails are stored in this repo; the large views open from the current host\'s image service until they are imported too.' : ''}</p>
    </div>
  </section>
</main>

{{footer}}
</body>
</html>
`;
writeFileSync(join(SRC, 'pages', 'gallery.html'), index);

// Year pages
for (const y of years) {
  const page = `<!DOCTYPE html>
<html lang="en">
<head>
{{head}}
<title>Gallery ${y.year} | Lambda Xi Chapter</title>
<meta name="description" content="Lambda Xi Chapter photographs from ${y.year}: ${y.albums.map((a) => a.title).join(', ')}. ${y.count} photos in ${y.albums.length} album${y.albums.length === 1 ? '' : 's'}.">
</head>
<body>
{{header}}

<main id="main">
  <div class="page-head">
    <div class="container">
      <nav aria-label="Breadcrumb"><ol class="crumbs"><li><a href="{{href:gallery}}">Gallery</a></li><li aria-current="page">${y.year}</li></ol></nav>
      <p class="eyebrow">Gallery</p>
      <h1>${y.year}</h1>
      <p>${y.count} photos in ${y.albums.length} album${y.albums.length === 1 ? '' : 's'}. Each album shows ${cfg.pageSize} photos at a time; use "Show more" or the album's page links for the rest. Select a photo to view it large; Escape closes it.</p>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <nav aria-label="Albums in ${y.year}"><ul class="jump">${y.albums.map((a) => `<li><a href="#${slugify(a.title)}">${esc(a.title)} <span class="album__count">(${a.count})</span></a></li>`).join('')}</ul></nav>
${y.albums.map((a) => `
      <section class="decade album-section" id="${slugify(a.title)}" aria-labelledby="${slugify(a.title)}-title" data-album>
        <h2 id="${slugify(a.title)}-title">${esc(a.title)}</h2>
        <p class="legend">${a.count} photo${a.count === 1 ? '' : 's'}</p>
        <ul class="photo-grid list-plain" role="list">${a.photos.map((ph, i) => `
          <li${i >= cfg.pageSize ? ' hidden data-page="' + Math.floor(i / cfg.pageSize) + '"' : ''}>
            <a class="photo" href="${src(y.year, ph, 'view')}" data-view data-external="false" data-caption="${esc(ph.caption)}" data-description="${esc(ph.description)}">
              <img src="${src(y.year, ph, 'thumb')}" alt="${ph.caption || ph.description ? '' : esc(`Photo ${i + 1} of ${a.count}, ${a.title}, ${y.year}`)}" width="480" height="360" loading="lazy">${ph.caption || ph.description ? `
              <span class="photo__caption">${esc(ph.caption)}${ph.caption && ph.description ? '. ' : ''}${esc(ph.description)}</span>` : ''}
            </a>
          </li>`).join('')}
        </ul>${a.count > cfg.pageSize ? `
        <p><button type="button" class="btn btn--ghost" data-show-more aria-controls="${slugify(a.title)}">Show ${Math.min(cfg.pageSize, a.count - cfg.pageSize)} more of ${a.count}</button></p>` : ''}
      </section>`).join('')}
      <p class="data-note stack-top">Photo sets, order and captions are those published on lambdaxi1911.com as captured on 23 September 2026. Photographs are the chapter's own.${where('view') === 'cdn' ? ' Thumbnails are stored in this repo; the large views open from the current host\'s image service until they are imported too.' : ''}</p>
    </div>
  </section>
</main>

<dialog class="lightbox" id="lightbox" aria-label="Photo viewer">
  <button type="button" class="lightbox__close" data-lightbox-close aria-label="Close viewer">&#10005;</button>
  <button type="button" class="lightbox__prev" data-lightbox-prev aria-label="Previous photo">&#8249;</button>
  <figure class="lightbox__figure">
    <img id="lightbox-img" src="" alt="" aria-describedby="lightbox-caption">
    <figcaption id="lightbox-caption" aria-live="polite"></figcaption>
  </figure>
  <button type="button" class="lightbox__next" data-lightbox-next aria-label="Next photo">&#8250;</button>
</dialog>

{{footer}}
<script src="gallery.js"></script>
</body>
</html>
`;
  writeFileSync(join(SRC, 'pages', `${yearKey(y)}.html`), page);
}
console.log(`gallery: index + ${years.length} year pages, ${albumsTotal} albums, ${total} photos, thumbs=${where('thumb')} views=${where('view')}`);
