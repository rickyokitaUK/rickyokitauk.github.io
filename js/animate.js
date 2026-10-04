// Astro Sphere's staggered fade-up, triggered per element as it scrolls into view
// (the original revealed every .animate on load, staggered by DOM index).
(function () {
  function reveal() {
    var els = document.querySelectorAll('.animate:not(.show)');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('show'); });
      return;
    }
    var batch = 0;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add('show'); }, Math.min(batch++, 6) * 120);
        io.unobserve(el);
      });
      batch = 0;
    }, { rootMargin: '0px 0px -5% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  document.addEventListener('DOMContentLoaded', reveal);
})();
