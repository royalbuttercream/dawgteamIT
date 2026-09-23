// Runs inside the page. Returns a structural inventory of the rendered DOM.
// Pure read: no clicks, no submits, no storage writes.
(() => {
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
  };
  const text = (el) => (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');

  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
    level: Number(h.tagName[1]), text: text(h).slice(0, 120), visible: vis(h),
  }));

  const links = [...document.querySelectorAll('a')].map((a) => {
    const href = a.getAttribute('href') || '';
    let kind = 'internal';
    if (/^https?:/i.test(href)) kind = href.includes(location.host) ? 'internal' : 'external';
    else if (href.startsWith('#')) kind = 'anchor';
    else if (href.startsWith('mailto:') || href.startsWith('tel:')) kind = 'protocol';
    else if (!href) kind = 'empty';
    return {
      text: text(a).slice(0, 80) || (a.querySelector('img') ? `[img: ${a.querySelector('img').alt}]` : ''),
      href, kind, target: a.getAttribute('target') || '', rel: a.getAttribute('rel') || '',
      visible: vis(a), ariaCurrent: a.getAttribute('aria-current') || '', ariaLabel: a.getAttribute('aria-label') || '',
    };
  });

  const controls = [...document.querySelectorAll('input,select,textarea,button,[role=button]')].map((c) => {
    const id = c.id;
    const labelFor = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
    const wrapped = c.closest('label');
    const cs = getComputedStyle(c);
    return {
      tag: c.tagName.toLowerCase(), type: c.getAttribute('type') || '', name: c.getAttribute('name') || '', id,
      required: c.hasAttribute('required') || c.getAttribute('aria-required') === 'true',
      placeholder: c.getAttribute('placeholder') || '',
      text: c.tagName === 'BUTTON' || c.getAttribute('role') === 'button' ? text(c).slice(0, 60) : '',
      accessibleName: (labelFor && text(labelFor)) || (wrapped && text(wrapped)) || c.getAttribute('aria-label') ||
        (c.getAttribute('aria-labelledby') && text(document.getElementById(c.getAttribute('aria-labelledby')) || document.body).slice(0, 60)) || '',
      autocomplete: c.getAttribute('autocomplete') || '', outlineStyle: cs.outlineStyle, visible: vis(c),
      inForm: !!c.closest('form'),
    };
  });

  const forms = [...document.querySelectorAll('form')].map((f) => ({
    action: f.getAttribute('action') || '', method: f.getAttribute('method') || '', id: f.id || '', cls: f.className.slice(0, 80),
    fields: [...f.querySelectorAll('input,select,textarea')].map((c) => `${c.tagName.toLowerCase()}[${c.type || ''}]:${c.name || c.placeholder || c.id}`),
  }));

  const images = [...document.querySelectorAll('img')].map((i) => ({
    src: (i.currentSrc || i.getAttribute('src') || '').slice(0, 200), alt: i.getAttribute('alt'), hasAlt: i.hasAttribute('alt'),
    naturalWidth: i.naturalWidth, naturalHeight: i.naturalHeight,
    renderedWidth: Math.round(i.getBoundingClientRect().width), renderedHeight: Math.round(i.getBoundingClientRect().height),
    loading: i.getAttribute('loading') || '', hasSrcset: i.hasAttribute('srcset'), complete: i.complete, visible: vis(i),
  }));
  const bgImages = [...document.querySelectorAll('body *')].filter((el) => { const b = getComputedStyle(el).backgroundImage; return b && b !== 'none' && b.includes('url('); }).slice(0, 40)
    .map((el) => ({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 60), url: getComputedStyle(el).backgroundImage.slice(0, 160), w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) }));

  const iframes = [...document.querySelectorAll('iframe')].map((f) => ({ src: (f.getAttribute('src') || '').slice(0, 200), title: f.getAttribute('title') || '', w: Math.round(f.getBoundingClientRect().width), h: Math.round(f.getBoundingClientRect().height) }));
  const videos = [...document.querySelectorAll('video')].map((v) => ({ src: (v.currentSrc || v.src || '').slice(0, 160), autoplay: v.autoplay, muted: v.muted, loop: v.loop, controls: v.controls, hasCaptions: !!v.querySelector('track') }));

  const landmarks = [...document.querySelectorAll('header,nav,main,footer,aside,[role]')].map((l) => ({
    tag: l.tagName.toLowerCase(), role: l.getAttribute('role') || '', label: l.getAttribute('aria-label') || l.getAttribute('aria-labelledby') || '', id: l.id || '',
  }));

  const doc = document.documentElement;
  const overflowX = Math.max(doc.scrollWidth, document.body.scrollWidth) - window.innerWidth;
  const wide = overflowX > 1
    ? [...document.querySelectorAll('body *')].filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1 && vis(el)).slice(0, 12)
        .map((el) => ({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 60), right: Math.round(el.getBoundingClientRect().right), text: text(el).slice(0, 40) }))
    : [];

  const small = [...document.querySelectorAll('p,span,a,li,button,label,input,td,th,div')].filter(vis)
    .map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) })).filter((x) => x.fs < 12 && text(x.el).length > 0 && x.el.children.length === 0)
    .slice(0, 12).map((x) => ({ tag: x.el.tagName.toLowerCase(), fs: x.fs, text: text(x.el).slice(0, 40) }));
  const tapTargets = [...document.querySelectorAll('a,button,input,select,textarea,[role=button]')].filter(vis)
    .map((el) => { const r = el.getBoundingClientRect(); return { tag: el.tagName.toLowerCase(), w: Math.round(r.width), h: Math.round(r.height), text: text(el).slice(0, 40) }; })
    .filter((t) => t.w < 24 || t.h < 24);

  const styleSheets = [...document.styleSheets].map((s) => (s.href || 'inline').slice(0, 160));
  const fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family.replace(/"/g, '')} ${f.weight}`).filter((v, i, a) => a.indexOf(v) === i);

  return {
    title: document.title, lang: doc.getAttribute('lang'),
    metaDescription: document.querySelector('meta[name=description]')?.content?.slice(0, 200) || '',
    og: [...document.querySelectorAll('meta[property^="og:"]')].map((m) => `${m.getAttribute('property')}=${(m.content || '').slice(0, 80)}`),
    canonical: document.querySelector('link[rel=canonical]')?.href || '', favicon: !!document.querySelector('link[rel~=icon]'),
    viewportMeta: document.querySelector('meta[name=viewport]')?.content || '',
    viewport: { w: window.innerWidth, h: window.innerHeight, docH: doc.scrollHeight },
    overflowX, wide,
    hasMain: !!document.querySelector('main,[role=main]'),
    hasSkipLink: !![...document.querySelectorAll('a[href^="#"]')].find((a) => /skip/i.test(text(a))),
    headings, links, controls, forms, images, bgImages, iframes, videos, landmarks, small, tapTargets, styleSheets, fonts,
    inlineStyleCount: document.querySelectorAll('[style]').length, totalEls: document.querySelectorAll('*').length,
    bodyTextLength: text(document.body).length,
    cookies: document.cookie.split(';').filter(Boolean).length, localStorageKeys: Object.keys(localStorage).slice(0, 20),
  };
})();
