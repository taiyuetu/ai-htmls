/* ═══════════════════════════════════════════════════
   VRTX Studio — main.js
   ═══════════════════════════════════════════════════ */

'use strict';

// ── Custom Cursor ──────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (cursor && cursorFollower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverTargets = 'a, button, .work-card__media, .service-card, .client-logo, .testi-btn, .testi-dot, .portfolio-card__media, .archive-filter__chip, .archive-pagination__page, .archive-pagination__nav';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursorFollower.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursorFollower.classList.remove('grow'));
  });
}

// ── Nav Scroll Effect ──────────────────────────────
const nav = document.getElementById('nav');
let lastScroll = 0;

if (nav) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });
}

// ── Mobile Menu ────────────────────────────────────
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

if (navBurger && mobileMenu) {
  navBurger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const spans = navBurger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      const spans = navBurger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    });
  });
}

// ── Intersection Observer — Reveal Animations ──────
const revealEls = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ── Counter Animation ──────────────────────────────
const counters = document.querySelectorAll('.stat__num[data-count]');

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

// ── Testimonials Slider ────────────────────────────
const track    = document.getElementById('testimonialsTrack');
const prevBtn  = document.getElementById('testiPrev');
const nextBtn  = document.getElementById('testiNext');
const dotsWrap = document.getElementById('testiDots');

if (track && prevBtn && nextBtn) {
  const cards = track.querySelectorAll('.testi-card');
  const total = cards.length;
  let current = 0;
  let autoplayTimer = null;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    dotsWrap.querySelectorAll('.testi-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
    resetAutoplay();
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(current + 1), 5000);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // Recalculate on resize
  window.addEventListener('resize', () => {
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
  });

  resetAutoplay();
}

// ── Parallax Hero ──────────────────────────────────
const heroSection = document.getElementById('hero');
const heroContent = heroSection?.querySelector('.hero__content');

if (heroContent) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
      heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.6);
    }
  }, { passive: true });
}

// ── Work Card Tilt Effect ──────────────────────────
document.querySelectorAll('.work-card__media, .portfolio-card__media').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Service Cards Spotlight ────────────────────────
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
  });
});

// ── Smooth Anchor Scrolling ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Portfolio Archive Filter + Pagination ────────────────────────
const archiveRoot = document.querySelector('.portfolio-archive');

if (archiveRoot) {
  const filterButtons = Array.from(archiveRoot.querySelectorAll('[data-archive-filter]'));
  const sortSelect = archiveRoot.querySelector('.archive-sort');
  const searchInput = archiveRoot.querySelector('.archive-search');
  const cards = Array.from(archiveRoot.querySelectorAll('.portfolio-card'));
  const resultsCount = archiveRoot.querySelector('[data-archive-results]');
  const rangeLabel = archiveRoot.querySelector('[data-archive-range]');
  const emptyState = archiveRoot.querySelector('.archive-empty');
  const prevButton = archiveRoot.querySelector('[data-page-control="prev"]');
  const nextButton = archiveRoot.querySelector('[data-page-control="next"]');
  const pagesWrap = archiveRoot.querySelector('.archive-pagination__pages');
  const resetButtons = Array.from(archiveRoot.querySelectorAll('[data-archive-reset]'));

  let activeFilter = 'all';
  let activeSort = sortSelect?.value || 'featured';
  let searchTerm = '';
  let currentPage = 1;

  const getPageSize = () => window.matchMedia('(max-width: 700px)').matches ? 4 : 6;

  function normalize(text) {
    return text.trim().toLowerCase();
  }

  function sortCards(items) {
    return [...items].sort((a, b) => {
      const yearA = parseInt(a.dataset.year || '0', 10);
      const yearB = parseInt(b.dataset.year || '0', 10);
      const featureA = parseInt(a.dataset.featured || '0', 10);
      const featureB = parseInt(b.dataset.featured || '0', 10);

      if (activeSort === 'oldest') {
        return yearA - yearB || featureA - featureB;
      }

      if (activeSort === 'featured') {
        return featureA - featureB || yearB - yearA;
      }

      return yearB - yearA || featureA - featureB;
    });
  }

  function getFilteredCards() {
    const filtered = cards.filter(card => {
      const categories = (card.dataset.categories || '').split(/\s+/).filter(Boolean);
      const text = normalize(card.dataset.search || card.textContent || '');
      const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
      const matchesSearch = !searchTerm || text.includes(searchTerm);
      return matchesFilter && matchesSearch;
    });

    return sortCards(filtered);
  }

  function renderPagination(totalPages) {
    if (!pagesWrap) return;
    pagesWrap.innerHTML = '';

    for (let i = 1; i <= totalPages; i += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'archive-pagination__page' + (i === currentPage ? ' is-active' : '');
      button.dataset.page = String(i);
      button.setAttribute('aria-label', `Go to page ${i}`);
      button.textContent = String(i).padStart(2, '0');
      button.addEventListener('click', () => {
        currentPage = i;
        render();
      });
      pagesWrap.appendChild(button);
    }
  }

  function render() {
    const filtered = getFilteredCards();
    const pageSize = getPageSize();
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * pageSize;
    const visible = filtered.slice(start, start + pageSize);

    cards.forEach(card => {
      card.hidden = !visible.includes(card);
    });

    if (resultsCount) {
      resultsCount.textContent = `${filtered.length}`;
    }

    if (rangeLabel) {
      if (filtered.length === 0) {
        rangeLabel.textContent = 'No projects match the current filters.';
      } else {
        const end = Math.min(start + pageSize, filtered.length);
        rangeLabel.textContent = `Showing ${start + 1} to ${end} of ${filtered.length}`;
      }
    }

    if (emptyState) {
      emptyState.classList.toggle('show', filtered.length === 0);
    }

    if (prevButton) {
      prevButton.disabled = currentPage === 1 || filtered.length === 0;
    }

    if (nextButton) {
      nextButton.disabled = currentPage === totalPages || filtered.length === 0;
    }

    renderPagination(totalPages);
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.archiveFilter || 'all';
      currentPage = 1;
      filterButtons.forEach(item => item.classList.toggle('is-active', item === button));
      render();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      activeSort = sortSelect.value;
      currentPage = 1;
      render();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchTerm = normalize(searchInput.value);
      currentPage = 1;
      render();
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage -= 1;
        render();
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      currentPage += 1;
      render();
    });
  }

  resetButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = 'all';
      activeSort = 'featured';
      searchTerm = '';
      currentPage = 1;
      if (sortSelect) sortSelect.value = 'featured';
      if (searchInput) searchInput.value = '';
      filterButtons.forEach(item => item.classList.toggle('is-active', item.dataset.archiveFilter === 'all'));
      render();
    });
  });

  window.addEventListener('resize', () => {
    render();
  }, { passive: true });

  render();
}

// ── Ticker Pause on Hover ──────────────────────────
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  tickerTrack.addEventListener('mouseenter', () => {
    tickerTrack.style.animationPlayState = 'paused';
  });
  tickerTrack.addEventListener('mouseleave', () => {
    tickerTrack.style.animationPlayState = 'running';
  });
}

// ── Nav Active Link Highlight ──────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--text)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Page Load Reveal ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity .5s ease';
    document.body.style.opacity = '1';
  });
});

// ── Dynamic year in footer ─────────────────────────
const yearEl = document.querySelector('.footer__bottom span');
if (yearEl) {
  yearEl.textContent = yearEl.textContent.replace('2024', new Date().getFullYear());
}

console.log('%cVRTX Studio', 'font-size:24px;font-weight:bold;color:#6c47ff;');
console.log('%cDigital Experience Agency — hello@vrtxstudio.com', 'color:#a78bfa;');
