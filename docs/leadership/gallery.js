/* Gallery behavior: "Show more" paging per album, and an accessible lightbox.
   Progressive: without JavaScript every photo link opens the large image directly. */
(function () {
  'use strict';

  function initShowMore() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-show-more]'), function (button) {
      var section = document.getElementById(button.getAttribute('aria-controls'));
      if (!section) return;
      button.addEventListener('click', function () {
        var hidden = section.querySelectorAll('li[hidden]');
        var nextPage = hidden.length ? hidden[0].getAttribute('data-page') : null;
        var revealed = 0;
        Array.prototype.forEach.call(hidden, function (li) { if (li.getAttribute('data-page') === nextPage) { li.hidden = false; revealed++; } });
        var remaining = section.querySelectorAll('li[hidden]').length;
        var total = section.querySelectorAll('.photo-grid > li').length;
        if (!remaining) { button.hidden = true; }
        else { button.textContent = 'Show ' + Math.min(revealed, remaining) + ' more of ' + total; }
        var first = section.querySelector('li:not([hidden]) .photo');
        var justShown = section.querySelectorAll('li:not([hidden]) .photo');
        if (justShown.length > revealed) justShown[justShown.length - revealed].focus();
        else if (first) first.focus();
      });
    });
  }

  function initLightbox() {
    var box = document.getElementById('lightbox');
    if (!box) return;
    var img = document.getElementById('lightbox-img');
    var cap = document.getElementById('lightbox-caption');
    var links = Array.prototype.slice.call(document.querySelectorAll('a.photo[data-view]'));
    var current = -1, opener = null;

    function show(index) {
      var link = links[index];
      if (!link) return;
      current = index;
      var thumb = link.querySelector('img');
      img.src = link.getAttribute('href');
      img.alt = thumb ? thumb.alt : '';
      var text = [link.getAttribute('data-caption'), link.getAttribute('data-description')].filter(Boolean).join('. ');
      cap.textContent = text || (thumb ? thumb.alt : '');
      cap.textContent += ' (' + (index + 1) + ' of ' + links.length + ')';
    }
    function open(index, fromLink) {
      opener = fromLink || document.activeElement;
      if (typeof box.showModal === 'function') box.showModal(); else box.setAttribute('open', '');
      document.body.classList.add('lightbox-open');
      show(index);
      box.querySelector('[data-lightbox-close]').focus();
    }
    function close() {
      if (box.open && typeof box.close === 'function') box.close(); else box.removeAttribute('open');
    }
    box.addEventListener('close', function () {
      document.body.classList.remove('lightbox-open');
      img.src = '';
      if (opener && opener.focus) opener.focus();
    });
    links.forEach(function (link, i) {
      link.addEventListener('click', function (event) {
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        open(i, link);
      });
    });
    box.querySelector('[data-lightbox-close]').addEventListener('click', close);
    box.querySelector('[data-lightbox-prev]').addEventListener('click', function () { show((current - 1 + links.length) % links.length); });
    box.querySelector('[data-lightbox-next]').addEventListener('click', function () { show((current + 1) % links.length); });
    box.addEventListener('click', function (event) { if (event.target === box) close(); });
    box.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { show((current - 1 + links.length) % links.length); event.preventDefault(); }
      if (event.key === 'ArrowRight') { show((current + 1) % links.length); event.preventDefault(); }
      if (event.key === 'Tab') {
        // The modal dialog already makes the page inert; wrapping keeps focus on the three controls.
        var focusables = box.querySelectorAll('button');
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) { last.focus(); event.preventDefault(); }
        else if (!event.shiftKey && document.activeElement === last) { first.focus(); event.preventDefault(); }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () { initShowMore(); initLightbox(); });
})();
