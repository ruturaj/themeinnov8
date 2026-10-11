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

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
});
