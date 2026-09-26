/* Shared behavior for the Lambda Xi mocks: theme choice, navigation menus,
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
    // Follows the system preference until the visitor presses the button; each press picks the other theme and remembers it.
    var button = document.querySelector('[data-theme-toggle]');
    if (!button) return;
    function label() {
      button.setAttribute('aria-label', root.getAttribute('data-theme') === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
    button.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* private mode: choice lasts this page only */ }
      applyTheme(next);
      label();
    });
    media.addEventListener('change', function () {
      if (storedChoice() === 'system') { applyTheme('system'); label(); }
    });
    label();
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
  function initDialogs() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-dialog-open]'), function (button) {
      var box = document.getElementById(button.getAttribute('data-dialog-open'));
      if (!box) return;
      button.addEventListener('click', function () { if (typeof box.showModal === 'function') box.showModal(); else box.setAttribute('open', ''); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-dialog-close]'), function (button) {
      button.addEventListener('click', function () { var box = button.closest('dialog'); if (!box) return; if (typeof box.close === 'function') box.close(); else box.removeAttribute('open'); });
    });
  }

  function initTabs() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-tabs]'), function (root) {
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
      if (!tabs.length) return;
      function panelOf(tab) { return document.getElementById(tab.getAttribute('aria-controls')); }
      function select(tab, focus) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.setAttribute('tabindex', on ? '0' : '-1');
          var panel = panelOf(t); if (panel) panel.hidden = !on;
        });
        if (focus) tab.focus();
      }
      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { select(tab, false); });
        tab.addEventListener('keydown', function (e) {
          var next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : -1;
          if (next < 0) return;
          e.preventDefault(); select(tabs[next], true);
        });
      });
      var wanted = location.hash && root.querySelector('[role="tab"][aria-controls="' + location.hash.slice(1) + '"]');
      var byDefault = root.querySelector('[role="tab"][aria-controls="' + root.getAttribute('data-tabs-default') + '"]');
      select(wanted || byDefault || tabs[0], false);
      window.addEventListener('hashchange', function () {
        var t = root.querySelector('[role="tab"][aria-controls="' + location.hash.slice(1) + '"]');
        if (t) select(t, false);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initDropdowns();
    initMobileMenu();
    markExternalLinks();
    initDialogs();
    initTabs();
  });
})();
