/* ==========================================================================
   TrioNest Spaces — main.js (vanilla JS, zero dependencies)
   Header, mobile nav, reveal-on-scroll, counters, filters, accordions,
   contact form (fetch → mail/send.php, mailto fallback), URL prefill,
   floating widgets, footer year.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- header: glass on scroll ---------- */
  var header = $('.site-header');
  var onScroll = function () {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    var fab = $('.fab-top');
    if (fab) {
      if (window.scrollY > 600) fab.classList.add('show');
      else fab.classList.remove('show');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var toggle = $('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', document.body.classList.contains('nav-open') ? 'true' : 'false');
    });
    $$('.mobile-nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- active nav link ---------- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  $$('.main-nav a, .mobile-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- reveal on scroll ---------- */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- animated counters ----------
     HTML carries the final value as fallback (no-JS safe); when JS is
     active we reset to 0 immediately and count up when scrolled into view. */
  var counters = $$('[data-count]');
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }
  counters.forEach(function (el) {
    el.textContent = '0' + (el.getAttribute('data-suffix') || '');
  });
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCounter(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- marquee: duplicate track for seamless loop ---------- */
  $$('.marquee-track').forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* ---------- project filter ---------- */
  var filterBar = $('.filter-bar');
  if (filterBar) {
    var cards = $$('.proj-card');
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      $$('.filter-btn', filterBar).forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var show = (f === 'all') || card.getAttribute('data-sector') === f;
        card.hidden = !show;
        if (show) {
          card.classList.remove('in');
          /* re-trigger reveal */
          void card.offsetWidth;
          card.classList.add('in');
        }
      });
    });
  }

  /* ---------- contact form ---------- */
  var form = $('#contact-form');
  if (form) {
    var status = $('#form-status');
    var submitBtn = $('#form-submit');

    function setInvalid(input, bad) {
      var group = input.closest('.f-group');
      if (!group) return;
      group.classList.toggle('invalid', bad);
    }
    function validate() {
      var ok = true;
      $$('[data-rule]', form).forEach(function (input) {
        var rule = input.getAttribute('data-rule');
        var val = input.value.trim();
        var bad = false;
        if (rule === 'req') bad = val === '';
        if (rule === 'phone') bad = !/^[+]?[\d\s\-()]{10,15}$/.test(val);
        if (rule === 'email') bad = val !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
        if (rule === 'min10') bad = val.length < 10;
        setInvalid(input, bad);
        if (bad) ok = false;
      });
      return ok;
    }
    $$('[data-rule]', form).forEach(function (input) {
      input.addEventListener('input', function () { setInvalid(input, false); });
      input.addEventListener('blur', function () {
        var rule = input.getAttribute('data-rule');
        var val = input.value.trim();
        if (rule === 'req' && val === '') setInvalid(input, true);
        if (rule === 'phone' && val !== '' && !/^[+]?[\d\s\-()]{10,15}$/.test(val)) setInvalid(input, true);
      });
    });

    /* prefill from URL (?service=…&project=…) */
    try {
      var params = new URLSearchParams(window.location.search);
      var svc = params.get('service');
      if (svc) {
        var sel = $('#cf-service');
        if (sel) {
          var norm = function (s) { return s.toLowerCase().replace(/[^a-z0-9]/g, ''); };
          Array.prototype.forEach.call(sel.options, function (o) {
            if (norm(o.value) === norm(svc)) sel.value = o.value;
          });
        }
      }
      var proj = params.get('project');
      if (proj) {
        var msg = $('#cf-message');
        if (msg) msg.value = 'Hi, I would like to discuss a project similar to "' + proj + '". Please share more details.\n\n';
      }
    } catch (e) { /* no-op */ }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) {
        var firstBad = $('.f-group.invalid input, .f-group.invalid select, .f-group.invalid textarea', form);
        if (firstBad) firstBad.focus();
        return;
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      var data = new FormData(form);
      var payload = {};
      data.forEach(function (v, k) { payload[k] = v; });

      function showStatus(kind, html) {
        if (!status) return;
        status.className = 'form-status ' + kind;
        status.innerHTML = html;
        status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      function restore() {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
      }
      function mailtoFallback() {
        var subject = encodeURIComponent('Website enquiry — ' + (payload.name || '') + ' (' + (payload.service || 'General') + ')');
        var body = encodeURIComponent(
          'Name: ' + (payload.name || '') + '\n' +
          'Phone: ' + (payload.phone || '') + '\n' +
          'Email: ' + (payload.email || '') + '\n' +
          'Service: ' + (payload.service || '') + '\n' +
          'City: ' + (payload.city || '') + '\n\n' +
          'Message:\n' + (payload.message || '')
        );
        window.location.href = 'mailto:spaces@trionest.in?subject=' + subject + '&body=' + body;
        showStatus('ok', '✓ Your enquiry is ready in your email app. If it did not open, write to us directly at <a href="mailto:spaces@trionest.in">spaces@trionest.in</a> or call <a href="tel:+918796575719">+91 87965 75719</a>.');
        restore();
      }

      fetch('mail/send.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString()
      })
        .then(function (res) { return res.json().catch(function () { return { ok: false, error: 'Server response not understood.' }; }); })
        .then(function (json) {
          if (json && json.ok) {
            form.reset();
            showStatus('ok', '✓ Thank you, ' + (payload.name || '') + '! Your enquiry has been sent. Our team will call you back within 24 hours. For urgent needs, call <a href="tel:+918796575719">+91 87965 75719</a>.');
          } else {
            mailtoFallback();
          }
        })
        .catch(function () {
          mailtoFallback();
        });
    });
  }

  /* ---------- footer year ---------- */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- smooth anchor (same-page) ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = $(id);
      if (target) e.preventDefault(), target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();
