/* Renders the chapter's events from the JSON embedded in the page (script#events-data), so the
   list is right on the day the page is opened without a rebuild.
   data-events="home": events that start in the current month or the next, in date order.
   data-events="all":  upcoming (from today) then held, each in date order. */
(function () {
  'use strict';

  var TZ = 'Asia/Seoul';
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // All chapter events happen in Korea; dates are shown in Korea time whatever the visitor's zone.
  function parse(iso) { return new Date(iso.length === 10 ? iso + 'T00:00:00+09:00' : iso); }
  function parts(d) {
    var f = new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, weekday: 'long' });
    var o = {};
    f.formatToParts(d).forEach(function (x) { o[x.type] = x.value; });
    return { year: Number(o.year), month: Number(o.month) - 1, day: Number(o.day), weekday: o.weekday, time: o.hour + ':' + o.minute + ' ' + o.dayPeriod };
  }
  function seoulToday() { var p = parts(new Date()); return { year: p.year, month: p.month, day: p.day, key: p.year * 10000 + p.month * 100 + p.day }; }
  function dayKey(d) { var p = parts(d); return p.year * 10000 + p.month * 100 + p.day; }
  function dateText(ev) {
    var s = parse(ev.start), e = ev.end ? parse(ev.end) : s;
    var ps = parts(s), pe = parts(e);
    if (ev.approximate && ev.allDay && ps.month === pe.month) return MONTHS[ps.month] + ' ' + ps.year;
    var sameDay = dayKey(s) === dayKey(e);
    if (!sameDay) return ps.day + ' ' + MONTHS[ps.month] + (ps.year !== pe.year ? ' ' + ps.year : '') + ' to ' + pe.day + ' ' + MONTHS[pe.month] + ' ' + pe.year;
    var text = ps.weekday + ' ' + ps.day + ' ' + MONTHS[ps.month] + ' ' + ps.year;
    if (!ev.allDay) text += ', ' + ps.time;
    return text;
  }
  function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  function card(ev, links, today) {
    var s = parse(ev.start), e = ev.end ? parse(ev.end) : s;
    var ps = parts(s);
    var held = dayKey(e) < today.key;
    var href = links[ev.page] || '#';
    if (ev.anchor) href += '#' + ev.anchor;
    var status = held ? '<span class="status status--past">Held</span>' : (ev.status === 'open' ? '<span class="status status--open">Registration open</span>' : '');
    return '<li class="card event">' +
      '<div class="event__date" aria-hidden="true"><strong>' + (ev.approximate && ev.allDay ? SHORT[ps.month] : ps.day) + '</strong>' + (ev.approximate && ev.allDay ? ps.year : SHORT[ps.month]) + '</div>' +
      '<div><h3><a href="' + esc(href) + '">' + esc(ev.title) + '</a></h3>' +
      '<p class="event__meta"><span><time datetime="' + esc(ev.start) + '">' + esc(dateText(ev)) + '</time></span>' + (ev.place ? '<span>' + esc(ev.place) + '</span>' : '') + (status ? '<span>' + status + '</span>' : '') + '</p>' +
      '<p>' + esc(ev.summary) + '</p></div></li>';
  }

  function render() {
    var host = document.querySelector('[data-events]');
    var dataEl = document.getElementById('events-data');
    if (!host || !dataEl) return;
    var events, links;
    try { var parsed = JSON.parse(dataEl.textContent); events = parsed.events; links = parsed.links; } catch (e) { return; }
    var today = seoulToday();
    var mode = host.getAttribute('data-events');
    var sorted = events.slice().sort(function (a, b) { return parse(a.start) - parse(b.start); });

    if (mode === 'home') {
      var m0 = today.year * 100 + today.month, m1 = (today.month === 11 ? (today.year + 1) * 100 : today.year * 100 + today.month + 1);
      var inWindow = sorted.filter(function (ev) {
        var s = parse(ev.start), e = ev.end ? parse(ev.end) : s, ps = parts(s), pe = parts(e);
        var ms = ps.year * 100 + ps.month, me = pe.year * 100 + pe.month;
        return dayKey(e) >= today.key && ms <= m1 && me >= m0;
      });
      var label = MONTHS[today.month] + ' and ' + MONTHS[(today.month + 1) % 12];
      host.innerHTML = '<p class="legend">' + esc(label) + '</p>' + (inWindow.length
        ? '<ul class="grid list-plain" role="list">' + inWindow.map(function (ev) { return card(ev, links, today); }).join('') + '</ul>'
        : '<p>Nothing is scheduled for ' + esc(label) + '. See the <a href="' + esc(links.events) + '">events page</a> for what comes next.</p>');
      return;
    }
    var upcoming = sorted.filter(function (ev) { return dayKey(ev.end ? parse(ev.end) : parse(ev.start)) >= today.key; });
    var held = sorted.filter(function (ev) { return dayKey(ev.end ? parse(ev.end) : parse(ev.start)) < today.key; }).reverse();
    host.innerHTML =
      '<h2 id="upcoming-title">Upcoming</h2>' + (upcoming.length ? '<ul class="grid list-plain" role="list">' + upcoming.map(function (ev) { return card(ev, links, today); }).join('') + '</ul>' : '<p>Nothing scheduled yet.</p>') +
      '<h2 id="held-title" class="stack-top">Held</h2>' + (held.length ? '<ul class="grid list-plain" role="list">' + held.map(function (ev) { return card(ev, links, today); }).join('') + '</ul>' : '<p>None recorded.</p>');
  }

  document.addEventListener('DOMContentLoaded', render);
})();
