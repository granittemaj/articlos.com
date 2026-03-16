/* Articlos — main.js */

// ── NAV scroll effect ──────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── Mobile nav toggle ──────────────────────────────────────
const toggle = document.getElementById('mobileToggle');
const mobileNav = document.getElementById('mobileNav');
toggle?.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('open'));
});

// ── Scroll reveal ──────────────────────────────────────────
const reveals = document.querySelectorAll(
  '.feature-card, .step, .pricing-card, .logos-bar, .section-header'
);
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ── Animated word count in preview ──────────────────────────
const statusWords = document.querySelector('.status-words');
if (statusWords) {
  let count = 0;
  const target = 312;
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 12) + 4;
    if (count >= target) { count = target; clearInterval(interval); }
    statusWords.textContent = count + ' words';
  }, 120);
}
