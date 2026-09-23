/* Shared behaviour for the Lambda Xi mocks: theme choice, navigation menus,
   external-link marking. No framework, no network. The pre-paint theme script is
   inline in each page head; this file adds the toggle and keeps System live. */
(function () {
  'use strict';

  var STORAGE_KEY = 'lambdaxi-theme';
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function storedChoice() {
    try { return localStorage.getItem(STORAGE_KEY) || 'system'; } catch (e) { return 'system'; }
  }

  function applyTheme(choice) {
    var resolved = choice === 'system' ? (media.matches ? 'dark' : 'light') : choice;
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-theme-choice', choice);
  }

  function initThemeToggle() {
    var group = document.querySelector('[data-theme-toggle]');
    if (!group) return;
    var choice = storedChoice();
    var radios = group.querySelectorAll('input[type="radio"]');
    Array.prototype.forEach.call(radios, function (radio) {
      radio.checked = radio.value === choice;
      radio.addEventListener('change', function () {
        if (!radio.checked) return;
        try { localStorage.setItem(STORAGE_KEY, radio.value); } catch (e) { /* private mode: choice lasts this page only */ }
        applyTheme(radio.value);
      });
    });
    media.addEventListener('change', function () {
      if (storedChoice() === 'system') applyTheme('system');
    });
  }

  function closeAll(except) {
    Array.prototype.forEach.call(document.querySelectorAll('.nav__item--has-menu > button[aria-expanded="true"]'), function (button) {
      if (button !== except) {
        button.setAttribute('aria-expanded', 'false');
        var menu = document.getElementById(button.getAttribute('aria-controls'));
        if (menu) menu.hidden = true;
      }
    });
  }

  function initDropdowns() {
    var buttons = document.querySelectorAll('.nav__item--has-menu > button');
    Array.prototype.forEach.call(buttons, function (button) {
      var menu = document.getElementById(button.getAttribute('aria-controls'));
      if (!menu) return;
      menu.hidden = true;
      button.addEventListener('click', function () {
        var open = button.getAttribute('aria-expanded') === 'true';
        closeAll(button);
        button.setAttribute('aria-expanded', String(!open));
        menu.hidden = open;
        if (!open) {
          var first = menu.querySelector('a');
          if (first) first.focus();
        }
      });
      var item = button.parentElement;
      item.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
          button.setAttribute('aria-expanded', 'false');
          menu.hidden = true;
          button.focus();
        }
      });
      item.addEventListener('focusout', function (event) {
        if (!item.contains(event.relatedTarget)) {
          button.setAttribute('aria-expanded', 'false');
          menu.hidden = true;
        }
      });
    });
    document.addEventListener('click', function (event) {
      if (!event.target.closest('.nav__item--has-menu')) closeAll(null);
    });
  }

  function initMobileMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.getElementById(toggle && toggle.getAttribute('aria-controls'));
    if (!toggle || !nav) return;
    var mq = window.matchMedia('(min-width: 901px)');

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.hidden = !open && !mq.matches;
      document.body.classList.toggle('menu-open', open && !mq.matches);
    }

    function sync() {
      if (mq.matches) { nav.hidden = false; document.body.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); }
      else if (toggle.getAttribute('aria-expanded') !== 'true') nav.hidden = true;
    }

    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true' && !mq.matches) { setOpen(false); toggle.focus(); }
    });
    mq.addEventListener('change', sync);
    sync();
  }

  function markExternalLinks() {
    var host = location.host;
    Array.prototype.forEach.call(document.querySelectorAll('a[href^="http"]'), function (link) {
      if (host && link.host === host) return;
      if (link.getAttribute('data-external') === 'false') return;
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
      if (link.classList.contains('is-external')) return;
      link.classList.add('is-external');
      var label = link.getAttribute('aria-label');
      if (label) {
        // aria-label overrides descendant text, so the note has to live in the label itself.
        link.setAttribute('aria-label', label + ' (opens in a new tab)');
        return;
      }
      var note = document.createElement('span');
      note.className = 'external-note visually-hidden';
      note.textContent = ' (opens in a new tab)';
      link.appendChild(note);
    });
  }

  applyTheme(storedChoice());
  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initDropdowns();
    initMobileMenu();
    markExternalLinks();
  });
})();
