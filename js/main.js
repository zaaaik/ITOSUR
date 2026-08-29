// [PLACEHOLDER] Lógica mínima del sitio: menú móvil + resaltado de link activo.
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Marca como activo el link del menú que corresponde a la página actual.
  // Compara rutas limpias (sin .html): "/", "/quienes-somos", etc.
  var current = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (current.length > 1) current = current.replace(/\/$/, ''); // sin slash final, salvo la home
  document.querySelectorAll('.main-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.startsWith('http')) return;
    var hrefNormalized = href.length > 1 ? href.replace(/\/$/, '') : href;
    if (hrefNormalized === current) {
      link.classList.add('active');
    }
  });
});
