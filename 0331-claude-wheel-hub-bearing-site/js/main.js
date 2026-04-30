// ============ HEADER SCROLL ============
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ============ MOBILE MENU ============
function toggleMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) mobileMenu.classList.toggle('open');
}

const mobileMenu = document.getElementById('mobileMenu');
if (mobileMenu) {
  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ============ HERO SLIDER ============
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');
const slideNums = ['01', '02', '03'];
const progressBar = document.getElementById('sliderProgress');
let slideTimer, progressTimer, progressWidth = 0;
const SLIDE_DURATION = 6000;

function goToSlide(index) {
  if (!slides.length || !dots.length || !progressBar) return;
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  const slideNum = document.getElementById('slideNum');
  if (slideNum) slideNum.textContent = slideNums[currentSlide];
  resetProgress();
}
function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }
function resetProgress() {
  if (!slides.length || !dots.length || !progressBar) return;
  clearInterval(slideTimer);
  clearInterval(progressTimer);
  progressWidth = 0;
  progressBar.style.transition = 'none';
  progressBar.style.width = '0%';
  requestAnimationFrame(() => {
    progressBar.style.transition = `width ${SLIDE_DURATION}ms linear`;
    progressBar.style.width = '100%';
  });
  slideTimer = setTimeout(nextSlide, SLIDE_DURATION);
}
if (slides.length && dots.length && progressBar) resetProgress();

// ============ STATS COUNTER ============
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  if (Number.isNaN(target)) return;
  const duration = 2000;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(ease * target);
    el.textContent = target >= 1000
      ? (current >= 1000 ? (current / 1000).toFixed(1) + 'K' : current + '+')
      : current + '+';
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target >= 1000 ? (target / 1000).toFixed(0) + 'K+' : target + '+';
  };
  requestAnimationFrame(update);
}

// ============ INTERSECTION OBSERVER ============
if ('IntersectionObserver' in window) {
  const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const counter = entry.target.querySelector('[data-count]');
        if (counter) animateCounter(counter);
        if (entry.target.hasAttribute('data-count')) animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
  document.querySelectorAll('[data-count]').forEach(el => {
    if (!el.closest('.reveal')) observer.observe(el);
  });
}

// ============ SHOWCASE CAROUSEL ============
const track = document.getElementById('showcaseTrack');
let carouselIndex = 0;
const totalSlides = 6;

function getSlideWidth() {
  if (!track || !track.parentElement) return 0;
  const containerW = track.parentElement.offsetWidth;
  const gap = 20;
  const vis = window.innerWidth < 640 ? 1 : window.innerWidth < 960 ? 2 : 3;
  return (containerW - gap * (vis - 1)) / vis + gap;
}

if (track) {
  const carouselNext = document.getElementById('carouselNext');
  const carouselPrev = document.getElementById('carouselPrev');

  if (carouselNext) {
    carouselNext.addEventListener('click', () => {
      const vis = window.innerWidth < 640 ? 1 : window.innerWidth < 960 ? 2 : 3;
      if (carouselIndex < totalSlides - vis) {
        carouselIndex++;
        track.style.transform = `translateX(-${carouselIndex * getSlideWidth()}px)`;
      } else {
        carouselIndex = 0;
        track.style.transform = 'translateX(0)';
      }
    });
  }

  if (carouselPrev) {
    carouselPrev.addEventListener('click', () => {
      const vis = window.innerWidth < 640 ? 1 : window.innerWidth < 960 ? 2 : 3;
      if (carouselIndex > 0) {
        carouselIndex--;
        track.style.transform = `translateX(-${carouselIndex * getSlideWidth()}px)`;
      } else {
        carouselIndex = totalSlides - vis;
        track.style.transform = `translateX(-${carouselIndex * getSlideWidth()}px)`;
      }
    });
  }
}

// ============ CONTACT FORM ============
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const successMsg = document.getElementById('formSuccess');
  if (!btn || !successMsg) return;
  btn.innerHTML = '<span>Submitting...</span>';
  btn.disabled = true;
  setTimeout(() => {
    successMsg.style.display = 'block';
    btn.innerHTML = '<span>Submitted</span>';
    setTimeout(() => {
      btn.innerHTML = '<span>Submit Inquiry</span><svg class="arrow-icon" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      btn.disabled = false;
      successMsg.style.display = 'none';
      e.target.reset();
    }, 5000);
  }, 1500);
}

// ============ SMOOTH REVEAL DELAY ============
document.querySelectorAll('.reveal').forEach((el, i) => {
  if (!el.style.transitionDelay) {
    el.style.transitionDelay = `${(i % 4) * 0.07}s`;
  }
});

// ============ PRODUCT GALLERY ============
const galleryMain = document.querySelector('[data-gallery-main]');
const gallerySlides = document.querySelectorAll('[data-gallery-slide]');
const galleryThumbs = document.querySelectorAll('[data-gallery-target]');

function setGallery(index) {
  if (!gallerySlides.length || !galleryThumbs.length) return;
  const nextIndex = Math.max(0, Math.min(index, gallerySlides.length - 1));
  gallerySlides.forEach((slide, i) => slide.classList.toggle('active', i === nextIndex));
  galleryThumbs.forEach((thumb, i) => {
    const active = i === nextIndex;
    thumb.classList.toggle('active', active);
    thumb.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

if (galleryMain && gallerySlides.length && galleryThumbs.length) {
  galleryThumbs.forEach((thumb) => {
    const index = parseInt(thumb.dataset.galleryTarget, 10);
    if (Number.isNaN(index)) return;
    thumb.addEventListener('mouseenter', () => setGallery(index));
    thumb.addEventListener('focus', () => setGallery(index));
    thumb.addEventListener('click', () => setGallery(index));
  });
  setGallery(0);
}

// ============ PRODUCT TABS ============
const tabButtons = document.querySelectorAll('[data-tab-target]');
const tabPanels = document.querySelectorAll('[data-tab-panel]');

function setTab(name) {
  if (!tabButtons.length || !tabPanels.length) return;
  tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tabTarget === name));
  tabPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.tabPanel === name));
}

if (tabButtons.length && tabPanels.length) {
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => setTab(btn.dataset.tabTarget));
  });
  setTab('details');
}

// ============ SHOWCASE PAGE ============
const showcaseGrid = document.getElementById('showcaseGrid');

if (showcaseGrid) {
  const showcaseFilters = document.querySelectorAll('[data-filter]');
  const showcasePagination = document.getElementById('showcasePagination');
  const showcaseStatus = document.getElementById('showcaseStatus');
  const showcasePageIndicator = document.getElementById('showcasePageIndicator');
  const showcaseTotal = document.querySelector('[data-showcase-total]');
  const lightbox = document.getElementById('showcaseLightbox');
  const lightboxMedia = document.getElementById('showcaseLightboxMedia');
  const lightboxArt = document.getElementById('showcaseLightboxArt');
  const lightboxTitle = document.getElementById('showcaseLightboxTitle');
  const lightboxText = document.getElementById('showcaseLightboxText');
  const lightboxCategory = document.getElementById('showcaseLightboxCategory');
  const lightboxIndex = document.getElementById('showcaseLightboxIndex');
  const lightboxClose = document.getElementById('showcaseLightboxClose');
  const lightboxPrev = document.getElementById('showcasePrev');
  const lightboxNext = document.getElementById('showcaseNext');
  const ITEMS_PER_PAGE = 3;

  const showcaseItems = [
    {
      id: 1,
      category: 'manufacturing',
      categoryLabel: 'Manufacturing',
      title: 'Production Floor Rhythm',
      text: 'Automated machining cells and inspection handoffs aligned for stable, repeatable output across high-volume programs.',
      art: 'rings',
      tones: ['#1A1208', '#0A0A0A']
    },
    {
      id: 2,
      category: 'quality',
      categoryLabel: 'Quality',
      title: 'Inspection Lab Precision',
      text: 'Dimensional verification and endurance evaluation work together to maintain fitment confidence and traceability.',
      art: 'core',
      tones: ['#0F1820', '#0A0A0A']
    },
    {
      id: 3,
      category: 'engineering',
      categoryLabel: 'Engineering',
      title: 'Design Studio Review',
      text: 'Engineering teams refine geometry, seal behavior, and application fit before pilot validation begins.',
      art: 'hex',
      tones: ['#121018', '#090909']
    },
    {
      id: 4,
      category: 'logistics',
      categoryLabel: 'Logistics',
      title: 'Global Warehouse Flow',
      text: 'Regional stock planning and export coordination support faster response times across partner markets.',
      art: 'ellipse',
      tones: ['#16120D', '#0B0B0B']
    },
    {
      id: 5,
      category: 'partnership',
      categoryLabel: 'Partnership',
      title: 'Customer Program Alignment',
      text: 'Commercial and engineering teams work side by side to translate sourcing needs into stable supply programs.',
      art: 'network',
      tones: ['#11161D', '#090909']
    },
    {
      id: 6,
      category: 'manufacturing',
      categoryLabel: 'Manufacturing',
      title: 'Surface Finishing Sequence',
      text: 'Controlled finishing stages improve consistency before assemblies move into packing and dispatch channels.',
      art: 'grid',
      tones: ['#171109', '#0A0A0A']
    },
    {
      id: 7,
      category: 'quality',
      categoryLabel: 'Quality',
      title: 'Durability Validation Bay',
      text: 'Endurance protocols simulate long-cycle stress so teams can evaluate wear behavior before commercial release.',
      art: 'pulse',
      tones: ['#0C1620', '#090909']
    },
    {
      id: 8,
      category: 'engineering',
      categoryLabel: 'Engineering',
      title: 'Prototype Geometry Session',
      text: 'Rapid evaluation loops help narrow design options for EV, heavy-duty, and custom application programs.',
      art: 'orbit',
      tones: ['#15111A', '#090909']
    },
    {
      id: 9,
      category: 'logistics',
      categoryLabel: 'Logistics',
      title: 'APAC Dispatch Planning',
      text: 'Inventory routing and packaging logic shorten delivery windows for mixed-SKU orders across the region.',
      art: 'stack',
      tones: ['#16140D', '#0B0B0B']
    },
    {
      id: 10,
      category: 'partnership',
      categoryLabel: 'Partnership',
      title: 'Global Network Touchpoint',
      text: 'Distributor coordination, technical support, and forecasting reviews keep relationships operating on shared context.',
      art: 'bridge',
      tones: ['#0F1620', '#080808']
    },
    {
      id: 11,
      category: 'manufacturing',
      categoryLabel: 'Manufacturing',
      title: 'Assembly Line Control',
      text: 'Structured assembly checkpoints help maintain clean handoffs from component prep through final packaging.',
      art: 'rings',
      tones: ['#1B1207', '#090909']
    },
    {
      id: 12,
      category: 'engineering',
      categoryLabel: 'Engineering',
      title: 'Next-Gen Platform Review',
      text: 'Platform teams map performance targets, validation plans, and commercialization timing into one operating view.',
      art: 'hex',
      tones: ['#121119', '#0A0A0A']
    }
  ];

  let activeFilter = 'all';
  let currentPage = 1;
  let filteredItems = [...showcaseItems];
  let lightboxItems = [];
  let lightboxCursor = 0;

  function createShowcaseSvg(type) {
    const shapes = {
      rings: '<circle cx="240" cy="180" r="120" stroke="#C9A84C" stroke-width="20" stroke-dasharray="14 8"/><circle cx="240" cy="180" r="64" stroke="#F5F3EE" stroke-opacity="0.25" stroke-width="14"/><circle cx="240" cy="180" r="18" fill="#C9A84C"/>',
      core: '<rect x="110" y="50" width="260" height="260" rx="130" stroke="#C9A84C" stroke-width="16"/><rect x="170" y="110" width="140" height="140" rx="70" stroke="#F5F3EE" stroke-opacity="0.22" stroke-width="12"/><circle cx="240" cy="180" r="24" fill="#C9A84C"/>',
      hex: '<polygon points="240,38 384,120 384,240 240,322 96,240 96,120" stroke="#C9A84C" stroke-width="16"/><circle cx="240" cy="180" r="54" stroke="#F5F3EE" stroke-opacity="0.2" stroke-width="12"/><circle cx="240" cy="180" r="16" fill="#C9A84C"/>',
      ellipse: '<ellipse cx="240" cy="180" rx="150" ry="110" stroke="#C9A84C" stroke-width="16"/><ellipse cx="240" cy="180" rx="82" ry="58" stroke="#F5F3EE" stroke-opacity="0.22" stroke-width="12"/><ellipse cx="240" cy="180" rx="20" ry="16" fill="#C9A84C"/>',
      network: '<circle cx="240" cy="180" r="24" fill="#C9A84C"/><circle cx="132" cy="108" r="18" stroke="#C9A84C" stroke-width="10"/><circle cx="348" cy="108" r="18" stroke="#C9A84C" stroke-width="10"/><circle cx="132" cy="252" r="18" stroke="#F5F3EE" stroke-opacity="0.32" stroke-width="10"/><circle cx="348" cy="252" r="18" stroke="#F5F3EE" stroke-opacity="0.32" stroke-width="10"/><path d="M150 118 222 165M330 118 258 165M150 242 222 195M330 242 258 195" stroke="#C9A84C" stroke-width="8" stroke-linecap="round"/>',
      grid: '<rect x="84" y="56" width="312" height="248" rx="28" stroke="#F5F3EE" stroke-opacity="0.18" stroke-width="12"/><path d="M162 56v248M240 56v248M318 56v248M84 118h312M84 180h312M84 242h312" stroke="#C9A84C" stroke-opacity="0.48" stroke-width="8"/><circle cx="240" cy="180" r="22" fill="#C9A84C"/>',
      pulse: '<path d="M80 186h90l38-78 62 150 42-90h88" stroke="#C9A84C" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><circle cx="240" cy="180" r="118" stroke="#F5F3EE" stroke-opacity="0.14" stroke-width="10"/><circle cx="240" cy="180" r="18" fill="#C9A84C"/>',
      orbit: '<circle cx="240" cy="180" r="122" stroke="#C9A84C" stroke-width="12"/><ellipse cx="240" cy="180" rx="152" ry="72" stroke="#F5F3EE" stroke-opacity="0.2" stroke-width="10"/><ellipse cx="240" cy="180" rx="72" ry="152" stroke="#F5F3EE" stroke-opacity="0.2" stroke-width="10"/><circle cx="240" cy="180" r="18" fill="#C9A84C"/>',
      stack: '<rect x="110" y="82" width="260" height="52" rx="18" stroke="#C9A84C" stroke-width="12"/><rect x="90" y="154" width="300" height="52" rx="18" stroke="#F5F3EE" stroke-opacity="0.22" stroke-width="12"/><rect x="120" y="226" width="240" height="52" rx="18" stroke="#C9A84C" stroke-width="12"/><circle cx="240" cy="180" r="16" fill="#C9A84C"/>',
      bridge: '<path d="M104 232c30-72 76-108 136-108s106 36 136 108" stroke="#C9A84C" stroke-width="16" stroke-linecap="round"/><path d="M136 232v-84M240 232v-124M344 232v-84" stroke="#F5F3EE" stroke-opacity="0.24" stroke-width="10" stroke-linecap="round"/><circle cx="240" cy="132" r="22" fill="#C9A84C"/>'
    };

    return `
      <svg viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        ${shapes[type] || shapes.rings}
      </svg>
    `;
  }

  function createShowcaseArt(item, options = {}) {
    const { withZoom = true } = options;
    const [toneA, toneB] = item.tones;
    return `
      <div class="showcase-card-media" style="background: linear-gradient(135deg, ${toneA}, ${toneB});">
        <div class="showcase-art">${createShowcaseSvg(item.art)}</div>
        ${withZoom ? `
          <div class="showcase-zoom" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M10 10h4m-2-2v4M21 21l-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"/></svg>
          </div>
        ` : ''}
      </div>
    `;
  }

  function getFilteredItems() {
    return activeFilter === 'all'
      ? [...showcaseItems]
      : showcaseItems.filter(item => item.category === activeFilter);
  }

  function updateFilterButtons() {
    showcaseFilters.forEach(btn => {
      const active = btn.dataset.filter === activeFilter;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function openShowcaseLightbox(index) {
    lightboxItems = filteredItems;
    lightboxCursor = index;
    const item = lightboxItems[lightboxCursor];
    if (!item || !lightbox || !lightboxMedia || !lightboxArt) return;

    lightboxArt.innerHTML = createShowcaseArt(item, { withZoom: false });
    lightboxTitle.textContent = item.title;
    lightboxText.textContent = item.text;
    lightboxCategory.textContent = item.categoryLabel;
    lightboxIndex.textContent = `${String(lightboxCursor + 1).padStart(2, '0')} / ${String(lightboxItems.length).padStart(2, '0')}`;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeShowcaseLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function moveShowcaseLightbox(direction) {
    if (!lightboxItems.length) return;
    lightboxCursor = (lightboxCursor + direction + lightboxItems.length) % lightboxItems.length;
    openShowcaseLightbox(lightboxCursor);
  }

  function renderPagination(totalPages) {
    if (!showcasePagination) return;
    showcasePagination.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'pagination-link';
    prevBtn.textContent = 'Prev';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderShowcase();
      }
    });
    showcasePagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.type = 'button';
      pageBtn.className = `pagination-link${i === currentPage ? ' active' : ''}`;
      pageBtn.textContent = String(i);
      pageBtn.addEventListener('click', () => {
        currentPage = i;
        renderShowcase();
      });
      showcasePagination.appendChild(pageBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'pagination-link';
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderShowcase();
      }
    });
    showcasePagination.appendChild(nextBtn);
  }

  function renderShowcase() {
    filteredItems = getFilteredItems();
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pagedItems = filteredItems.slice(start, start + ITEMS_PER_PAGE);

    showcaseGrid.innerHTML = pagedItems.map((item, index) => `
      <article class="showcase-card reveal visible" data-showcase-id="${item.id}">
        <button class="showcase-card-trigger" type="button" data-lightbox-index="${start + index}" aria-label="Open ${item.title} in lightbox">
          ${createShowcaseArt(item)}
        </button>
        <div class="showcase-card-body">
          <div class="showcase-card-meta">
            <span class="showcase-card-cat">${item.categoryLabel}</span>
            <span class="showcase-card-index">${String(item.id).padStart(2, '0')}</span>
          </div>
          <h3 class="showcase-card-title">${item.title}</h3>
          <p class="showcase-card-text">${item.text}</p>
        </div>
      </article>
    `).join('');

    showcaseGrid.querySelectorAll('[data-lightbox-index]').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.lightboxIndex, 10);
        if (!Number.isNaN(index)) openShowcaseLightbox(index);
      });
    });

    const label = activeFilter === 'all'
      ? 'Showing all gallery frames'
      : `Showing ${showcaseFilters.length ? document.querySelector(`[data-filter="${activeFilter}"]`)?.textContent || activeFilter : activeFilter} frames`;

    if (showcaseStatus) showcaseStatus.textContent = label;
    if (showcasePageIndicator) showcasePageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    if (showcaseTotal) showcaseTotal.textContent = String(showcaseItems.length).padStart(2, '0');

    renderPagination(totalPages);
  }

  showcaseFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter || 'all';
      currentPage = 1;
      updateFilterButtons();
      renderShowcase();
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeShowcaseLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => moveShowcaseLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => moveShowcaseLightbox(1));
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeShowcaseLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeShowcaseLightbox();
    if (e.key === 'ArrowLeft') moveShowcaseLightbox(-1);
    if (e.key === 'ArrowRight') moveShowcaseLightbox(1);
  });

  updateFilterButtons();
  renderShowcase();
}

// ============ PRODUCT DETAIL NAV ============
document.querySelectorAll('.product-inquiry').forEach(el => {
  if (el.tagName !== 'A') {
    el.addEventListener('click', () => {
      window.location.href = 'product-details.html';
    });
  }
});

// ============ CURSOR GLOW (desktop) ============
if (window.innerWidth > 960) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;width:300px;height:300px;border-radius:50%;
    background:radial-gradient(circle,rgba(201,168,76,0.04) 0%,transparent 70%);
    pointer-events:none;z-index:9998;transform:translate(-50%,-50%);
    transition:left 0.6s cubic-bezier(0.25,0.46,0.45,0.94),top 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
    left:-300px;top:-300px;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}
