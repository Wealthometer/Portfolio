// Contact Form Handler
import gsap from 'gsap'; // Import gsap library

class ContactForm {
    constructor() {
        this.form = null;
        this.isSubmitting = false;
    }

    init() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;
        
        this.setupEventListeners();
        this.setupValidation();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearError(input);
            });
        });
    }

    setupValidation() {
        this.validators = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Please enter a valid name (letters and spaces only)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            subject: {
                required: true,
                minLength: 5,
                message: 'Subject must be at least 5 characters long'
            },
            message: {
                required: true,
                minLength: 10,
                message: 'Message must be at least 10 characters long'
            }
        };
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const validator = this.validators[fieldName];
        
        if (!validator) return true;

        // Required validation
        if (validator.required && !value) {
            this.showError(field, `${this.capitalize(fieldName)} is required`);
            return false;
        }

        // Pattern validation
        if (value && validator.pattern && !validator.pattern.test(value)) {
            this.showError(field, validator.message);
            return false;
        }

        // Length validation
        if (value && validator.minLength && value.length < validator.minLength) {
            this.showError(field, `${this.capitalize(fieldName)} must be at least ${validator.minLength} characters long`);
            return false;
        }

        // Email specific validation
        if (fieldName === 'email' && value) {
            if (!this.isValidEmail(value)) {
                this.showError(field, 'Please enter a valid email address');
                return false;
            }
        }

        this.clearError(field);
        return true;
    }

    isValidEmail(email) {
        // More comprehensive email validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        
        if (!emailRegex.test(email)) return false;
        
        // Check for common email providers (optional validation)
        const commonProviders = [
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
            'icloud.com', 'aol.com', 'protonmail.com', 'mail.com'
        ];
        
        const domain = email.split('@')[1];
        // This is just a warning, not a blocking validation
        if (!commonProviders.includes(domain.toLowerCase())) {
            console.warn('Uncommon email provider detected:', domain);
        }
        
        return true;
    }

    showError(field, message) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        field.classList.add('error');
        
        // Animate error
        gsap.fromTo(errorElement, 
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.3 }
        );
    }

    clearError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        field.classList.remove('error');
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    async handleSubmit() {
        if (this.isSubmitting) return;
        
        if (!this.validateForm()) {
            this.showAlert('Please fix the errors above', 'error');
            return;
        }
        
        this.isSubmitting = true;
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner spin"></i> Sending...';
        submitButton.disabled = true;
        
        try {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());
            
            // Simulate form submission (replace with actual endpoint)
            await this.submitForm(data);
            
            this.showAlert('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.form.reset();
            
            // Animate success
            gsap.to(this.form, {
                scale: 0.95,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showAlert('Failed to send message. Please try again or contact me directly.', 'error');
        } finally {
            this.isSubmitting = false;
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    async submitForm(data) {
        // Create mailto link as fallback
        const subject = encodeURIComponent(data.subject);
        const body = encodeURIComponent(
            `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
        );
        const mailtoLink = `mailto:wealthhajoh87@gmail.com?subject=${subject}&body=${body}`;
        
        // Try to open email client
        window.location.href = mailtoLink;
        
        // Simulate async operation
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlert = document.querySelector('.form-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} form-alert`;
        alert.innerHTML = `
            <i class="fas fa-${this.getAlertIcon(type)} alert-icon"></i>
            <div class="alert-content">
                <div class="alert-message">${message}</div>
            </div>
        `;
        
        this.form.insertBefore(alert, this.form.firstChild);
        
        // Animate alert
        gsap.fromTo(alert, 
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.3 }
        );
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                gsap.to(alert, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    onComplete: () => alert.remove()
                });
            }
        }, 5000);
    }

    getAlertIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize contact form
window.ContactForm = new ContactForm();

// Add CSS for form validation
const formStyles = document.createElement('style');
formStyles.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    
    .form-error {
        display: none;
        color: #e74c3c;
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }
    
    .form-alert {
        margin-bottom: 2rem;
    }
    
    .spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .contact-form button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .contact-form button:disabled:hover {
        transform: none;
        box-shadow: none;
    }
`;
document.head.appendChild(formStyles);
