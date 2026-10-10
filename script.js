const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#site-nav');

menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
  menuButton.textContent = open ? 'Close' : 'Menu';
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu';
}));

document.querySelector('#year').textContent = new Date().getFullYear();

// Always start at the top on load/reload
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (location.hash) history.replaceState(null, '', location.pathname + location.search);

const jumpToTop = () => {
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  document.documentElement.style.scrollBehavior = '';
};

jumpToTop();
window.addEventListener('load', jumpToTop, { once: true });
setTimeout(jumpToTop, 300);

// Fade each section in once as it enters the viewport; the hero fades in on load via CSS
const revealTargets = document.querySelectorAll('.section:not(.hero), body > footer');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  revealTargets.forEach((el) => observer.observe(el));
}

// Keep the name on a single row at any viewport, zoom, or font state
const nameLine = document.querySelector('h1 .name');

if (nameLine) {
  const fitName = () => {
    const h1 = nameLine.closest('h1');
    const avail = h1.clientWidth - 1;
    // One row = narrow enough to fit, and no taller than a single text line
    const fits = () => {
      const box = nameLine.getBoundingClientRect();
      const size = parseFloat(getComputedStyle(nameLine).fontSize);
      return box.width <= avail && box.height < size * 1.6;
    };
    nameLine.style.fontSize = '';
    let scale = 1;
    while (!fits() && scale > 0.3) {
      scale -= 0.01;
      nameLine.style.fontSize = `${Math.round(scale * 1000) / 10}%`;
    }
  };

  fitName();
  window.addEventListener('resize', fitName);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitName);
}
