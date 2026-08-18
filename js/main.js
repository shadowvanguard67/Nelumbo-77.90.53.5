(function () {
  'use strict';

  // ── Navigation scroll state ──
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Mobile menu ──
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ── Copy IP functionality ──
  function copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
  }

  function bindCopyButtons() {
    const copyTargets = document.querySelectorAll('[data-ip]');

    copyTargets.forEach((el) => {
      el.addEventListener('click', async () => {
        const ip = el.dataset.ip;
        try {
          await copyToClipboard(ip);
          showCopyFeedback(el);
        } catch {
          fallbackCopy(ip);
        }
      });
    });
  }

  function showCopyFeedback(el) {
    const feedback = document.getElementById('copy-feedback');
    if (feedback && el.id === 'copy-ip') {
      feedback.textContent = 'Copied to clipboard';
      setTimeout(() => { feedback.textContent = ''; }, 2000);
      return;
    }

    const copyLabel = el.querySelector('.step-ip-copy');
    if (copyLabel) {
      const original = copyLabel.textContent;
      copyLabel.textContent = 'Copied!';
      setTimeout(() => { copyLabel.textContent = original; }, 2000);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  bindCopyButtons();

  // ── Initialize local hero trailer video (autoplay muted, user can unmute) ──
  (function initLocalTrailer(){
    try {
      const video = document.getElementById('hero-video');
      const btn = document.getElementById('video-unmute');
      if (!video) return;

      // Ensure video is muted for autoplay policies and attempt to play
      video.muted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(function () {
          // autoplay blocked in some contexts — still fine, user can click unmute to start with sound
        });
      }

      if (!btn) return;

      btn.addEventListener('click', function () {
        const wasMuted = video.muted;
        // toggling muted is considered a user gesture and should allow audio to play
        video.muted = !wasMuted;
        btn.setAttribute('aria-pressed', String(!video.muted));
        btn.setAttribute('aria-label', video.muted ? 'Unmute trailer' : 'Mute trailer');
        // try to resume playback with audio if unmuted
        if (!video.muted) {
          video.play().catch(function () {});
        }
        // simple visual feedback: toggle class on button
        btn.classList.toggle('muted', video.muted);
      });

    } catch (e) {
      // ignore initialization errors
    }
  })();

  // ── Scroll reveal ──
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // Hero elements visible on load
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero .reveal').forEach((el) => {
      el.classList.add('visible');
    });
  });

  // ── Particle system ──
  const canvas = document.getElementById('particles');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticle() {
      const palette = [
        'rgba(74,154,58,0.9)', // grass/emerald
        'rgba(201,168,76,0.95)', // gold
        'rgba(212,86,138,0.95)', // lotus
        'rgba(60,60,60,0.9)'
      ];
      return {
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * canvas.height),
        size: Math.floor(Math.random() * 6) + 4,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: -Math.random() * 0.6 - 0.2,
        color: palette[Math.floor(Math.random() * palette.length)],
      };
    }

    function initParticles() {
      const count = Math.min(80, Math.floor(window.innerWidth / 20));
      particles = Array.from({ length: count }, createParticle);
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw as pixelated blocks
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
      });

      animId = requestAnimationFrame(drawParticles);
    }

    resize();
    initParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        drawParticles();
      }
    });
  }

  // ── Smooth anchor offset for fixed nav ──
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // small pulse when copying IPs (visual feedback)
  document.querySelectorAll('[data-ip]').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.add('block-bounce');
      setTimeout(() => btn.classList.remove('block-bounce'), 450);
    });
  });

  // Additional interactive animations: parallax, ripple, and card tilt
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Parallax for world background
    const worldBg = document.querySelector('.world-bg-image');
    if (worldBg) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY * 0.03; // subtle translate
        worldBg.style.transform = `scale(1.1) translateY(${y}px)`;
      }, { passive: true });
    }

    // Ripple effect for clickable elements
    function createRipple(e) {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => { ripple.remove(); }, 650);
    }

    document.querySelectorAll('.btn, .status-ip-btn, .footer-link-btn, .hero-ip-value, .step-ip').forEach((el) => {
      el.addEventListener('click', createRipple);
    });

    // 3D tilt for feature cards
    document.querySelectorAll('.feature-card').forEach((card) => {
      card.classList.add('pixel-shake');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rx = (-y) * 6; // rotateX
        const ry = x * 6; // rotateY
        card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
})();
