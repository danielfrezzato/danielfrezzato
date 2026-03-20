/* ╔══════════════════════════════════════════════════════════════╗
   ║  Daniel Frezzato — Interactions & Animations                ║
   ╚══════════════════════════════════════════════════════════════╝ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // ── Navbar scroll effect ─────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ── Mobile menu ──────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);

  const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    backdrop.classList.toggle('visible', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    backdrop.classList.remove('visible');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', closeMenu);

  // Close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ── Scroll reveal (Intersection Observer) ────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Animated counters ────────────────────────────────────────
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let countersStarted = false;

  const animateCounters = () => {
    if (countersStarted) return;
    countersStarted = true;

    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000; // ms
      const fps = 60;
      const totalFrames = Math.round(duration / (1000 / fps));
      let frame = 0;

      const easeOutQuad = t => t * (2 - t);

      const update = () => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        counter.textContent = Math.round(target * progress);

        if (frame < totalFrames) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(update);
    });
  };

  // Observe the stats section
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  // ── Floating particles ───────────────────────────────────────
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.animationDuration = `${6 + Math.random() * 6}s`;
      particle.style.width = `${2 + Math.random() * 3}px`;
      particle.style.height = particle.style.width;

      // Vary colors between accent-1 and accent-2
      const hue = Math.random() > 0.5 ? '190' : '260';
      particle.style.background = `hsl(${hue}, 80%, 65%)`;

      particlesContainer.appendChild(particle);
    }
  }

  // ── Active nav link highlight ────────────────────────────────
  const sections = document.querySelectorAll('.section, .hero');
  const navLinkItems = document.querySelectorAll('.nav-links .nav-link:not(.nav-cta)');

  const highlightNav = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinkItems.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--accent-1)';
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ── Smooth scroll for all anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
