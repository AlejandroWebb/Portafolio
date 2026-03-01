/* ════════════════════════════════════════
   PORTAFOLIO — main.js
   ════════════════════════════════════════ */

/* ── 1. CUSTOM CURSOR ── */
(function initCursor() {
  const cursor     = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursor.className     = 'cursor';
  cursorRing.className = 'cursor-ring';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorRing);

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx - 6  + 'px';
    cursor.style.top  = my - 6  + 'px';
  });

  // Ring follows with lag
  (function animateRing() {
    rx += (mx - rx - 18) * .12;
    ry += (my - ry - 18) * .12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.addEventListener('mousedown', () => {
    cursor.classList.add('clicking');
    cursorRing.classList.add('clicking');
  });
  document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicking');
    cursorRing.classList.remove('clicking');
  });

  // Hover: grow ring on links/buttons
  document.querySelectorAll('a, button, .tech-tag, .extra-card, .exp-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorRing.style.transform = 'scale(1.6)'; });
    el.addEventListener('mouseleave', () => { cursorRing.style.transform = 'scale(1)'; });
  });
})();


/* ── 2. MATRIX RAIN BACKGROUND ── */
(function initMatrix() {
  const canvas = document.getElementById('matrix-bg');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('');
  const fontSize = 13;
  let cols = Math.floor(canvas.width / fontSize);
  let drops = Array(cols).fill(1);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(12,14,12,.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#40c057';
    ctx.font      = fontSize + 'px JetBrains Mono, monospace';

    for (let i = 0; i < drops.length; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > .975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(drawMatrix, 60);

  window.addEventListener('resize', () => {
    cols  = Math.floor(canvas.width / fontSize);
    drops = Array(cols).fill(1);
  });
})();


/* ── 3. SCROLL REVEAL ── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  elements.forEach(el => observer.observe(el));
})();


/* ── 4. TYPING EFFECT on name ── */
(function initTyping() {
  const el = document.querySelector('.profile-name');
  if (!el) return;

  const fullText = el.innerHTML;
  el.style.opacity = '1'; // keep visible

  // Typewriter on alias only
  const alias = el.querySelector('.alias');
  if (!alias) return;
  const target = alias.textContent;
  alias.textContent = '';

  let idx = 0;
  function type() {
    if (idx <= target.length) {
      alias.textContent = target.slice(0, idx);
      idx++;
      setTimeout(type, 60);
    }
  }
  setTimeout(type, 600);
})();


/* ── 5. AVATAR click easter egg ── */
(function initAvatarEgg() {
  const avatar = document.getElementById('avatarImg');
  if (!avatar) return;
  let clicks = 0;

  const avatars = [
    'https://i.pravatar.cc/150?img=33',
    'https://i.pravatar.cc/150?img=12',
    'https://i.pravatar.cc/150?img=55',
    'https://i.pravatar.cc/150?img=8',
  ];

  avatar.addEventListener('click', () => {
    clicks++;
    const idx = clicks % avatars.length;
    avatar.style.transform = 'scale(0)';
    avatar.style.transition = 'transform .2s';
    setTimeout(() => {
      avatar.src = avatars[idx];
      avatar.style.transform = 'scale(1)';
    }, 200);
  });
  avatar.style.cursor = 'pointer';
})();


/* ── 6. ACTIVE NAV HIGHLIGHT (optional sticky nav) ── */
/* If you add a <nav> later, this handles scroll-spy automatically */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  if (!navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });
})();


/* ── 7. SMOOTH reveal on load ── */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});