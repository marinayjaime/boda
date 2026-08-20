// ============================================================
// Marina & Jaime — 03.07.2027
// Cuenta atrás, animaciones al hacer scroll, menú móvil y envío RSVP
// ============================================================

// Pega aquí la URL de tu Google Apps Script desplegado como Web App
// (termina en /exec). Instrucciones completas en README.md.
const SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRPpfM2XIP6ErkZL5bUcOX3E42np3U_wZ3SASprx99XEvmj5kPR18xH4wn6BI_MzNW0w/exec';

document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Parallax sutil en las fotos del hero ---------- */
  const heroSection = document.querySelector('.hero');
  const heroPhotoImgs = document.querySelectorAll('.hero__photo-img');
  if (heroSection && heroPhotoImgs.length && !reducedMotion) {
    let parallaxTicking = false;
    const updateParallax = () => {
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const offset = Math.max(-1, Math.min(1, -rect.top / window.innerHeight)) * 26;
        heroPhotoImgs.forEach((img) => {
          img.style.transform = `translateY(${offset}px)`;
        });
      }
      parallaxTicking = false;
    };
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
    updateParallax();
  }

  /* ---------- Fondo de fotos en "Nuestra historia" ---------- */
  const storyPhotos = document.querySelectorAll('.story__bg-photo');
  if (storyPhotos.length > 1) {
    let storyIndex = 0;
    setInterval(() => {
      storyPhotos[storyIndex].classList.remove('is-active');
      storyIndex = (storyIndex + 1) % storyPhotos.length;
      storyPhotos[storyIndex].classList.add('is-active');
    }, 2000);
  }

  /* ---------- Cuenta atrás ---------- */
  // Ajusta la hora si la ceremonia no empieza a las 17:00
  const WEDDING_DATE = new Date('2027-07-03T17:00:00+02:00').getTime();

  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
  };

  // Cambia el texto de un dígito con un efecto de "vuelta de página" cuando
  // el valor difiere del que ya tenía, en vez de sustituirlo en seco.
  function setCountdownValue(el, value) {
    if (el.textContent === value) return;
    if (reducedMotion) {
      el.textContent = value;
      return;
    }
    el.classList.remove('is-flipping');
    // Fuerza reflow para poder relanzar la animación en ticks consecutivos
    void el.offsetWidth;
    el.classList.add('is-flipping');
    setTimeout(() => { el.textContent = value; }, 150);
    el.addEventListener('animationend', () => el.classList.remove('is-flipping'), { once: true });
  }

  function updateCountdown() {
    const diff = WEDDING_DATE - Date.now();
    if (diff <= 0) {
      setCountdownValue(els.days, '00');
      setCountdownValue(els.hours, '00');
      setCountdownValue(els.mins, '00');
      setCountdownValue(els.secs, '00');
      return;
    }
    const pad = (n) => String(n).padStart(2, '0');
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    setCountdownValue(els.days, pad(days));
    setCountdownValue(els.hours, pad(hours));
    setCountdownValue(els.mins, pad(mins));
    setCountdownValue(els.secs, pad(secs));
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- Guardar la fecha: descarga .ics (Apple / Outlook) ---------- */
  const icsBtn = document.getElementById('icsBtn');
  if (icsBtn) {
    icsBtn.addEventListener('click', () => {
      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Marina y Jaime//Boda 2027//ES',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'UID:marina-jaime-boda-20270703@marinayjaime.wedding',
        'DTSTAMP:20260101T000000Z',
        'DTSTART:20270703T150000Z',
        'DTEND:20270703T210000Z',
        'SUMMARY:Boda de Marina & Jaime',
        'DESCRIPTION:¡Nos casamos! Ceremonia en la Parroquia de Santa Teresa del Niño Jesús (Palma). Celebración en Carretera Alaró-Orient\\, Km 3\\, Alaró.',
        'LOCATION:Carrer de Pilar Juncosa\\, 13\\, 07014 Palma\\, Illes Balears',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'boda-marina-jaime.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  /* ---------- Nav: fondo al hacer scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Revelado al hacer scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => observer.observe(el));

  /* ---------- Sello de tinta al pulsar los botones ---------- */
  if (!reducedMotion) {
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.8;
        const ink = document.createElement('span');
        ink.className = 'btn__ink';
        ink.style.width = ink.style.height = `${size}px`;
        ink.style.left = `${(e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2}px`;
        ink.style.top = `${(e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2}px`;
        btn.appendChild(ink);
        ink.addEventListener('animationend', () => ink.remove(), { once: true });
      });
    });
  }

  /* ---------- Llamada de atención sobre "Guardar la fecha" ---------- */
  const saveDate = document.querySelector('.save-date');
  if (saveDate && !reducedMotion) {
    // Espera a que termine el fundido de entrada del hero antes de pulsar
    setTimeout(() => {
      saveDate.classList.add('save-date--attn');
      saveDate.addEventListener(
        'animationend',
        () => saveDate.classList.remove('save-date--attn'),
        { once: true }
      );
    }, 1900);
  }

  /* ---------- Contadores en vivo (confirmados, transporte, canciones) ---------- */
  const statConfirmados = document.getElementById('statConfirmados');
  const statTransporte = document.getElementById('statTransporte');
  const statCanciones = document.getElementById('statCanciones');
  const statsReady = statConfirmados && SHEET_SCRIPT_URL && !SHEET_SCRIPT_URL.includes('PON_AQUI');

  function loadStats() {
    if (!statsReady) return;
    fetch(SHEET_SCRIPT_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        statConfirmados.textContent = Number(data.confirmados) || 0;
        statTransporte.textContent = Number(data.transporte) || 0;
        statCanciones.textContent = Number(data.canciones) || 0;
      })
      .catch(() => {
        /* si falla, dejamos el guion por defecto */
      });
  }

  function bumpStat(el) {
    if (!el) return;
    const current = Number(el.textContent) || 0;
    el.textContent = current + 1;
  }

  loadStats();

  /* ---------- Envío del formulario RSVP (Google Sheets vía Apps Script) ---------- */
  const form = document.getElementById('rsvpForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = form.querySelector('.btn--submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!SHEET_SCRIPT_URL || SHEET_SCRIPT_URL.includes('PON_AQUI')) {
      statusEl.textContent = 'Falta conectar el formulario a Google Sheets (revisa el README).';
      statusEl.className = 'form-status error';
      return;
    }

    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    const formData = new FormData(form);

    try {
      // Apps Script no envía cabeceras CORS en la respuesta, así que usamos
      // 'no-cors': el envío funciona pero no podemos leer la respuesta real.
      // Si fetch no lanza una excepción de red, damos la confirmación por buena.
      await fetch(SHEET_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      statusEl.textContent = '¡Gracias! Hemos recibido tu confirmación. Nos vemos en Alaró 💛';
      statusEl.className = 'form-status success';

      // Actualizamos los contadores al momento, sin esperar a volver a leer
      // la Sheet (no-cors impide leer la respuesta real del envío).
      if (formData.get('Asistencia') === 'Sí, allí estaré') bumpStat(statConfirmados);
      if (formData.get('Transporte') === 'Sí') bumpStat(statTransporte);
      if (String(formData.get('Canción') || '').trim() !== '') bumpStat(statCanciones);

      form.reset();
    } catch (err) {
      statusEl.textContent = 'Ha habido un problema al enviar el formulario. Inténtalo de nuevo o escríbenos directamente.';
      statusEl.className = 'form-status error';
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });

});
