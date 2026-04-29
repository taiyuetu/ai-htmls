// ================================================
// CONTACT PAGE SPECIFIC JAVASCRIPT
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================================
    // FORM VALIDATION AND SUBMISSION
    // ================================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Validate required fields
            if (validateForm(data)) {
                // Show success message
                showSuccessMessage();
                
                // Reset form
                contactForm.reset();
                
                // In production, send data to server
                console.log('Form data:', data);
            }
        });
    }
    
    // ================================================
    // FORM VALIDATION
    // ================================================
    function validateForm(data) {
        const requiredFields = ['firstName', 'lastName', 'email', 'inquiryType', 'subject', 'message'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            const value = data[field];
            
            if (!value || value.trim() === '') {
                showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(input);
            }
        });
        
        // Validate email format
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailInput = document.getElementById('email');
            
            if (!emailRegex.test(data.email)) {
                showFieldError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Validate privacy checkbox
        const privacyCheckbox = document.querySelector('input[name="privacy"]');
        if (privacyCheckbox && !privacyCheckbox.checked) {
            showFieldError(privacyCheckbox.parentElement, 'You must agree to the privacy policy');
            isValid = false;
        }
        
        return isValid;
    }
    
    // ================================================
    // ERROR DISPLAY
    // ================================================
    function showFieldError(element, message) {
        // Remove existing error
        clearFieldError(element);
        
        // Add error class
        if (element.tagName === 'LABEL') {
            element.classList.add('error');
        } else {
            element.classList.add('error');
        }
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#d32f2f';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '0.25rem';
        
        // Insert after element
        if (element.tagName === 'LABEL') {
            element.parentElement.appendChild(errorDiv);
        } else {
            element.parentElement.appendChild(errorDiv);
        }
    }
    
    function clearFieldError(element) {
        element.classList.remove('error');
        const errorDiv = element.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    // ================================================
    // SUCCESS MESSAGE
    // ================================================
    function showSuccessMessage() {
        // Create success overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        // Create success message
        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            background: #FDFBF7;
            padding: 3rem;
            border-radius: 4px;
            max-width: 500px;
            text-align: center;
            animation: slideUp 0.3s ease;
        `;
        
        messageBox.innerHTML = `
            <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; background: #B8A992; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FDFBF7" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </div>
            <h2 style="font-size: 2rem; font-weight: 300; color: #2C2C2C; margin-bottom: 1rem;">Thank You!</h2>
            <p style="font-size: 1.1rem; color: #5A5A5A; margin-bottom: 2rem;">Your message has been sent successfully. We'll get back to you within 24 hours.</p>
            <button class="btn btn-primary" onclick="this.closest('.success-overlay').remove()">Close</button>
        `;
        
        overlay.appendChild(messageBox);
        document.body.appendChild(overlay);
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Auto close after 5 seconds
        setTimeout(() => {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        }, 5000);
    }
    
    // ================================================
    // LIVE CHAT BUTTON
    // ================================================
    const chatButton = document.querySelector('.method-button');
    
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            alert('Live chat feature would open here. In production, this would connect to your customer service platform.');
        });
    }
    
    // ================================================
    // REAL-TIME INPUT VALIDATION
    // ================================================
    const emailInput = document.getElementById('email');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                showFieldError(this, 'Please enter a valid email address');
            } else {
                clearFieldError(this);
            }
        });
    }
    
    // ================================================
    // CHARACTER COUNTER FOR MESSAGE
    // ================================================
    const messageTextarea = document.getElementById('message');
    
    if (messageTextarea) {
        const maxLength = 1000;
        
        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.85rem;
            color: #5A5A5A;
            margin-top: 0.25rem;
        `;
        counter.textContent = `0 / ${maxLength} characters`;
        
        messageTextarea.parentElement.appendChild(counter);
        
        // Update counter on input
        messageTextarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length} / ${maxLength} characters`;
            
            if (length > maxLength) {
                counter.style.color = '#d32f2f';
                this.value = this.value.substring(0, maxLength);
            } else if (length > maxLength * 0.9) {
                counter.style.color = '#ff9800';
            } else {
                counter.style.color = '#5A5A5A';
            }
        });
        
        // Set max length
        messageTextarea.setAttribute('maxlength', maxLength);
    }
    
    // ================================================
    // SMOOTH SCROLL TO FORM FROM METHODS
    // ================================================
    const methodCards = document.querySelectorAll('.method-card');
    
    methodCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Only scroll if not clicking a link or button
            if (!e.target.closest('a') && !e.target.closest('button')) {
                const formSection = document.querySelector('.contact-form-section');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // Focus on first input after scroll
                    setTimeout(() => {
                        document.getElementById('firstName').focus();
                    }, 500);
                }
            }
        });
    });
    
    // ================================================
    // FAQ ACCORDION (OPTIONAL ENHANCEMENT)
    // ================================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', function() {
            // Toggle expanded class
            this.classList.toggle('expanded');
            
            // Optional: Add rotation to question or icon if you want accordion behavior
        });
    });
    
});
