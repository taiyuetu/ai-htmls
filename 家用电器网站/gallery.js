// ================================================
// GALLERY PAGE JAVASCRIPT
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================================
    // GALLERY DATA
    // ================================================
    const galleryData = [
        {
            title: 'Modern Luxury Suite',
            category: 'Residential',
            description: 'A sophisticated master bathroom featuring our premium ceramic collection with minimalist fixtures and elegant marble accents. Custom-designed washbasin with integrated storage and state-of-the-art shower system.',
            categories: ['residential', 'modern']
        },
        {
            title: 'Executive Washroom',
            category: 'Commercial',
            description: 'High-end corporate bathroom design with contemporary styling. Features include touchless faucets, premium wall-hung toilets, and designer lighting for a professional atmosphere.',
            categories: ['commercial', 'modern']
        },
        {
            title: 'Boutique Hotel Suite',
            category: 'Hotels & Spas',
            description: 'Luxurious hotel bathroom combining classic elegance with modern comfort. Includes freestanding soaking tub, rainfall shower, and custom vanity with marble countertops.',
            categories: ['hotels', 'classic']
        },
        {
            title: 'Minimalist Haven',
            category: 'Residential',
            description: 'Clean lines and pure white surfaces define this zen-inspired bathroom. Features wall-mounted fixtures, hidden storage, and our signature minimalist washbasin collection.',
            categories: ['residential', 'minimalist']
        },
        {
            title: 'Spa Retreat',
            category: 'Hotels & Spas',
            description: 'Resort-style spa bathroom with natural materials and modern technology. Includes chromotherapy shower, heated floors, and luxury bathtub with hydrotherapy features.',
            categories: ['hotels', 'modern']
        },
        {
            title: 'Corporate Restroom',
            category: 'Commercial',
            description: 'Contemporary office bathroom designed for high traffic. Features durable materials, efficient layouts, and sustainable water-saving fixtures.',
            categories: ['commercial', 'modern']
        },
        {
            title: 'Classic Elegance',
            category: 'Residential',
            description: 'Traditional bathroom design with timeless appeal. Features include clawfoot tub, pedestal sink, vintage-inspired fixtures, and intricate tile work.',
            categories: ['residential', 'classic']
        },
        {
            title: 'Contemporary Design',
            category: 'Residential',
            description: 'Modern residential bathroom with bold geometric patterns and innovative fixtures. Includes floating vanity, frameless glass shower, and designer mirrors.',
            categories: ['residential', 'modern']
        },
        {
            title: 'Zen Spa Experience',
            category: 'Hotels & Spas',
            description: 'Tranquil spa bathroom inspired by Japanese design principles. Natural stone, wood accents, and our premium minimalist collection create a peaceful sanctuary.',
            categories: ['hotels', 'minimalist']
        },
        {
            title: 'Modern Office',
            category: 'Commercial',
            description: 'Sleek commercial bathroom with space-efficient design. Features include smart sensors, easy-clean surfaces, and contemporary fixtures for modern workplaces.',
            categories: ['commercial', 'minimalist']
        },
        {
            title: 'Victorian Revival',
            category: 'Residential',
            description: 'Period-inspired bathroom with authentic Victorian details. Features ornate fixtures, traditional freestanding tub, and classic hexagonal floor tiles.',
            categories: ['residential', 'classic']
        },
        {
            title: 'Luxury Resort',
            category: 'Hotels & Spas',
            description: 'Five-star resort bathroom with panoramic views. Includes oversized soaking tub, dual rain showers, heated towel rails, and premium Italian fixtures.',
            categories: ['hotels', 'modern']
        }
    ];
    
    // ================================================
    // LIGHTBOX FUNCTIONALITY
    // ================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxCategory = lightbox.querySelector('.lightbox-category');
    const lightboxDescription = lightbox.querySelector('.lightbox-description');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    let currentImageIndex = 0;
    let currentFilter = 'all';
    let filteredItems = [];
    
    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Update lightbox content
    function updateLightboxContent() {
        const data = galleryData[currentImageIndex];
        lightboxTitle.textContent = data.title;
        lightboxCategory.textContent = data.category;
        lightboxDescription.textContent = data.description;
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryData.length}`;
    }
    
    // Navigate to previous image
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
        updateLightboxContent();
    }
    
    // Navigate to next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryData.length;
        updateLightboxContent();
    }
    
    // Event listeners for lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);
    
    // Close on overlay click
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
    
    // Add click event to all zoom buttons
    const zoomButtons = document.querySelectorAll('.gallery-zoom');
    zoomButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.getAttribute('data-index'));
            openLightbox(index);
        });
    });
    
    // ================================================
    // FILTER FUNCTIONALITY
    // ================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;
            
            // Filter gallery items
            filterGallery(filter);
        });
    });
    
    function filterGallery(filter) {
        galleryItems.forEach((item, index) => {
            const categories = item.getAttribute('data-category').split(' ');
            
            if (filter === 'all' || categories.includes(filter)) {
                // Show item with animation
                item.classList.remove('filtering-out', 'hidden');
                item.classList.add('filtering-in');
                
                setTimeout(() => {
                    item.classList.remove('filtering-in');
                }, 500);
            } else {
                // Hide item with animation
                item.classList.add('filtering-out');
                
                setTimeout(() => {
                    item.classList.remove('filtering-out');
                    item.classList.add('hidden');
                }, 300);
            }
        });
    }
    
    // ================================================
    // LOAD MORE FUNCTIONALITY
    // ================================================
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Create loading spinner
            this.innerHTML = '<span class="loading-spinner"></span>';
            this.disabled = true;
            
            // Simulate loading
            setTimeout(() => {
                // In production, this would load more images from the server
                this.innerHTML = 'No More Projects';
                this.classList.add('disabled');
                
                // Could also hide the button
                // this.style.display = 'none';
            }, 1500);
        });
    }
    
    // ================================================
    // GALLERY ITEM HOVER ENHANCEMENTS
    // ================================================
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Add subtle tilt effect
            this.style.transform = 'translateY(-8px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // ================================================
    // LAZY LOADING IMAGES (OPTIONAL)
    // ================================================
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.01
    };
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                item.classList.add('loaded');
                observer.unobserve(item);
            }
        });
    }, observerOptions);
    
    galleryItems.forEach(item => {
        imageObserver.observe(item);
    });
    
    // ================================================
    // TOUCH SWIPE SUPPORT FOR LIGHTBOX
    // ================================================
    let touchStartX = 0;
    let touchEndX = 0;
    
    const lightboxContainer = lightbox.querySelector('.lightbox-container');
    
    lightboxContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    lightboxContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next image
                nextImage();
            } else {
                // Swiped right - previous image
                prevImage();
            }
        }
    }
    
    // ================================================
    // GALLERY STATS COUNTER ANIMATION
    // ================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                animateValue(target, finalValue);
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    function animateValue(element, finalValue) {
        // Extract number from string (e.g., "500+" -> 500)
        const match = finalValue.match(/\d+/);
        if (!match) return;
        
        const num = parseInt(match[0]);
        const suffix = finalValue.replace(/\d+/, '');
        const duration = 2000;
        const steps = 60;
        const increment = num / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
                element.textContent = finalValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, duration / steps);
    }
    
    // ================================================
    // SMOOTH SCROLL FOR FILTER BAR
    // ================================================
    const galleryFilters = document.querySelector('.gallery-filters');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            galleryFilters.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            galleryFilters.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
    
    // ================================================
    // PRELOAD ADJACENT IMAGES IN LIGHTBOX
    // ================================================
    function preloadAdjacentImages(index) {
        const prevIndex = (index - 1 + galleryData.length) % galleryData.length;
        const nextIndex = (index + 1) % galleryData.length;
        
        // In production, preload actual images
        // const prevImg = new Image();
        // prevImg.src = galleryData[prevIndex].imageSrc;
        // const nextImg = new Image();
        // nextImg.src = galleryData[nextIndex].imageSrc;
    }
    
    // ================================================
    // GALLERY GRID LAYOUT OPTIMIZATION
    // ================================================
    function optimizeGridLayout() {
        const grid = document.querySelector('.gallery-grid');
        if (!grid) return;
        
        // Get all visible items
        const visibleItems = Array.from(galleryItems).filter(item => 
            !item.classList.contains('hidden')
        );
        
        // Recalculate grid if needed
        // This helps maintain masonry layout after filtering
        if (visibleItems.length > 0) {
            grid.style.gridAutoFlow = 'dense';
        }
    }
    
    // Call after filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(optimizeGridLayout, 350);
        });
    });
    
    // ================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ================================================
    
    // Add ARIA labels
    zoomButtons.forEach((button, index) => {
        button.setAttribute('aria-label', `View ${galleryData[index].title} in lightbox`);
    });
    
    // Trap focus in lightbox when open
    const focusableElements = lightbox.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        lightbox.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        });
    }
    
    // ================================================
    // INITIAL SETUP
    // ================================================
    
    // Set initial filter to show all items
    filterGallery('all');
    
    console.log('Gallery initialized with', galleryData.length, 'images');
    
});
