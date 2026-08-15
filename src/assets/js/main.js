/* TrioNest Spaces — progressive enhancement only. No dependencies. Optimised. */
(function () {
  'use strict';

  /* ---------- passive event support detection ---------- */
  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, 'passive', { get: function () { supportsPassive = true; return true; } });
    window.addEventListener('_test', null, opts);
    window.removeEventListener('_test', null, opts);
  } catch (e) {}
  var passiveArg = supportsPassive ? { passive: true } : false;

  /* ---------- mobile nav ---------- */
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    var desktopMQ = window.matchMedia('(min-width: 1100px)');

    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', open);
    });

    nav.addEventListener('click', function (e) {
      var t = e.target.closest('.nav__toggle');
      if (!t) return;
      if (desktopMQ.matches) return;
      e.preventDefault();
      var open = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', String(!open));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('nav-open');
        burger.focus();
      }
    });

    /* Close nav on resize to desktop */
    desktopMQ.addEventListener('change', function (e) {
      if (e.matches && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('nav-open');
      }
    });

    /* Close nav when clicking outside on mobile */
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('nav-open');
      }
    }, passiveArg);
  }

  /* ---------- project filters ---------- */
  var pgrid = document.getElementById('project-grid');
  if (pgrid) {
    var selSector = document.getElementById('f-sector');
    var selVertical = document.getElementById('f-vertical');
    var selCity = document.getElementById('f-city');
    var countEl = document.getElementById('f-count');
    var empty = document.getElementById('f-empty');
    var cards = Array.prototype.slice.call(pgrid.querySelectorAll('[data-project]'));

    function match(card, key, value) {
      if (!value) return true;
      var raw = card.getAttribute('data-' + key) || '';
      return raw.split('|').indexOf(value) !== -1;
    }

    var rafId = 0;
    function apply() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () {
        rafId = 0;
        var s = selSector ? selSector.value : '';
        var v = selVertical ? selVertical.value : '';
        var c = selCity ? selCity.value : '';
        var shown = 0;
        for (var i = 0; i < cards.length; i++) {
          var card = cards[i];
          var ok = match(card, 'sector', s) && match(card, 'vertical', v) && match(card, 'city', c);
          card.hidden = !ok;
          if (ok) shown++;
        }
        if (countEl) {
          countEl.textContent = shown + (shown === 1 ? ' project' : ' projects') + ' matching your filters';
        }
        if (empty) empty.hidden = shown !== 0;

        var params = new URLSearchParams();
        if (s) params.set('sector', s);
        if (v) params.set('vertical', v);
        if (c) params.set('city', c);
        var qs = params.toString();
        history.replaceState(null, '', qs ? '?' + qs : location.pathname);
      });
    }

    [selSector, selVertical, selCity].forEach(function (el) {
      if (el) el.addEventListener('change', apply);
    });

    var reset = document.getElementById('f-reset');
    if (reset) {
      reset.addEventListener('click', function () {
        [selSector, selVertical, selCity].forEach(function (el) { if (el) el.value = ''; });
        apply();
      });
    }

    /* hydrate from query string (?vertical=HVAC etc.) */
    var q = new URLSearchParams(location.search);
    ['sector', 'vertical', 'city'].forEach(function (k) {
      var el = document.getElementById('f-' + k);
      var val = q.get(k);
      if (el && val) {
        var has = Array.prototype.some.call(el.options, function (o) { return o.value === val; });
        if (has) el.value = val;
      }
    });
    apply();
  }

  /* ---------- testimonial carousel ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.carousel__track');
    var prev = root.querySelector('[data-car-prev]');
    var next = root.querySelector('[data-car-next]');
    if (!track) return;
    function step() {
      var first = track.querySelector('.carousel__item');
      return first ? first.getBoundingClientRect().width + 20 : 320;
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  });

  /* ---------- forms (static-host friendly) ---------- */
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var status = form.querySelector('.form__status');
    var submit = form.querySelector('[type="submit"]');
    var action = form.getAttribute('action') || '';
    var configured = action.indexOf('REPLACE_WITH_YOUR_FORM_ID') === -1 && /^https?:/.test(action);

    function say(msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.className = 'form__status ' + (ok ? 'is-ok' : 'is-err');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* honeypot */
      var hp = form.querySelector('input[name="_gotcha"]');
      if (hp && hp.value) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);

      if (!configured) {
        /* No form service configured yet: fall back to a pre-filled email so no lead is lost. */
        var lines = [];
        data.forEach(function (v, k) {
          if (k.charAt(0) === '_' || !String(v).trim()) return;
          lines.push(k.replace(/_/g, ' ') + ': ' + v);
        });
        var subject = encodeURIComponent(form.getAttribute('data-subject') || 'Website enquiry');
        var body = encodeURIComponent(lines.join('\n'));
        say('Opening your email client so nothing is lost. You can also WhatsApp us on +91 93195 74674.', true);
        window.location.href = 'mailto:spaces@trionest.in?subject=' + subject + '&body=' + body;
        return;
      }

      if (submit) { submit.disabled = true; submit.dataset.label = submit.textContent; submit.textContent = 'Sending\u2026'; }

      fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('bad status');
          form.reset();
          say('Thank you. Your enquiry has been received \u2014 we typically respond within one working day.', true);
        })
        .catch(function () {
          say('We could not send that. Please email spaces@trionest.in or call +91 93195 74674.', false);
        })
        .finally(function () {
          if (submit) { submit.disabled = false; submit.textContent = submit.dataset.label || 'Send enquiry'; }
        });
    });
  });

  /* ---------- smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    link.addEventListener('click', function (e) {
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- current year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- lazy image reveal (IntersectionObserver) ---------- */
  if ('IntersectionObserver' in window) {
    var imgObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObs.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });

    document.querySelectorAll('img[data-src]').forEach(function (img) {
      imgObs.observe(img);
    });
  }

  /* ---------- header scroll shadow ---------- */
  var head = document.getElementById('head');
  if (head) {
    var lastScroll = 0;
    var ticking = false;
    function onScroll() {
      lastScroll = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(function () {
          ticking = false;
          if (lastScroll > 10) {
            head.style.boxShadow = '0 6px 24px rgba(28,42,37,.10)';
          } else {
            head.style.boxShadow = 'none';
          }
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, passiveArg);
  }
})();
