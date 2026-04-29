// ================================================
// PRODUCT ARCHIVE PAGE - INTERACTIVE FUNCTIONALITY
// ================================================

(function() {
    'use strict';

    // ================================================
    // MOBILE FILTER TOGGLE
    // ================================================
    
    const filterToggle = document.getElementById('filterToggle');
    const sidebarFilters = document.getElementById('sidebarFilters');
    const filterApply = document.getElementById('filterApply');
    
    if (filterToggle && sidebarFilters) {
        filterToggle.addEventListener('click', () => {
            sidebarFilters.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        if (filterApply) {
            filterApply.addEventListener('click', () => {
                sidebarFilters.classList.remove('active');
                document.body.style.overflow = '';
                applyFilters();
            });
        }
        
        // Close filters when clicking outside
        sidebarFilters.addEventListener('click', (e) => {
            if (e.target === sidebarFilters) {
                sidebarFilters.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ================================================
    // FILTER MANAGEMENT
    // ================================================
    
    const filterInputs = document.querySelectorAll('.filter-option input');
    const filterReset = document.getElementById('filterReset');
    const activeFiltersContainer = document.getElementById('activeFilters');
    
    let activeFilters = {
        category: [],
        style: [],
        finish: [],
        price: 'all',
        application: []
    };
    
    // Listen to filter changes
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateActiveFilters();
            renderActiveFilters();
            
            // On desktop, apply immediately
            if (window.innerWidth > 1024) {
                applyFilters();
            }
        });
    });
    
    // Update active filters object
    function updateActiveFilters() {
        // Reset arrays
        activeFilters.category = [];
        activeFilters.style = [];
        activeFilters.finish = [];
        activeFilters.application = [];
        
        // Collect checked checkboxes
        document.querySelectorAll('input[name="category"]:checked').forEach(input => {
            activeFilters.category.push({
                value: input.value,
                label: input.parentElement.querySelector('.filter-label').textContent
            });
        });
        
        document.querySelectorAll('input[name="style"]:checked').forEach(input => {
            activeFilters.style.push({
                value: input.value,
                label: input.parentElement.querySelector('.filter-label').textContent
            });
        });
        
        document.querySelectorAll('input[name="finish"]:checked').forEach(input => {
            activeFilters.finish.push({
                value: input.value,
                label: input.parentElement.querySelector('.filter-label').textContent
            });
        });
        
        document.querySelectorAll('input[name="application"]:checked').forEach(input => {
            activeFilters.application.push({
                value: input.value,
                label: input.parentElement.querySelector('.filter-label').textContent
            });
        });
        
        // Get selected price range
        const priceInput = document.querySelector('input[name="price"]:checked');
        if (priceInput) {
            activeFilters.price = priceInput.value;
        }
    }
    
    // Render active filter tags
    function renderActiveFilters() {
        if (!activeFiltersContainer) return;
        
        activeFiltersContainer.innerHTML = '';
        
        let hasFilters = false;
        
        // Render category filters
        activeFilters.category.forEach(filter => {
            hasFilters = true;
            activeFiltersContainer.appendChild(createFilterTag(filter.label, 'category', filter.value));
        });
        
        // Render style filters
        activeFilters.style.forEach(filter => {
            hasFilters = true;
            activeFiltersContainer.appendChild(createFilterTag(filter.label, 'style', filter.value));
        });
        
        // Render finish filters
        activeFilters.finish.forEach(filter => {
            hasFilters = true;
            activeFiltersContainer.appendChild(createFilterTag(filter.label, 'finish', filter.value));
        });
        
        // Render application filters
        activeFilters.application.forEach(filter => {
            hasFilters = true;
            activeFiltersContainer.appendChild(createFilterTag(filter.label, 'application', filter.value));
        });
        
        // Render price filter if not "all"
        if (activeFilters.price !== 'all') {
            hasFilters = true;
            const priceLabel = document.querySelector(`input[name="price"][value="${activeFilters.price}"]`)
                .parentElement.querySelector('.filter-label').textContent;
            activeFiltersContainer.appendChild(createFilterTag(priceLabel, 'price', activeFilters.price));
        }
        
        // Show/hide container
        activeFiltersContainer.style.display = hasFilters ? 'flex' : 'none';
    }
    
    // Create filter tag element
    function createFilterTag(label, type, value) {
        const tag = document.createElement('div');
        tag.className = 'filter-tag';
        tag.innerHTML = `
            ${label}
            <span class="filter-tag-remove" data-type="${type}" data-value="${value}">×</span>
        `;
        
        // Add remove event
        tag.querySelector('.filter-tag-remove').addEventListener('click', function() {
            removeFilter(this.dataset.type, this.dataset.value);
        });
        
        return tag;
    }
    
    // Remove a filter
    function removeFilter(type, value) {
        if (type === 'price') {
            document.querySelector('input[name="price"][value="all"]').checked = true;
        } else {
            const input = document.querySelector(`input[name="${type}"][value="${value}"]`);
            if (input) {
                input.checked = false;
            }
        }
        
        updateActiveFilters();
        renderActiveFilters();
        applyFilters();
    }
    
    // Reset all filters
    if (filterReset) {
        filterReset.addEventListener('click', () => {
            filterInputs.forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else if (input.type === 'radio' && input.value === 'all') {
                    input.checked = true;
                }
            });
            
            updateActiveFilters();
            renderActiveFilters();
            applyFilters();
        });
    }
    
    // Apply filters (would communicate with backend in production)
    function applyFilters() {
        console.log('Applying filters:', activeFilters);
        
        // In production, this would:
        // 1. Make AJAX request to server with filter parameters
        // 2. Update product grid with results
        // 3. Update pagination
        // 4. Update result count
        
        // For demonstration, we'll just log and show a brief loading state
        const productsContainer = document.getElementById('archiveProducts');
        if (productsContainer) {
            productsContainer.style.opacity = '0.5';
            setTimeout(() => {
                productsContainer.style.opacity = '1';
            }, 300);
        }
    }
    
    // ================================================
    // VIEW SWITCHER (Grid/List)
    // ================================================
    
    const viewButtons = document.querySelectorAll('.view-btn');
    const productsContainer = document.getElementById('archiveProducts');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update products container
            if (productsContainer) {
                if (view === 'list') {
                    productsContainer.classList.add('list-view');
                } else {
                    productsContainer.classList.remove('list-view');
                }
            }
            
            // Save preference to localStorage
            localStorage.setItem('productViewMode', view);
        });
    });
    
    // Load saved view preference
    const savedView = localStorage.getItem('productViewMode');
    if (savedView && productsContainer) {
        const viewButton = document.querySelector(`.view-btn[data-view="${savedView}"]`);
        if (viewButton) {
            viewButton.click();
        }
    }
    
    // ================================================
    // SORT FUNCTIONALITY
    // ================================================
    
    const sortSelect = document.getElementById('sortBy');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            console.log('Sorting by:', sortValue);
            
            // In production, this would:
            // 1. Make AJAX request with sort parameter
            // 2. Update product grid with sorted results
            
            // Show loading state
            if (productsContainer) {
                productsContainer.style.opacity = '0.5';
                setTimeout(() => {
                    productsContainer.style.opacity = '1';
                }, 300);
            }
        });
    }
    
    // ================================================
    // PAGINATION
    // ================================================
    
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    const paginationPrev = document.querySelector('.pagination-prev');
    const paginationNext = document.querySelector('.pagination-next');
    
    let currentPage = 1;
    const totalPages = 9; // Would come from server in production
    
    // Handle page number clicks
    paginationNumbers.forEach(button => {
        button.addEventListener('click', function() {
            const pageNum = parseInt(this.textContent);
            if (!isNaN(pageNum)) {
                goToPage(pageNum);
            }
        });
    });
    
    // Handle previous button
    if (paginationPrev) {
        paginationPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        });
    }
    
    // Handle next button
    if (paginationNext) {
        paginationNext.addEventListener('click', () => {
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        });
    }
    
    // Go to specific page
    function goToPage(pageNum) {
        currentPage = pageNum;
        
        // Update active state
        paginationNumbers.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.textContent) === pageNum) {
                btn.classList.add('active');
            }
        });
        
        // Update prev/next buttons
        if (paginationPrev) {
            paginationPrev.disabled = currentPage === 1;
        }
        if (paginationNext) {
            paginationNext.disabled = currentPage === totalPages;
        }
        
        // Scroll to top of products
        const archiveSection = document.querySelector('.archive-section');
        if (archiveSection) {
            const offset = 100; // Nav height
            const top = archiveSection.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
        
        // In production, this would:
        // 1. Make AJAX request for page data
        // 2. Update product grid
        // 3. Update URL with page parameter
        
        console.log('Loading page:', pageNum);
        
        // Show loading state
        if (productsContainer) {
            productsContainer.style.opacity = '0.5';
            setTimeout(() => {
                productsContainer.style.opacity = '1';
            }, 300);
        }
    }
    
    // ================================================
    // PRODUCT CARD INTERACTIONS
    // ================================================
    
    const productItems = document.querySelectorAll('.archive-product-item');
    
    productItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        });
    });
    
    // ================================================
    // KEYBOARD NAVIGATION
    // ================================================
    
    // Add keyboard support for product cards
    productItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        
        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const link = this.querySelector('.archive-product-link');
                if (link) {
                    e.preventDefault();
                    link.click();
                }
            }
        });
    });
    
    // ================================================
    // RESPONSIVE BEHAVIOR
    // ================================================
    
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close mobile filters on resize to desktop
            if (window.innerWidth > 1024 && sidebarFilters) {
                sidebarFilters.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });
    
    // ================================================
    // SCROLL POSITION RESTORATION
    // ================================================
    
    // Save scroll position before leaving page
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('archiveScrollPos', window.pageYOffset);
    });
    
    // Restore scroll position on page load
    window.addEventListener('load', () => {
        const scrollPos = sessionStorage.getItem('archiveScrollPos');
        if (scrollPos) {
            window.scrollTo(0, parseInt(scrollPos));
            sessionStorage.removeItem('archiveScrollPos');
        }
    });
    
    // ================================================
    // INITIALIZATION
    // ================================================
    
    // Initialize active filters display
    updateActiveFilters();
    renderActiveFilters();
    
    console.log('Product Archive - Interactive features initialized');
    
})();