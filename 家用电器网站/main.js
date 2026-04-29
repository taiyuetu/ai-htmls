(function() {
    'use strict';

    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.header__menu-btn');
    const nav = document.querySelector('.header__nav');
    const navLinks = document.querySelectorAll('.header__nav a');
    const form = document.querySelector('.contact__form');

    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    function toggleMenu() {
        menuBtn.classList.toggle('active');
        nav.classList.toggle('active');
    }

    function closeMenu() {
        menuBtn.classList.remove('active');
        nav.classList.remove('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    menuBtn.addEventListener('click', toggleMenu);

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(handleScroll);
    }, { passive: true });

    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.header__nav a');

    function highlightNav() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const scrollThreshold = viewportHeight * 0.3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop - scrollThreshold && 
                scrollY < sectionTop + sectionHeight - scrollThreshold) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + sectionId) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    let navScrollTimeout;
    window.addEventListener('scroll', function() {
        if (navScrollTimeout) {
            window.cancelAnimationFrame(navScrollTimeout);
        }
        navScrollTimeout = window.requestAnimationFrame(highlightNav);
    }, { passive: true });

    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.system-card, .finish-card, .app-card, .test-card, .integration__protocol, .projects__service');
    animatedElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 50}ms`;
        observer.observe(el);
    });

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            setTimeout(function() {
                submitBtn.textContent = 'Inquiry Submitted';
                submitBtn.style.background = '#4ADE80';
                submitBtn.style.borderColor = '#4ADE80';

                setTimeout(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.disabled = false;
                    form.reset();
                }, 2000);
            }, 1500);
        });
    }

    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const heroCta = document.querySelector('.hero__cta');
    if (heroCta) {
        heroCta.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        heroCta.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }

    const systemCards = document.querySelectorAll('.system-card');
    systemCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const placeholder = this.querySelector('.system-card__placeholder');
            if (placeholder) {
                placeholder.style.transform = 'scale(1.02)';
            }
        });
        card.addEventListener('mouseleave', function() {
            const placeholder = this.querySelector('.system-card__placeholder');
            if (placeholder) {
                placeholder.style.transform = 'scale(1)';
            }
        });
    });

    const finishCards = document.querySelectorAll('.finish-card');
    const finishesTrack = document.querySelector('.finishes__track');
    
    let isDown = false;
    let startX;
    let scrollLeft;

    if (finishesTrack) {
        finishesTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            finishesTrack.style.cursor = 'grabbing';
            startX = e.pageX - finishesTrack.offsetLeft;
            scrollLeft = finishesTrack.scrollLeft;
        });

        finishesTrack.addEventListener('mouseleave', () => {
            isDown = false;
            finishesTrack.style.cursor = 'grab';
        });

        finishesTrack.addEventListener('mouseup', () => {
            isDown = false;
            finishesTrack.style.cursor = 'grab';
        });

        finishesTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - finishesTrack.offsetLeft;
            const walk = (x - startX) * 2;
            finishesTrack.scrollLeft = scrollLeft - walk;
        });
    }

    const integrationPanel = document.querySelector('.integration__panel');
    const integrationBtns = document.querySelectorAll('.integration__btn');
    
    integrationBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const indicator = document.querySelector('.integration__indicator');
            if (indicator) {
                const values = ['20%', '40%', '65%', '0%'];
                indicator.style.width = values[index];
            }

            const status = document.querySelector('.integration__status');
            if (status) {
                const statuses = ['Scene: Morning', 'Scene: Day', 'Scene: Evening', 'All Off'];
                status.textContent = statuses[index];
            }
        });
    });

    function handleResize() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    }

    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (resizeTimeout) {
            window.clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(handleResize, 100);
    });

    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 15V5M5 10L10 5L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(backToTop);

    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 48px;
            height: 48px;
            background: var(--color-obsidian);
            color: var(--color-white);
            border: none;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        .back-to-top:hover {
            background: var(--color-charcoal);
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);

    function toggleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    let backToTopTimeout;
    window.addEventListener('scroll', function() {
        if (backToTopTimeout) {
            window.cancelAnimationFrame(backToTopTimeout);
        }
        backToTopTimeout = window.requestAnimationFrame(toggleBackToTop);
    }, { passive: true });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const modules = document.querySelectorAll('.philosophy__module');
    modules.forEach((module, index) => {
        module.addEventListener('mouseenter', function() {
            const connector = document.querySelector('.philosophy__connector');
            if (connector) {
                connector.style.background = '#4ADE80';
                connector.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }
        });
        module.addEventListener('mouseleave', function() {
            const connector = document.querySelector('.philosophy__connector');
            if (connector) {
                connector.style.background = '';
                connector.style.transform = '';
            }
        });
    });

    handleScroll();
    highlightNav();

    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }

})();