// Theme Innov8 — site behaviour
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelectorAll('.nav__links a');

  // Mobile menu
  function setMenu(open) {
    nav.classList.toggle('nav--open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('nav--open')); });
  links.forEach(function (link) { link.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Nav border on scroll
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active section highlight
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const siblings = Array.from(entry.target.parentElement.children);
        entry.target.style.transitionDelay = (siblings.indexOf(entry.target) * 70) + 'ms';
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Hero agent-run animation
  const steps = document.querySelectorAll('.run__steps li');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (steps.length) {
    if (reduceMotion) {
      steps.forEach(function (s) { s.classList.add('is-done'); });
    } else {
      let i = 0;
      (function tick() {
        if (i === steps.length) {
          setTimeout(function () {
            steps.forEach(function (s) { s.classList.remove('is-done', 'is-active'); });
            i = 0;
            tick();
          }, 2600);
          return;
        }
        if (i > 0) { steps[i - 1].classList.remove('is-active'); steps[i - 1].classList.add('is-done'); }
        steps[i].classList.add('is-active');
        i++;
        setTimeout(function () {
          if (i === steps.length) { steps[i - 1].classList.remove('is-active'); steps[i - 1].classList.add('is-done'); }
          tick();
        }, 1100);
      })();
    }
  }

  // Email addresses are assembled here (stored as "user|domain") to keep them away from scrapers
  function address(value) { const p = value.split('|'); return p[0] + '@' + p[1]; }

  document.querySelectorAll('[data-mail]').forEach(function (el) {
    const email = address(el.getAttribute('data-mail'));
    const subject = el.getAttribute('data-subject');
    el.href = 'mailto:' + email + (subject ? '?subject=' + encodeURIComponent(subject) : '');
    if (el.hasAttribute('data-show')) el.textContent = email;
  });

  const toast = document.querySelector('.toast');
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 2200);
  }

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const email = address(btn.getAttribute('data-copy'));
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(
          function () { showToast('Copied ' + email); },
          function () { showToast(email); }
        );
      } else {
        showToast(email);
      }
    });
  });

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
});
