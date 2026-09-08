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

  // Refuerzo del autoplay del video del hero en celulares.
  // Algunos navegadores móviles (Safari iOS, WebViews de Android) ignoran
  // el atributo "autoplay" si "muted" no queda también seteado como
  // propiedad JS antes de llamar a play(), o si el video sigue bufferizando.
  // Si el navegador igual lo bloquea, reintentamos apenas el usuario toque
  // la pantalla (única forma de destrabar el autoplay en esos casos).
  var heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.setAttribute('muted', '');
    heroVideo.play().catch(function () {
      var resumeOnTouch = function () {
        heroVideo.play().catch(function () {});
        document.removeEventListener('touchstart', resumeOnTouch);
        document.removeEventListener('click', resumeOnTouch);
      };
      document.addEventListener('touchstart', resumeOnTouch, { once: true });
      document.addEventListener('click', resumeOnTouch, { once: true });
    });
  }

  // Formulario de postulación (proyecto_a_postular.html): arma el asunto y
  // cuerpo del correo con los datos ingresados y abre Gmail, Outlook o el
  // cliente de correo predeterminado. Como el sitio es estático (sin backend),
  // no "envía" el correo por sí mismo: abre el mail del usuario con todo
  // pre-rellenado para que él le dé a Enviar.
  var postForm = document.getElementById('postulacion-form');
  if (postForm) {
    var destinatario = postForm.getAttribute('data-to') || '';

    var construirMensaje = function () {
      var nombre = postForm.nombre.value.trim();
      var email = postForm.email.value.trim();
      var telefono = postForm.telefono.value.trim();
      var descripcion = postForm.descripcion.value.trim();

      var asunto = 'Postulación de proyecto - ITO SUR';
      var cuerpo = [
        'Hola, quiero postular mi proyecto.',
        '',
        'Nombre: ' + nombre,
        'Correo de contacto: ' + email,
        'Teléfono: ' + (telefono || '-'),
        '',
        'Descripción del proyecto:',
        descripcion
      ].join('\n');

      return { asunto: asunto, cuerpo: cuerpo };
    };

    var enviarPostulacion = function (via) {
      // reportValidity() muestra los mensajes nativos del navegador
      // (campo obligatorio, formato de email, etc.) y corta si falta algo.
      if (!postForm.reportValidity()) return;

      var msg = construirMensaje();
      var asunto = encodeURIComponent(msg.asunto);
      var cuerpo = encodeURIComponent(msg.cuerpo);
      var url;

      if (via === 'gmail') {
        url = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(destinatario) + '&su=' + asunto + '&body=' + cuerpo;
        window.open(url, '_blank', 'noopener');
      } else if (via === 'outlook') {
        url = 'https://outlook.live.com/mail/0/deeplink/compose?to=' + encodeURIComponent(destinatario) + '&subject=' + asunto + '&body=' + cuerpo;
        window.open(url, '_blank', 'noopener');
      } else {
        url = 'mailto:' + destinatario + '?subject=' + asunto + '&body=' + cuerpo;
        window.location.href = url;
      }
    };

    var btnGmail = document.getElementById('btn-enviar-gmail');
    var btnOutlook = document.getElementById('btn-enviar-outlook');
    var btnMailto = document.getElementById('btn-enviar-mailto');

    if (btnGmail) btnGmail.addEventListener('click', function () { enviarPostulacion('gmail'); });
    if (btnOutlook) btnOutlook.addEventListener('click', function () { enviarPostulacion('outlook'); });
    if (btnMailto) btnMailto.addEventListener('click', function () { enviarPostulacion('mailto'); });

    // Si el usuario presiona Enter dentro de un campo, evita que la página
    // se recargue (no hay botón type="submit") y manda por mailto por defecto.
    postForm.addEventListener('submit', function (e) {
      e.preventDefault();
      enviarPostulacion('mailto');
    });
  }
});
