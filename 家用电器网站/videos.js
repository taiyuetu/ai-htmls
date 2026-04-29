// ================================================
// VIDEOS PAGE JAVASCRIPT
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================================
    // VIDEO MODAL FUNCTIONALITY
    // ================================================
    const videoModal = document.getElementById('videoModal');
    const videoModalClose = document.getElementById('videoModalClose');
    const youtubePlayer = document.getElementById('youtubePlayer');
    const customPlayer = document.getElementById('customPlayer');
    const youtubeIframe = document.getElementById('youtubeIframe');
    const videoElement = document.getElementById('videoElement');
    
    let currentVideoType = null;
    
    // Open video modal
    function openVideoModal(videoId, type) {
        currentVideoType = type;
        
        if (type === 'youtube') {
            // Show YouTube player
            youtubePlayer.style.display = 'block';
            customPlayer.style.display = 'none';
            
            // Set YouTube iframe src
            youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        } else if (type === 'hosted') {
            // Show custom video player
            youtubePlayer.style.display = 'none';
            customPlayer.style.display = 'block';
            
            // Set video source
            videoElement.src = videoId;
            videoElement.load();
            videoElement.play();
        }
        
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close video modal
    function closeVideoModal() {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Stop YouTube video
        if (currentVideoType === 'youtube') {
            youtubeIframe.src = '';
        }
        
        // Stop hosted video
        if (currentVideoType === 'hosted') {
            videoElement.pause();
            videoElement.src = '';
        }
        
        currentVideoType = null;
    }
    
    // Event listeners for modal
    videoModalClose.addEventListener('click', closeVideoModal);
    videoModal.querySelector('.video-modal-overlay').addEventListener('click', closeVideoModal);
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (videoModal.classList.contains('active') && e.key === 'Escape') {
            closeVideoModal();
        }
    });
    
    // ================================================
    // VIDEO THUMBNAIL CLICK HANDLERS
    // ================================================
    
    // Featured video
    const featuredPlayer = document.getElementById('featuredPlayer');
    if (featuredPlayer) {
        featuredPlayer.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            const type = this.getAttribute('data-type');
            openVideoModal(videoId, type);
        });
    }
    
    // All video thumbnails
    const videoThumbnails = document.querySelectorAll('.video-card .video-thumbnail');
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id') || this.getAttribute('data-video-src');
            const type = this.getAttribute('data-type');
            openVideoModal(videoId, type);
        });
    });
    
    // ================================================
    // FILTER FUNCTIONALITY
    // ================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const typeButtons = document.querySelectorAll('.type-btn');
    const videoCards = document.querySelectorAll('.video-card');
    
    let currentCategoryFilter = 'all';
    let currentTypeFilter = 'all';
    
    // Category filters
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            currentCategoryFilter = this.getAttribute('data-filter');
            
            // Apply filters
            applyFilters();
        });
    });
    
    // Type filters (YouTube/Hosted)
    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            typeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            currentTypeFilter = this.getAttribute('data-type');
            
            // Apply filters
            applyFilters();
        });
    });
    
    function applyFilters() {
        videoCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const type = card.getAttribute('data-type');
            
            const categoryMatch = currentCategoryFilter === 'all' || category === currentCategoryFilter;
            const typeMatch = currentTypeFilter === 'all' || type === currentTypeFilter;
            
            if (categoryMatch && typeMatch) {
                // Show card with animation
                card.classList.remove('filtering-out', 'hidden');
                card.classList.add('filtering-in');
                
                setTimeout(() => {
                    card.classList.remove('filtering-in');
                }, 500);
            } else {
                // Hide card with animation
                card.classList.add('filtering-out');
                
                setTimeout(() => {
                    card.classList.remove('filtering-out');
                    card.classList.add('hidden');
                }, 300);
            }
        });
        
        // Update visible count
        updateVisibleCount();
    }
    
    function updateVisibleCount() {
        const visibleCards = Array.from(videoCards).filter(card => 
            !card.classList.contains('hidden')
        );
        
        console.log(`Showing ${visibleCards.length} of ${videoCards.length} videos`);
    }
    
    // ================================================
    // LOAD MORE FUNCTIONALITY
    // ================================================
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Create loading state
            this.innerHTML = '<span class="loading-spinner"></span>';
            this.disabled = true;
            
            // Simulate loading more videos
            setTimeout(() => {
                this.innerHTML = 'No More Videos';
                this.classList.add('disabled');
                
                // In production, this would load more videos from the server
                // and append them to the grid
            }, 1500);
        });
    }
    
    // ================================================
    // VIDEO CARD HOVER ENHANCEMENTS
    // ================================================
    videoCards.forEach(card => {
        const thumbnail = card.querySelector('.video-thumbnail');
        const playButton = card.querySelector('.play-button');
        
        // Add ripple effect on click
        thumbnail.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
                animation: ripple 0.6s;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = e.clientX - rect.left + 'px';
            ripple.style.top = e.clientY - rect.top + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ================================================
    // LAZY LOADING FOR VIDEO THUMBNAILS
    // ================================================
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.01
    };
    
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.classList.add('loaded');
                
                // In production, load actual thumbnail image here
                
                observer.unobserve(card);
            }
        });
    }, observerOptions);
    
    videoCards.forEach(card => {
        videoObserver.observe(card);
    });
    
    // ================================================
    // CUSTOM VIDEO PLAYER CONTROLS ENHANCEMENT
    // ================================================
    if (videoElement) {
        // Add keyboard shortcuts
        videoElement.addEventListener('keydown', function(e) {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    if (this.paused) {
                        this.play();
                    } else {
                        this.pause();
                    }
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.currentTime += 10;
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.currentTime -= 10;
                    break;
                case 'f':
                    e.preventDefault();
                    if (this.requestFullscreen) {
                        this.requestFullscreen();
                    }
                    break;
                case 'm':
                    e.preventDefault();
                    this.muted = !this.muted;
                    break;
            }
        });
        
        // Show video loading state
        videoElement.addEventListener('loadstart', function() {
            console.log('Video loading started...');
        });
        
        videoElement.addEventListener('canplay', function() {
            console.log('Video ready to play');
        });
        
        // Handle video errors
        videoElement.addEventListener('error', function() {
            console.error('Error loading video');
            alert('Unable to load video. Please check your connection or try again later.');
        });
    }
    
    // ================================================
    // PLAYLIST FUNCTIONALITY
    // ================================================
    const playlistCards = document.querySelectorAll('.playlist-card');
    
    playlistCards.forEach(card => {
        card.addEventListener('click', function() {
            const playlistTitle = this.querySelector('.playlist-title').textContent;
            alert(`Opening playlist: ${playlistTitle}\n\nIn production, this would open a playlist view with all videos from this collection.`);
        });
    });
    
    // ================================================
    // VIDEO STATISTICS TRACKING
    // ================================================
    function trackVideoView(videoId, type) {
        // In production, send analytics to server
        console.log(`Video viewed: ${videoId} (${type})`);
        
        // Example: Send to analytics service
        // analytics.track('video_view', {
        //     video_id: videoId,
        //     video_type: type,
        //     timestamp: new Date().toISOString()
        // });
    }
    
    // Track when videos are opened
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id') || this.getAttribute('data-video-src');
            const type = this.getAttribute('data-type');
            trackVideoView(videoId, type);
        });
    });
    
    // ================================================
    // SHARE VIDEO FUNCTIONALITY
    // ================================================
    function shareVideo(videoTitle, videoUrl) {
        if (navigator.share) {
            navigator.share({
                title: videoTitle,
                text: `Check out this video: ${videoTitle}`,
                url: videoUrl
            }).then(() => {
                console.log('Video shared successfully');
            }).catch((error) => {
                console.log('Error sharing:', error);
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(videoUrl).then(() => {
                alert('Video link copied to clipboard!');
            });
        }
    }
    
    // ================================================
    // VIDEO QUALITY SELECTOR (for hosted videos)
    // ================================================
    function createQualitySelector() {
        const qualityOptions = ['360p', '720p', '1080p', '4K'];
        let currentQuality = '1080p';
        
        // In production, create UI for quality selection
        // and switch video sources based on selection
        
        return {
            getCurrentQuality: () => currentQuality,
            setQuality: (quality) => {
                if (qualityOptions.includes(quality)) {
                    currentQuality = quality;
                    console.log(`Video quality set to ${quality}`);
                    // Switch video source here
                }
            }
        };
    }
    
    const qualitySelector = createQualitySelector();
    
    // ================================================
    // PLAYBACK SPEED CONTROL
    // ================================================
    const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    let currentSpeedIndex = 3; // Default to 1x
    
    function changePlaybackSpeed(direction) {
        if (!videoElement) return;
        
        if (direction === 'increase' && currentSpeedIndex < playbackSpeeds.length - 1) {
            currentSpeedIndex++;
        } else if (direction === 'decrease' && currentSpeedIndex > 0) {
            currentSpeedIndex--;
        }
        
        videoElement.playbackRate = playbackSpeeds[currentSpeedIndex];
        console.log(`Playback speed: ${playbackSpeeds[currentSpeedIndex]}x`);
    }
    
    // ================================================
    // THUMBNAIL GENERATION (for hosted videos)
    // ================================================
    function generateThumbnail(videoUrl) {
        // Create a video element to capture thumbnail
        const video = document.createElement('video');
        video.src = videoUrl;
        video.crossOrigin = 'anonymous';
        
        video.addEventListener('loadeddata', function() {
            // Seek to 5 seconds
            video.currentTime = 5;
        });
        
        video.addEventListener('seeked', function() {
            // Create canvas and capture frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Get thumbnail as data URL
            const thumbnailUrl = canvas.toDataURL('image/jpeg');
            console.log('Thumbnail generated:', thumbnailUrl);
            
            // In production, save or use this thumbnail
        });
    }
    
    // ================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ================================================
    
    // Add ARIA labels to play buttons
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach((button, index) => {
        const card = button.closest('.video-card');
        if (card) {
            const title = card.querySelector('.video-title');
            if (title) {
                button.setAttribute('aria-label', `Play video: ${title.textContent}`);
            }
        }
    });
    
    // Add keyboard navigation for video cards
    videoCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const thumbnail = this.querySelector('.video-thumbnail');
                if (thumbnail) {
                    thumbnail.click();
                }
            }
        });
    });
    
    // ================================================
    // VIDEO DURATION FORMATTER
    // ================================================
    function formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    // ================================================
    // WATCH LATER / FAVORITES FUNCTIONALITY
    // ================================================
    let watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    function addToWatchLater(videoId) {
        if (!watchLater.includes(videoId)) {
            watchLater.push(videoId);
            localStorage.setItem('watchLater', JSON.stringify(watchLater));
            console.log('Added to Watch Later:', videoId);
        }
    }
    
    function addToFavorites(videoId) {
        if (!favorites.includes(videoId)) {
            favorites.push(videoId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            console.log('Added to Favorites:', videoId);
        }
    }
    
    function removeFromWatchLater(videoId) {
        watchLater = watchLater.filter(id => id !== videoId);
        localStorage.setItem('watchLater', JSON.stringify(watchLater));
    }
    
    function removeFromFavorites(videoId) {
        favorites = favorites.filter(id => id !== videoId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    // ================================================
    // SMOOTH SCROLL FOR FILTER BAR
    // ================================================
    const videoFilters = document.querySelector('.video-filters');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            videoFilters.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            videoFilters.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
    
    // ================================================
    // INITIAL SETUP
    // ================================================
    
    console.log('Video library initialized');
    console.log(`Total videos: ${videoCards.length}`);
    
    // Initial filter application
    applyFilters();
    
});
