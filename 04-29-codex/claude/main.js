/* ═══════════════════════════════════════════════════════
   VÉRITÉ — DIGITAL EXPERIENCE STUDIO
   main.js — Vanilla JS Interactions
═══════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  const hoverTargets = document.querySelectorAll('a, button, .work-card, .service-card, .testi-card, .dot');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    });
  });
})();

/* ══════════════════════════════════════════
   NAV — SCROLL BEHAVIOR & HAMBURGER
══════════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const searchToggle = document.getElementById('search-toggle');
  const searchPanel = document.getElementById('header-search');
  const searchInput = document.getElementById('header-search-input');

  function syncSearchOffset() {
    if (!nav || !searchPanel) return;
    searchPanel.style.top = nav.offsetHeight + 'px';
  }

  // Scroll: add .scrolled class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    syncSearchOffset();
  }, { passive: true });

  syncSearchOffset();
  window.addEventListener('resize', syncSearchOffset);

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      if (searchPanel) {
        searchPanel.classList.remove('open');
        searchToggle?.classList.remove('is-active');
      }
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', () => {
      const willOpen = !searchPanel.classList.contains('open');
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
      searchPanel.classList.toggle('open', willOpen);
      searchToggle.classList.toggle('is-active', willOpen);
      if (willOpen) {
        syncSearchOffset();
        requestAnimationFrame(() => searchInput?.focus());
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchPanel.classList.remove('open');
        searchToggle.classList.remove('is-active');
      }
    });

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (!searchPanel.contains(target) && !searchToggle.contains(target)) {
        searchPanel.classList.remove('open');
        searchToggle.classList.remove('is-active');
      }
    });
  }
})();

/* ══════════════════════════════════════════
   HERO SLIDER
══════════════════════════════════════════ */
(function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');

  if (!slides.length) return;

  let current = 0;
  let autoplayTimer = null;

  function goTo(index) {
    const prev = current;
    slides[prev].classList.remove('active');
    slides[prev].classList.add('exit');

    setTimeout(() => {
      slides[prev].classList.remove('exit');
    }, 600);

    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');

    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(next, 5000);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); startAutoplay(); }
    if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
  });

  // Touch/swipe support
  let touchStartX = 0;
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    heroEl.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    heroEl.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) {
        if (delta < 0) next();
        else prev();
        startAutoplay();
      }
    }, { passive: true });
  }

  startAutoplay();
})();

/* ══════════════════════════════════════════
   SCROLL REVEAL — Intersection Observer
══════════════════════════════════════════ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════════
   HERO REVEAL — animate on load
══════════════════════════════════════════ */
(function initHeroReveal() {
  const heroRevealEls = document.querySelectorAll('.hero-slide.active .reveal-up');

  heroRevealEls.forEach((el, i) => {
    const delay = el.dataset.delay || 0;
    el.style.transitionDelay = (parseFloat(delay) * 0.15) + 's';
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 100);
    });
  });
})();

/* ══════════════════════════════════════════
   PARALLAX — subtle depth on scroll
══════════════════════════════════════════ */
(function initParallax() {
  const heroMockup = document.querySelector('.hero-mockup');
  const heroBgGrid = document.querySelector('.hero-bg-grid');
  const orbs = document.querySelectorAll('.cta-gradient-orb');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (heroBgGrid) {
      heroBgGrid.style.transform = `translateY(${scrollY * 0.3}px)`;
    }

    orbs.forEach((orb, i) => {
      const direction = i === 0 ? 1 : -1;
      orb.style.transform = `translateY(${scrollY * 0.08 * direction}px)`;
    });

  }, { passive: true });
})();

/* ══════════════════════════════════════════
   WORK CARDS — Tilt effect on hover
══════════════════════════════════════════ */
(function initCardTilt() {
  const cards = document.querySelectorAll('.work-card, .service-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      const tiltX = -y * 4;
      const tiltY = x * 4;
      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ══════════════════════════════════════════
   COUNTER ANIMATION — stats in hero
══════════════════════════════════════════ */
(function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');

  function animateCounter(el) {
    const target = el.textContent;
    const numMatch = target.match(/[\d.]+/);
    if (!numMatch) return;

    const endVal = parseFloat(numMatch[0]);
    const suffix = target.replace(numMatch[0], '');
    const prefix = target.split(numMatch[0])[0];
    const duration = 1200;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(endVal * ease * 10) / 10;
      el.textContent = prefix + (Number.isInteger(endVal) ? Math.round(current) : current) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
══════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav')?.offsetHeight || 80;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();

/* ══════════════════════════════════════════
   MARQUEE — pause on hover
══════════════════════════════════════════ */
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  const strip = document.querySelector('.marquee-strip');
  if (strip) {
    strip.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    strip.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  }
})();

/* ══════════════════════════════════════════
   PROCESS STEP — highlight on scroll into view
══════════════════════════════════════════ */
(function initProcessSteps() {
  const steps = document.querySelectorAll('.process-step');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelector('.ps-icon-frame')?.style.setProperty('border-color', 'var(--accent)');
      }
    });
  }, { threshold: 0.5 });

  steps.forEach(step => observer.observe(step));
})();

/* ══════════════════════════════════════════
   FOOTER — current year
══════════════════════════════════════════ */
(function updateYear() {
  const yearEls = document.querySelectorAll('[data-year]');
  const y = new Date().getFullYear();
  yearEls.forEach(el => el.textContent = y);

  // Also update in footer bottom text if present
  const footerBottom = document.querySelector('.footer-bottom span:first-child');
  if (footerBottom) {
    footerBottom.textContent = footerBottom.textContent.replace(/\d{4}/, y);
  }
})();

/* ══════════════════════════════════════════
   PERFORMANCE: prefers-reduced-motion
══════════════════════════════════════════ */
(function respectReducedMotion() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.documentElement.style.setProperty('--ease-out', 'ease');
    const allAnimated = document.querySelectorAll('[style*="animation"]');
    allAnimated.forEach(el => el.style.animation = 'none');
  }
})();

/* ══════════════════════════════════════════
   ACTIVE NAV LINK HIGHLIGHT on scroll
══════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--white)';
      }
    });
  }, { passive: true });
})();

/* PORTFOLIO GRID PAGINATION */
(function initPortfolioPagination() {
  const grid = document.querySelector('[data-pagination-grid]');
  const controls = document.querySelector('[data-pagination-controls]');
  const pageNumbers = document.querySelector('[data-page-numbers]');
  const prevBtn = document.querySelector('[data-page-prev]');
  const nextBtn = document.querySelector('[data-page-next]');
  const items = Array.from(document.querySelectorAll('[data-page-item]'));

  if (!grid || !controls || !pageNumbers || !prevBtn || !nextBtn || !items.length) return;

  const perPage = 6;
  const totalPages = Math.ceil(items.length / perPage);
  let currentPage = 1;

  function renderPageButtons() {
    pageNumbers.innerHTML = '';

    for (let i = 1; i <= totalPages; i += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pagination-number';
      button.textContent = String(i);
      button.setAttribute('aria-label', `Go to page ${i}`);
      button.classList.toggle('is-active', i === currentPage);
      button.addEventListener('click', () => goToPage(i));
      pageNumbers.appendChild(button);
    }
  }

  function updateItems() {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    items.forEach((item, index) => {
      item.classList.toggle('is-hidden', index < start || index >= end);
    });

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    renderPageButtons();
  }

  function goToPage(page) {
    currentPage = Math.min(Math.max(page, 1), totalPages);
    updateItems();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

  updateItems();
})();

console.log('%cVÉRITÉ Studio — Built with obsession ◈', 'color: #c8f23d; font-size: 14px; font-weight: bold;');
