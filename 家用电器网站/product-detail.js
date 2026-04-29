// ================================================
// PRODUCT DETAIL PAGE - INTERACTIVE FUNCTIONALITY
// ================================================

(function() {
    'use strict';

    // ================================================
    // IMAGE GALLERY
    // ================================================
    
    const galleryThumbs = document.querySelectorAll('.gallery-thumb');
    const mainImage = document.getElementById('mainImage');
    
    galleryThumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            galleryThumbs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            // In production, this would change to the actual product image
            console.log('Switched to image index:', index);
            
            // Add animation effect
            if (mainImage) {
                mainImage.style.opacity = '0.5';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 200);
            }
        });
    });
    
    // Zoom functionality for main image
    if (mainImage) {
        mainImage.addEventListener('click', function() {
            // In production, this would open a lightbox/zoom modal
            console.log('Image zoom clicked');
            this.style.cursor = 'zoom-out';
            
            // Toggle zoom state
            if (this.style.transform === 'scale(1.5)') {
                this.style.transform = 'scale(1)';
                this.style.cursor = 'zoom-in';
            } else {
                this.style.transform = 'scale(1.5)';
                this.style.cursor = 'zoom-out';
            }
        });
    }
    
    // ================================================
    // PRODUCT OPTIONS
    // ================================================
    
    const optionButtons = document.querySelectorAll('.option-btn');
    
    let selectedOptions = {
        finish: 'white',
        size: 'medium'
    };
    
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const optionType = this.dataset.option;
            const optionValue = this.dataset.value;
            
            // Remove active class from siblings
            const siblings = document.querySelectorAll(`[data-option="${optionType}"]`);
            siblings.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update selected options
            selectedOptions[optionType] = optionValue;
            
            console.log('Selected options:', selectedOptions);
            
            // In production, this might:
            // 1. Update product price based on options
            // 2. Update product images
            // 3. Check stock availability
        });
    });
    
    // ================================================
    // QUANTITY SELECTOR
    // ================================================
    
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    
    if (decreaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }
    
    if (increaseBtn && quantityInput) {
        increaseBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            const maxValue = parseInt(quantityInput.max);
            if (currentValue < maxValue) {
                quantityInput.value = currentValue + 1;
            }
        });
    }
    
    // Validate manual input
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            const min = parseInt(this.min);
            const max = parseInt(this.max);
            
            if (isNaN(value) || value < min) {
                this.value = min;
            } else if (value > max) {
                this.value = max;
            }
        });
    }
    
    // ================================================
    // ADD TO CART
    // ================================================
    
    const addToCartBtn = document.querySelector('.btn-add-cart');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(quantityInput.value);
            
            const cartItem = {
                productId: 'LB-WB-001',
                productName: 'Elegance Countertop Basin',
                price: 850,
                quantity: quantity,
                options: selectedOptions
            };
            
            console.log('Adding to cart:', cartItem);
            
            // Show success feedback
            const originalText = this.textContent;
            this.textContent = '✓ Added to Cart';
            this.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 2000);
            
            // In production, this would:
            // 1. Add item to cart (localStorage or server)
            // 2. Update cart count in navigation
            // 3. Show cart sidebar or notification
        });
    }
    
    // ================================================
    // WISHLIST
    // ================================================
    
    const wishlistBtn = document.querySelector('.btn-wishlist');
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                console.log('Added to wishlist');
                showNotification('Added to wishlist', 'success');
            } else {
                console.log('Removed from wishlist');
                showNotification('Removed from wishlist', 'info');
            }
        });
    }
    
    // ================================================
    // PRODUCT TABS
    // ================================================
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Smooth scroll to tabs section
            const tabsSection = document.querySelector('.product-tabs-section');
            if (tabsSection) {
                const offset = 80; // Nav height
                const top = tabsSection.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
    
    // ================================================
    // REVIEWS - HELPFUL BUTTONS
    // ================================================
    
    const helpfulButtons = document.querySelectorAll('.helpful-btn');
    
    helpfulButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isYes = this.textContent.includes('Yes');
            const currentCount = parseInt(this.textContent.match(/\d+/)[0]);
            
            // Update count
            this.textContent = this.textContent.replace(/\d+/, currentCount + 1);
            
            // Disable after voting
            this.disabled = true;
            this.style.opacity = '0.6';
            this.style.cursor = 'not-allowed';
            
            console.log(`Voted helpful: ${isYes ? 'Yes' : 'No'}`);
        });
    });
    
    // ================================================
    // LOAD MORE REVIEWS
    // ================================================
    
    const loadMoreBtn = document.querySelector('.load-more-reviews');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            console.log('Loading more reviews...');
            
            // Show loading state
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;
            
            // Simulate loading
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                
                // In production, this would:
                // 1. Fetch more reviews from server
                // 2. Append to reviews list
                // 3. Update button visibility if no more reviews
            }, 1000);
        });
    }
    
    // ================================================
    // STICKY GALLERY ON SCROLL
    // ================================================
    
    const productGallery = document.querySelector('.product-gallery');
    const productInfo = document.querySelector('.product-info');
    
    if (productGallery && productInfo) {
        window.addEventListener('scroll', () => {
            const galleryHeight = productGallery.offsetHeight;
            const infoHeight = productInfo.offsetHeight;
            
            // Adjust sticky behavior based on content heights
            if (galleryHeight < infoHeight) {
                productGallery.style.position = 'sticky';
            } else {
                productGallery.style.position = 'relative';
            }
        });
    }
    
    // ================================================
    // SHARE PRODUCT (Optional Enhancement)
    // ================================================
    
    function shareProduct() {
        if (navigator.share) {
            navigator.share({
                title: 'Elegance Countertop Basin',
                text: 'Check out this luxury washbasin',
                url: window.location.href
            }).then(() => {
                console.log('Product shared successfully');
            }).catch(err => {
                console.log('Error sharing:', err);
            });
        } else {
            // Fallback: Copy link to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                showNotification('Link copied to clipboard', 'success');
            });
        }
    }
    
    // ================================================
    // NOTIFICATION SYSTEM
    // ================================================
    
    function showNotification(message, type = 'success') {
        // Remove existing notification if present
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '1rem 1.5rem',
            backgroundColor: type === 'success' ? '#4CAF50' : type === 'info' ? '#2196F3' : '#B8A992',
            color: '#FDFBF7',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            fontSize: '0.95rem',
            fontWeight: '500',
            maxWidth: '400px',
            opacity: '0',
            transform: 'translateX(20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // ================================================
    // PRICE FORMATTING
    // ================================================
    
    function formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    }
    
    // ================================================
    // DYNAMIC PRICE UPDATE (Based on Options)
    // ================================================
    
    function updatePrice() {
        const basePrice = 850;
        let additionalCost = 0;
        
        // Add cost based on selected options
        if (selectedOptions.finish === 'matte' || selectedOptions.finish === 'black') {
            additionalCost += 50;
        }
        
        if (selectedOptions.size === 'large') {
            additionalCost += 100;
        } else if (selectedOptions.size === 'small') {
            additionalCost -= 50;
        }
        
        const finalPrice = basePrice + additionalCost;
        
        // Update price display
        const priceElement = document.querySelector('.price-current');
        if (priceElement) {
            priceElement.textContent = formatPrice(finalPrice);
        }
    }
    
    // ================================================
    // URL PARAMETER HANDLING
    // ================================================
    
    function handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for specific option in URL (e.g., ?finish=black&size=large)
        const finishParam = urlParams.get('finish');
        const sizeParam = urlParams.get('size');
        
        if (finishParam) {
            const finishBtn = document.querySelector(`[data-option="finish"][data-value="${finishParam}"]`);
            if (finishBtn) {
                finishBtn.click();
            }
        }
        
        if (sizeParam) {
            const sizeBtn = document.querySelector(`[data-option="size"][data-value="${sizeParam}"]`);
            if (sizeBtn) {
                sizeBtn.click();
            }
        }
    }
    
    // ================================================
    // KEYBOARD SHORTCUTS
    // ================================================
    
    document.addEventListener('keydown', (e) => {
        // Press 'A' to add to cart
        if (e.key === 'a' || e.key === 'A') {
            if (addToCartBtn && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                addToCartBtn.click();
            }
        }
        
        // Press 'W' to toggle wishlist
        if (e.key === 'w' || e.key === 'W') {
            if (wishlistBtn && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                wishlistBtn.click();
            }
        }
        
        // Press number keys 1-4 to switch tabs
        if (e.key >= '1' && e.key <= '4') {
            const tabIndex = parseInt(e.key) - 1;
            if (tabButtons[tabIndex]) {
                e.preventDefault();
                tabButtons[tabIndex].click();
            }
        }
    });
    
    // ================================================
    // INITIALIZE WISHLIST STATE
    // ================================================
    
    function initializeWishlist() {
        // Check if product is in wishlist (from localStorage)
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const productId = 'LB-WB-001';
        
        if (wishlist.includes(productId) && wishlistBtn) {
            wishlistBtn.classList.add('active');
        }
    }
    
    // ================================================
    // RELATED PRODUCTS INTERACTIONS
    // ================================================
    
    const relatedProducts = document.querySelectorAll('.related-products .archive-product-item');
    
    relatedProducts.forEach(product => {
        product.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        });
        
        product.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        });
    });
    
    // ================================================
    // SCROLL TO REVIEWS FROM RATING
    // ================================================
    
    const ratingElement = document.querySelector('.product-rating');
    
    if (ratingElement) {
        ratingElement.style.cursor = 'pointer';
        ratingElement.addEventListener('click', () => {
            const reviewsTab = document.querySelector('[data-tab="reviews"]');
            if (reviewsTab) {
                reviewsTab.click();
            }
        });
    }
    
    // ================================================
    // INITIALIZATION
    // ================================================
    
    // Initialize on page load
    handleURLParameters();
    initializeWishlist();
    
    console.log('Product Detail - Interactive features initialized');
    console.log('Selected options:', selectedOptions);
    
})();