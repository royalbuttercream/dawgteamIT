// Runs inside the page after each Tab press. Reports the focused element and whether
// its focus state is visibly distinguishable from its resting state.
(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return { tag: 'body' };
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const hasOutline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
  const hasShadow = cs.boxShadow && cs.boxShadow !== 'none';
  return {
    tag: el.tagName.toLowerCase(),
    text: (el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.getAttribute('title') || '').trim().replace(/\s+/g, ' ').slice(0, 50),
    href: el.getAttribute('href') || '',
    visibleFocus: hasOutline || hasShadow,
    focusIndicators: { outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth, boxShadow: cs.boxShadow.slice(0, 60) },
    inViewport: r.top >= 0 && r.bottom <= window.innerHeight && r.width > 0 && r.height > 0,
    hiddenByCss: cs.visibility === 'hidden' || cs.opacity === '0' || cs.display === 'none' || r.width === 0,
    rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
  };
})();
