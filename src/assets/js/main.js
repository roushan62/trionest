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

  /* ---------- header height -> CSS var (keeps drawer / offsets exact) ---------- */
  var headEl = document.getElementById('head');
  function syncHeadHeight() {
    if (!headEl) return;
    var h = Math.round(headEl.getBoundingClientRect().height);
    if (h > 0) document.documentElement.style.setProperty('--head-h', h + 'px');
  }
  syncHeadHeight();
  window.addEventListener('resize', syncHeadHeight, passiveArg);
  window.addEventListener('load', syncHeadHeight);

  /* ---------- mobile drawer navigation ---------- */
  var burger = document.querySelector('.burger');
  var drawer = document.getElementById('mobile-nav');
  var desktopMQ = window.matchMedia('(min-width: 1100px)');

  if (burger && drawer) {
    var panel = drawer.querySelector('.drawer__panel');
    var scrim = drawer.querySelector('.drawer__scrim');
    var lastFocus = null;

    function focusables() {
      return Array.prototype.filter.call(
        drawer.querySelectorAll('a[href], button:not([disabled])'),
        function (el) { return el.offsetParent !== null || el === panel; }
      );
    }

    function openDrawer() {
      lastFocus = document.activeElement;
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      if (scrim) scrim.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('nav-open');
      if (panel) { try { panel.focus({ preventScroll: true }); } catch (e) { panel.focus(); } }
    }

    function closeDrawer(returnFocus) {
      if (!drawer.classList.contains('is-open')) return;
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('nav-open');
      window.setTimeout(function () {
        if (!drawer.classList.contains('is-open') && scrim) scrim.hidden = true;
      }, 300);
      if (returnFocus !== false) {
        var target = lastFocus && document.contains(lastFocus) ? lastFocus : burger;
        try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); }
      }
    }

    burger.addEventListener('click', function () {
      if (drawer.classList.contains('is-open')) closeDrawer();
      else openDrawer();
    });

    drawer.addEventListener('click', function (e) {
      if (e.target.closest('[data-nav-close]')) { closeDrawer(); return; }

      var toggle = e.target.closest('.mnav__toggle');
      if (toggle) {
        e.preventDefault();
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        var sub = document.getElementById(toggle.getAttribute('aria-controls'));
        toggle.setAttribute('aria-expanded', String(!expanded));
        if (sub) sub.hidden = expanded;
        return;
      }

      /* Any real navigation closes the drawer (incl. same-page anchors) */
      if (e.target.closest('a[href]')) closeDrawer(false);
    });

    document.addEventListener('keydown', function (e) {
      if (!drawer.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
      if (e.key === 'Tab') {
        var items = focusables();
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });

    /* Leaving mobile widths must never leave a half-open drawer behind */
    var onBreakpoint = function (e) { if (e.matches) closeDrawer(false); };
    if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', onBreakpoint);
    else if (desktopMQ.addListener) desktopMQ.addListener(onBreakpoint);
  }

  /* ---------- desktop dropdowns: click/keyboard support alongside hover ---------- */
  var headerNav = document.getElementById('nav');
  if (headerNav) {
    var closeAllSubnavs = function (except) {
      Array.prototype.forEach.call(headerNav.querySelectorAll('.nav__toggle[aria-expanded="true"]'), function (t) {
        if (t !== except) t.setAttribute('aria-expanded', 'false');
      });
    };

    headerNav.addEventListener('click', function (e) {
      var toggle = e.target.closest('.nav__toggle');
      if (!toggle || !desktopMQ.matches) return;
      e.preventDefault();
      var open = toggle.getAttribute('aria-expanded') === 'true';
      closeAllSubnavs(toggle);
      toggle.setAttribute('aria-expanded', String(!open));
    });

    headerNav.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = headerNav.querySelector('.nav__toggle[aria-expanded="true"]');
      if (open) { closeAllSubnavs(); open.focus(); }
    });

    document.addEventListener('click', function (e) {
      if (!headerNav.contains(e.target)) closeAllSubnavs();
    }, passiveArg);

    /* Hovering out of the item resets the click-opened state */
    Array.prototype.forEach.call(headerNav.querySelectorAll('.nav__item--has-sub'), function (item) {
      item.addEventListener('mouseleave', function () {
        var t = item.querySelector('.nav__toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });
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

    function resetFilters() {
      [selSector, selVertical, selCity].forEach(function (el) { if (el) el.value = ''; });
      apply();
    }
    var reset = document.getElementById('f-reset');
    if (reset) reset.addEventListener('click', resetFilters);
    document.querySelectorAll('[data-filter-reset]').forEach(function (el) {
      el.addEventListener('click', resetFilters);
    });

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
    var configured = !!action && action.indexOf('REPLACE_WITH_YOUR_FORM_ID') === -1;

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
        say('Opening your email client so nothing is lost. You can also WhatsApp us on +91 87965 75719.', true);
        window.location.href = 'mailto:spaces@trionest.in?subject=' + subject + '&body=' + body;
        return;
      }

      if (submit) { submit.disabled = true; submit.dataset.label = submit.textContent; submit.textContent = 'Sending\u2026'; }

      fetch(action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin',
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (payload) {
            if (!res.ok || payload.ok === false) {
              throw new Error(payload.message || 'We could not send that.');
            }
            return payload;
          });
        })
        .then(function () {
          form.reset();
          say('Thank you. Your enquiry has been received \u2014 we typically respond within one working day.', true);
        })
        .catch(function (err) {
          var msg = err && err.message;
          if (!msg || /failed to fetch|networkerror|we could not send that\.?$/i.test(msg)) {
            msg = 'We could not send that. Please email spaces@trionest.in or call +91 87965 75719.';
          }
          say(msg, false);
        })
        .finally(function () {
          if (submit) { submit.disabled = false; submit.textContent = submit.dataset.label || 'Send enquiry'; }
        });
    });
  });

  /* ---------- smooth scroll for anchor links (offset by the sticky header) ---------- */
  function headerOffset() {
    var h = document.getElementById('head');
    return h && getComputedStyle(h).position === 'sticky' ? h.getBoundingClientRect().height + 12 : 12;
  }

  function scrollToTarget(target) {
    var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    window.scrollTo({
      top: Math.max(top, 0),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var id = link.getAttribute('href');
    if (!id || id === '#' || id.length < 2) return;
    var target;
    try { target = document.querySelector(id); } catch (err) { return; }
    if (!target) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      scrollToTarget(target);
      if (history.replaceState) history.replaceState(null, '', id);
      if (typeof target.focus === 'function') {
        target.setAttribute('tabindex', '-1');
        try { target.focus({ preventScroll: true }); } catch (err) {}
      }
    });
  });

  /* Deep links (/page/#section) must clear the sticky header too */
  if (location.hash && location.hash.length > 1) {
    window.setTimeout(function () {
      var el;
      try { el = document.querySelector(location.hash); } catch (err) { return; }
      if (el) scrollToTarget(el);
    }, 60);
  }

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

  /* ---------- header: scrolled state + hide on scroll down ---------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var head = document.getElementById('head');
  var progressBar = null;
  if (head) {
    var lastScroll = window.scrollY || 0;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var y = Math.max(window.scrollY || window.pageYOffset || 0, 0);
        head.classList.toggle('is-scrolled', y > 10);

        var menuOpen = document.body.classList.contains('nav-open');
        var scrollingDown = y - lastScroll > 4;
        var scrollingUp = lastScroll - y > 4;

        if (!reduced && !menuOpen && y > 260 && scrollingDown) {
          head.classList.add('is-hidden');
        } else if (scrollingUp || y <= 260 || menuOpen) {
          head.classList.remove('is-hidden');
        }
        if (Math.abs(y - lastScroll) > 4) lastScroll = y;

        if (progressBar) {
          var doc = document.documentElement;
          var max = doc.scrollHeight - window.innerHeight;
          progressBar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
        }
      });
    }
    window.addEventListener('scroll', onScroll, passiveArg);
    onScroll();
  }

  /* ---------- scroll progress bar + back-to-top ---------- */
  progressBar = document.createElement('div');
  progressBar.className = 'prog';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progressBar);

  var toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'totop';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML =
    '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });
  var toTopTick = false;
  function onScrollToTop() {
    if (toTopTick) return;
    toTopTick = true;
    requestAnimationFrame(function () {
      toTopTick = false;
      toTop.classList.toggle('is-on', window.scrollY > 700);
    });
  }
  window.addEventListener('scroll', onScrollToTop, passiveArg);
  onScrollToTop();
  document.body.appendChild(toTop);

  /* ---------- scroll-reveal system ----------
     Anything already at or above the fold is shown immediately. A safety timer
     reveals everything after 3s, so a stalled observer can never leave a page
     looking blank. */
  var revealables = document.querySelectorAll('[data-reveal]');
  var revealAll = function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (el) {
      el.classList.add('is-in');
    });
  };

  if ('IntersectionObserver' in window && !reduced) {
    var autoTargets = document.querySelectorAll(
      '.sec__head, .sec > .wrap > .grid, .pgrid, .steps, .timeline, .facts, .badges, .offices__grid, .contactlist, .formcard, .loc__grid, .mbanner, .band__inner, .gallery, .carousel',
    );
    Array.prototype.forEach.call(autoTargets, function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.85 && !el.hasAttribute('data-reveal') && !el.querySelector('[data-reveal]')) {
        el.setAttribute('data-reveal', '');
      }
    });
    revealables = document.querySelectorAll('[data-reveal]');

    var revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -5% 0px' },
    );
    Array.prototype.forEach.call(revealables, function (el) {
      /* already visible (deep link, restored scroll position, short page) */
      var r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        el.classList.add('is-in');
      } else {
        revealObs.observe(el);
      }
    });
    window.setTimeout(revealAll, 3000);
  } else {
    revealAll();
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
    var countObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          countObs.unobserve(el);
          var target = parseInt(el.getAttribute('data-count'), 10) || 0;
          var numEl = el.querySelector('.stat__num');
          if (!numEl) return;
          if (reduced) { numEl.textContent = String(target); return; }
          var dur = 1400;
          var start = null;
          function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            numEl.textContent = Math.round(easeOut(p) * target);
            if (p < 1) requestAnimationFrame(step);
            else numEl.textContent = target;
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 },
    );
    Array.prototype.forEach.call(counters, function (c) { countObs.observe(c); });
  }

  /* ---------- cursor glow (desktop pointers only) ---------- */
  if (window.matchMedia('(pointer: fine)').matches && !reduced) {
    var glow = document.createElement('div');
    glow.className = 'glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    var gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    var tx = gx, ty = gy, gTick = false, gOn = false;
    document.addEventListener(
      'pointermove',
      function (e) {
        tx = e.clientX; ty = e.clientY;
        if (!gOn) { gOn = true; glow.style.opacity = '1'; }
        if (!gTick) {
          gTick = true;
          requestAnimationFrame(function () {
            gTick = false;
            gx += (tx - gx) * 0.16;
            gy += (ty - gy) * 0.16;
            glow.style.transform = 'translate(' + (gx - 300) + 'px,' + (gy - 300) + 'px)';
          });
        }
      },
      passiveArg,
    );
  }

  /* ---------- subtle tilt on project / office cards ---------- */
  if (window.matchMedia('(pointer: fine)').matches && !reduced) {
    document.querySelectorAll('.pcard, .ocard').forEach(function (card) {
      var raf = 0;
      card.addEventListener(
        'pointermove',
        function (e) {
          if (raf) return;
          raf = requestAnimationFrame(function () {
            raf = 0;
            var r = card.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width - 0.5;
            var py = (e.clientY - r.top) / r.height - 0.5;
            card.style.setProperty('--tilt-x', (py * -2.6).toFixed(2) + 'deg');
            card.style.setProperty('--tilt-y', (px * 3.2).toFixed(2) + 'deg');
          });
        },
        passiveArg,
      );
      card.addEventListener('pointerleave', function () {
        if (raf) cancelAnimationFrame(raf);
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }
})();
